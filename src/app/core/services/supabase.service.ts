import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../enviroment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private lockRetryCount = 0;
  private maxRetries = 3;
  private retryDelay = 100; // milliseconds
  private lockTimeout = 5000; // milliseconds
  private isInitialized = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Try to acquire the lock
      const lock = await this.acquireLock();
      
      if (lock) {
        this.supabase = createClient(
          environment.SUPABASE_URL,
          environment.SUPABASE_ANON_KEY,
          {
            auth: {
              persistSession: true,
              storageKey: 'sb-token',
              autoRefreshToken: true,
              detectSessionInUrl: false
            }
          }
        );
        
        this.isInitialized.next(true);
        // Release the lock after initialization
        await lock.release();
      }
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      // Retry initialization if needed
      if (this.lockRetryCount < this.maxRetries) {
        this.lockRetryCount++;
        setTimeout(() => this.initializeClient(), this.retryDelay);
      }
    }
  }

  private async acquireLock(): Promise<Lock | null> {
    try {
      return await navigator.locks.request('lock:sb-fqrqmuumppqjhahgbcjx-auth-token', 
        { mode: 'exclusive', ifAvailable: true }, 
        async (lock) => lock
      );
    } catch (error) {
      console.warn('Lock acquisition failed:', error);
      return null;
    }
  }

  get client(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabase;
  }

  isReady() {
    return this.isInitialized.asObservable();
  }
}
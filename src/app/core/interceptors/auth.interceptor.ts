import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { switchMap, take } from 'rxjs/operators';
import { from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseService = inject(SupabaseService);

  return supabaseService.isReady().pipe(
    take(1),
    switchMap(async () => {
      const session = await supabaseService.client.auth.getSession();
      const authToken = session.data.session?.access_token || '';

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      return next(authReq);
    })
  );
};
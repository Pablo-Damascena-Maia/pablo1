import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../components/user-view/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Mock user data
  private mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main Street',
      city: 'New York',
      zipcode: '10001'
    },
    company: {
      name: 'Tech Solutions Inc.',
      role: 'Senior Developer'
    },
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  };

  constructor() { }

  getUser(): Observable<User> {
    // In a real app, this would be an HTTP call
    return of(this.mockUser);
  }
}

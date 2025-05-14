import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}

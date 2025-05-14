import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  dropdownUserOpen = false;
  dropdownNotificationOpen = false;

  constructor(private router: Router, private loginService : LoginService){}
  ngOnInit(): void {

  }

  toggleNotificationDropdown(): void {
    this.dropdownNotificationOpen = !this.dropdownNotificationOpen;
    this.dropdownUserOpen = false;
  }

  toggleUserDropdown(): void {
    this.dropdownUserOpen = !this.dropdownUserOpen;
    this.dropdownNotificationOpen = false;
  }

  logoOut(){
    this.loginService.logout();
    this.router.navigate(['']);
  }

}

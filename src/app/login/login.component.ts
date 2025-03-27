import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { YeyeapisService } from '../services/yeyeapis.service'; // Adjust the path as needed

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  role: string = "";
  userId: string = "";
  email: string = '';
  password: string = '';
  userType: string = ''; // Holds 'admin' or 'client'
  accountType: string = ''; // Holds 'admin' or 'client'
  errorMessage: string = '';  // To show error message
  passwordVisible: boolean = false;  // Track visibility of password

  constructor(private yeyeapisService: YeyeapisService, private router: Router) {}

  register() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle visibility
  }

  onSubmit(loginForm: NgForm) {
    if (!this.email) {
      this.errorMessage = 'Email is required.';
      console.log('Email is required.');
      return;
    }
  
    this.yeyeapisService.login(this.email, this.password).subscribe(
      (res: any) => {
        console.log('Login response:', res); // Debugging
  
        // Ensure response contains required fields
        if (res.status === 200 && res.user) {
          sessionStorage.setItem('id', res.user.id); 
          sessionStorage.setItem('email', res.user.email); 
          sessionStorage.setItem('role', res.user.role); // Store role
          
          swal.fire('Success', 'Logged in successfully', 'success');
          this.router.navigate(['dashboard']);
        } else {
          swal.fire('Error', 'Invalid login response', 'error');
        }
      },
      (error) => {
        console.log('Login error:', error); // Log actual error
  
        if (error.status === 401) {
          swal.fire('Error', 'Invalid email or password', 'error');
        } else if (error.status === 403) {
          swal.fire('Error', 'Please verify your email before logging in', 'warning');
        } else {
          swal.fire('Error', 'Something went wrong. Try again later.', 'error');
        }
      }
    );
  }
  
}

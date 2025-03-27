import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { YeyeapisService } from '../services/yeyeapis.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private yeyeapisService: YeyeapisService, private router: Router) {}

  onSubmit(registerForm: NgForm) {
    this.yeyeapisService.register(this.name, this.email, this.phone, this.password).subscribe(
      (res: any) => {
        // If res is an HttpResponse, use res.status
        if (res instanceof HttpResponse) {
          if (res.status === 200 || res.status === 201) {
            if (typeof window !== 'undefined' && window.localStorage) {
             sessionStorage.setItem('email', this.email); // Store email in localStorage
            }
            swal.fire('Success', res.body.message, 'success');
            this.router.navigate(['/verify']);
          } else {
            swal.fire('Error', 'Registration failed! Try again.', 'error');
          }
        }
        // If response contains a status field, use it
        else if (res.status === 200 || res.status === 201) {
          swal.fire('Success', res.message, 'success');
          this.router.navigate(['/verify']);
        } else {
          swal.fire('Error', 'Registration failed! Try again.', 'error');
        }
      },
      (error) => {
        if (error.status === 409 && error.error && error.error.message) {
          this.errorMessage = error.error.message;
          swal.fire('Error', this.errorMessage, 'error');
        } else if (error.status === 400 && error.error && error.error.message) {
          this.errorMessage = error.error.message;
          swal.fire('Error', this.errorMessage, 'error');
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
          swal.fire('Error', this.errorMessage, 'error');
        }
        console.error('Registration Error:', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}

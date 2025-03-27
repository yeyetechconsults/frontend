import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { YeyeapisService } from '../services/yeyeapis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class VerifyComponent {
  email: string = ''; // Pre-filled email
  verificationCode: string = '';
  errorMessage: string = '';

  constructor(private yeyeapisService: YeyeapisService, private router: Router) {
    // Assuming email is stored in localStorage after signup
    if (typeof window !== 'undefined' && window.localStorage) {
      this.email = sessionStorage.getItem('email') || ''; // Retrieve stored email
    }
  }

  onSubmit(verifyForm: NgForm) {
    // Clear any previous error messages
    this.errorMessage = '';

    // Validate the form
    if (!this.verificationCode) {
      this.errorMessage = 'Verification code is required.';
      return;
    }

    // Call API to verify the account
    this.yeyeapisService.verify(this.email, this.verificationCode).subscribe(
      (res: any) => {
        // Log the response status for debugging
        console.log('Response Status:', res.status);

        // Check if response status is 200 or 201 for success
        if (res && (res.status === 200 || res.status === 201)) {
          swal.fire('Success', 'Account verified. Login to continue!', 'success');
          this.router.navigate(['/login']); // Navigate to dashboard after success
        } else {
          // If the status is not 200 or 201, display the error message or a default one
          swal.fire('Error', res.message || 'Invalid verification code.', 'error');
        }
      },
      (error) => {
        // Improved error handling with console log
        swal.fire('Error', 'Verification failed! Try again.', 'error');
        console.error('Verification Error:', error);
      }
    );
  }
}

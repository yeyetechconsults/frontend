import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const userId = sessionStorage.getItem('id');
    const email = sessionStorage.getItem('email');
    const userRole = sessionStorage.getItem('role'); // Retrieve role from sessionStorage

    if (userId && email && userRole) {
      const allowedRoles = ['client', 'admin']; // Define allowed roles
      const expectedRoles = route.data?.['role']; // Fetch expected roles from route data

      if (!allowedRoles.includes(userRole)) {
        alert(`NOT AUTHORIZED FOR THIS ROLE`);
        router.navigate(['/dashboard']); // Redirect to dashboard
        return false;
      }

      if (Array.isArray(expectedRoles)) {
        // Check if userRole is in the allowed roles for the route
        if (!expectedRoles.includes(userRole)) {
          alert(`NOT AUTHORIZED FOR THIS ROLE`);
          router.navigate(['/dashboard']);
          return false;
        }
      } else if (userRole !== expectedRoles) {
        // Handle single role as a fallback
        alert(`NOT AUTHORIZED FOR THE ROLE ${expectedRoles}`);
        router.navigate(['/dashboard']);
        return false;
      }

      return true;
    } else {
      Swal.fire({
        title: 'NOT AUTHORIZED!',
        confirmButtonText: 'Login to start'
      });
      router.navigate(['/login']);
      return false;
    }
  }

  return false; // Deny access for server-side rendering
};

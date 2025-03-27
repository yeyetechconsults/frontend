import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private router: Router) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {  // Ensure running in the browser
      const role = sessionStorage.getItem('role') || '';
      const email = sessionStorage.getItem('email') || '';
  
      if (!role || !email) {
        this.router.navigate(['/login']);
      }
    }
  }
}

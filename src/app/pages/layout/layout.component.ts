import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminComponent } from "../admin/admin.component";
import { FooterComponent } from "../../footer/footer.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarVisible: boolean = true; // Sidebar is visible by default
  message: string = ''; // To show success/error messages
  messageType: string = ''; // To determine the type of message ('success' or 'error')
  role: string | null = null;
  email: string | null = null;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.role = sessionStorage.getItem("role");
    this.email = sessionStorage.getItem("email");

    const hamBurger = this.renderer.selectRootElement('.toggle-btn', true);
    const sidebar = this.renderer.selectRootElement('#sidebar', true);
    const main = this.renderer.selectRootElement('#main', true);

    // Ensure the sidebar is visible by default
    this.renderer.removeClass(sidebar, 'd-none');
    this.renderer.addClass(sidebar, 'd-block');
    this.sidebarVisible = true;

    this.renderer.listen(hamBurger, 'click', () => {
      this.toggleSidebar();
    });

    if (!this.role) {
      // Clear the session storage
      sessionStorage.clear();
      // Navigate to the home or login page
      this.router.navigateByUrl("login");
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    const sidebar = this.renderer.selectRootElement('#sidebar', true);
    if (this.sidebarVisible) {
      this.renderer.removeClass(sidebar, 'd-none');
      this.renderer.addClass(sidebar, 'd-block');
    } else {
      this.renderer.removeClass(sidebar, 'd-block');
      this.renderer.addClass(sidebar, 'd-none');
    }
  }

  clients() {
    Swal.fire('Clients', 'Nothing here yet', 'info');
  }

  projects() {
    this.router.navigateByUrl("projects");
  }

  newproject() {
    this.router.navigateByUrl("new-project");
  }

  projectrequests() {
    Swal.fire('Requests', 'Nothing here yet', 'info');
  }

  logout(): void {
    // Clear the session storage
    sessionStorage.clear();
    // Navigate to the login page
    this.router.navigateByUrl("login");
  }
}

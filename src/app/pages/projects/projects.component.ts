import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YeyeapisService } from '../../services/yeyeapis.service';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  totalProjects: number = 0;
  projects: any[] = [];
  selectedCategory: string = '';
  paginatedProjects: any[] = [];

  constructor(private yeyeapisService: YeyeapisService) {}
  router=inject(Router);

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.yeyeapisService.fetchAllProjects().subscribe(
      (data: any[]) => {
        this.projects = data;
        this.totalProjects = data.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  searchProjects() {
    this.yeyeapisService.searchProjects(this.searchTerm, this.selectedCategory).subscribe(
      (data: any[]) => {
        this.projects = data;
        this.totalProjects = data.length;
        this.currentPage = 1;
        this.updatePagination();
      },
      (error) => {
        console.error('Error searching projects:', error);
      }
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.fetchProjects();
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updatePagination() {
    const itemsPerPage = 5;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    this.paginatedProjects = this.projects.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.projects.length / itemsPerPage);
  }

  viewproject(pdfpath:string){

    Swal.fire({
      html: `
      <div style="color: red; text-align: center;">
      <i class="bi bi-gem" style="font-size: 3rem; color: red;"></i>
      <p>This is a premium project.</p><p> To view its details, pay USD 1,300</p>
      </div>
      `,
      confirmButtonText: 'Pay',
      confirmButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
      this.contact();
      }
    });
  }

previewProject(project: any) {
  this.router.navigate(['/view-project', project.id]);  // Navigate with project ID
}
  contact(): void {
    Swal.fire({
      html: `<h2 class="text-center text-primary">Contact Us</h2>
        <form id="contactForm" class="p-3 bg-white rounded">
            <div class="mb-3">
                <input type="text" class="form-control" id="name" name="from_name" placeholder="Name" required>
            </div>
            <div class="mb-3">
                <input type="tel" class="form-control" id="phone" name="phone" placeholder="Phone" required>
            </div>
            <div class="mb-3">
                <input type="email" class="form-control" id="email" name="email" placeholder="Email" required>
            </div>
            <div class="mb-3">
                <textarea class="form-control" id="message" name="message" rows="4" placeholder="Message" required></textarea>
            </div>
            <div class="mb-3 form-check d-flex align-items-center gap-2">
                <input type="checkbox" class="form-check-input" id="notRobot" required>
                <label class="form-check-label mb-0" for="notRobot">I am not a robot</label>
            </div>
            <button type="button" class="btn btn-secondary" id="cancelButton">Cancel</button>
            <button type="submit" class="btn btn-primary" id="sendMessage">Send Message <i class="ms-2 bi bi-send"></i></button>
        </form>
      `,
      showConfirmButton: false,
      allowOutsideClick: false
    });

    setTimeout(() => {
      const cancelButton = document.getElementById('cancelButton');
      const contactForm = document.getElementById('contactForm') as HTMLFormElement;
      const sendMessageButton = document.getElementById('sendMessage') as HTMLButtonElement;
      
      if (cancelButton) {
        cancelButton.addEventListener('click', () => Swal.close());
      }

      if (contactForm) {
        contactForm.addEventListener('submit', (event: Event) => {
          event.preventDefault();
          if (!sendMessageButton) return;

          sendMessageButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Sending...`;
          sendMessageButton.disabled = true;

          emailjs.init("LMwqqHbi79r1vzhuD");

          const formData = {
            from_name: (document.getElementById("name") as HTMLInputElement).value,
            phone: (document.getElementById("phone") as HTMLInputElement).value,
            email: (document.getElementById("email") as HTMLInputElement).value,
            message: (document.getElementById("message") as HTMLTextAreaElement).value,
            reply_to: (document.getElementById("email") as HTMLInputElement).value
          };

          emailjs.send("service_whlcu1a", "template_mq32woi", formData)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Thank you for contacting us.",
                confirmButtonText: "OK"
              });
            })
            .catch((error) => {
              console.error("EmailJS Error:", error);
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong. Please try again.",
                confirmButtonText: "OK"
              });
            })
            .finally(() => {
              sendMessageButton.innerHTML = `Send Message <i class="ms-2 bi bi-send"></i>`;
              sendMessageButton.disabled = false;
            });
        });
      }
    }, 100);
  }
}

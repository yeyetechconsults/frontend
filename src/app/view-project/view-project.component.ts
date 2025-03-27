import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YeyeapisService } from '../services/yeyeapis.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

declare var pdfjsLib: any; // Declare PDF.js global variable

@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit, AfterViewInit {
  project: any;
  safePdfUrl: SafeResourceUrl | undefined;

  constructor(
    private route: ActivatedRoute,
    private yeyeapisService: YeyeapisService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.yeyeapisService.getSignedUrlForProject(projectId).subscribe({
        next: (data) => {
          this.project = data.project;
          this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.signedUrl);
          console.log('Sanitized PDF URL:', this.safePdfUrl);
        },
        error: (error) => {
          console.error('Error fetching project details:', error);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.safePdfUrl) {
      this.loadPdf(this.safePdfUrl.toString());
    }
  }

  loadPdf(pdfUrl: string) {
    // PDF.js setup
    const canvas = <HTMLCanvasElement>document.getElementById('pdf-canvas');
    const context = canvas?.getContext('2d');
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then((pdf: any) => {
      console.log('PDF Loaded');
      pdf.getPage(1).then((page: any) => {
        const scale = 1.5;  // Adjust scale for better rendering
        const viewport = page.getViewport({ scale: scale });

        // Set the canvas size to match the page size
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page into the canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }).catch((error: any) => {
      console.error('Error loading PDF: ', error);
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();  // Prevent the context menu from opening (right-click)
    alert("Copying or downloading is disabled.");
  }

  buyProject() {
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

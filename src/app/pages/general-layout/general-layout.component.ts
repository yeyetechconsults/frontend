import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { LoginComponent } from "../../login/login.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-general-layout',
  standalone: true,
  imports: [RouterOutlet,  FooterComponent],
  templateUrl: './general-layout.component.html',
  styleUrl: './general-layout.component.css'
})
export class GeneralLayoutComponent {
  constructor(private router:Router){

  }
  contactUs(): void {
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
  home():any{
    this.router.navigateByUrl("");
}
projects():any{
  this.router.navigateByUrl("projects");
}
  login():any{
       this.router.navigateByUrl("login");
  }
}

function contactus() {
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
                <button type="submit" class="btn btn-primary" id="sendMessage">
                   Send Message <i class="ms-2 bi bi-send"></i> 
                </button>
            </form>
        `,
        showConfirmButton: false,
        allowOutsideClick: false
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        Swal.close();
    });

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const sendButton = document.getElementById('sendMessage');
        sendButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Sending...`;
        sendButton.disabled = true;

        emailjs.init("LMwqqHbi79r1vzhuD"); // Initialize EmailJS

        const formData = {
            from_name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
            reply_to: document.getElementById("email").value // Optional, can be removed
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
                    html: `<span class="text-danger">Something went wrong. Please try again.</span>`,
                    confirmButtonText: "OK"
                });
            })
            .finally(() => {
                sendButton.innerHTML = `Send Message <i class="ms-2 bi bi-send"></i>`;
                sendButton.disabled = false;
            });
    });
}

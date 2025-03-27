import { Component } from '@angular/core';
import { YeyeapisService } from '../../services/yeyeapis.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent {
  projectForm: FormGroup;
  selectedFile!: File;
  ngOnInit(): void {
    if (typeof window !== 'undefined') {  // Ensure running in the browser
      const role = sessionStorage.getItem('role') || '';
      const email = sessionStorage.getItem('email') || '';
  
      if (!role || !email) {
        this.router.navigate(['/login']);
      }
    }
  }

  constructor(private fb: FormBuilder, private yeyeapisService: YeyeapisService, private router: Router) {  // Inject Router
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [''],
      pdf: [null, [Validators.required, this.fileValidator]]  // Added custom file validator
    });
  }

  // Custom validator for file input
  fileValidator(control: any): { [key: string]: boolean } | null {
    if (control.value === null) {
      return { 'fileRequired': true }; // Custom error for file missing
    }
    return null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.projectForm.patchValue({
      pdf: this.selectedFile  // Set the selected file to the form control
    });
    this.projectForm.get('pdf')?.updateValueAndValidity();  // Trigger validation update for the file input
  }

  submitProject() {
    if (this.projectForm.invalid || !this.selectedFile) {
      alert('Please fill all required fields and upload a PDF file.');
      return;
    }

    const { title, description, category } = this.projectForm.value;
    this.yeyeapisService.addProject(title, description, category, this.selectedFile)
      .subscribe({
        next: () => {
            Swal.fire('Success', 'Project added successfully!', 'success');
          this.router.navigate(['/projects']);  // Navigate to projects page
        },
        error: (error) => {
          console.error('Error adding project:', error);
          alert('Failed to add project.');
        }
      });
  }
}

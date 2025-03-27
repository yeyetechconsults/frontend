import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YeyeapisService {
 public apiUrl = 'https://yeyetechconsults.net/api';
//public apiUrl = 'http://localhost:5000/api';


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
    // Register method
    register(name: string, email: string, phone: string, password: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/register`, { name, email, phone, password });
    }
  
    // Verify account method
    verify(email: string, verificationCode: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/verify`, { email, verificationCode });
    }
    
    forgotPassword(email: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }
  
    // Reset Password
    resetPassword(email: string, token: string, newPassword: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/reset-password`, { email, token, newPassword });
    }

  uploadProject(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  searchProjects(query: string, category?: string): Observable<any> {
    let params: any = { query };
    if (category) params.category = category;
    return this.http.get(`${this.apiUrl}/projects`, { params });
  }

  getSignedUrlForProject(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/project/${id}`);
  }
  


  

  fetchAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-projects`);
  }

  addProject(title: string, description: string, category: string, pdfFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('pdf', pdfFile);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}

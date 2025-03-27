import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {  HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HttpClientModule],  // Import HttpClientModule
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'yeye-frontend';
  showcart: boolean = true;

  constructor(private router: Router) {}

  projects(): any {
    this.router.navigateByUrl("projects");
  }

  ngOnInit(): void {
   
  }
  
}

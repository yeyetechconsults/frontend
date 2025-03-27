import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guard/auth.guard';
import { GeneralLayoutComponent } from './pages/general-layout/general-layout.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { ViewProjectComponent } from './view-project/view-project.component';

export const routes: Routes = [
   // Public route
  { path: '', component: GeneralLayoutComponent,
    children:[
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent }, // Public route
      { path: 'register', component: RegisterComponent },
      { path: 'verify', component: VerifyComponent }
    ]
   },
  {
    path: '',
    component: LayoutComponent,
    children: [
      
      {path:'dashboard',
        component:AdminComponent,
        canActivate:[authGuard],
        data:{role:['admin','client']}
      },
      {path:'projects',
        component:ProjectsComponent,
        canActivate:[authGuard],
        data:{role:['admin','client']}
      },
      { path: 'view-project/:id', component: ViewProjectComponent, canActivate: [authGuard], data: { role: ['admin', 'client'] } },
      
      {path:'new-project',
        component:NewProjectComponent,
        canActivate:[authGuard],
        data:{role:['admin']}
      }
    ],
  },
  { path: '**', redirectTo: '' }, // Catch-all for unknown routes
];

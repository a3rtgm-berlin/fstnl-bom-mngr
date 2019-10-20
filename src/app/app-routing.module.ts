import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XlsLoaderComponent } from './xls-loader/xls-loader.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CompareOrdersComponent } from './compare-orders/compare-orders.component';
import { MasterViewComponent } from './master-view/master-view.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { Observable } from 'rxjs';
import { MatrixFilesComponent } from './matrix-files/matrix-files.component';
import { MasterlistviewComponent } from './masterlistview/masterlistview.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard} from '../app/services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '',  redirectTo: '/app/projects', pathMatch: 'full' },
  { path: 'app/login', component: LoginComponent},
  { path: 'app/projects', component: ManageProjectsComponent, canActivate: [AuthGuard] },
  { path: 'app/lists', component: ProjectListComponent, canActivate: [AuthGuard]  },
  { path: 'app/master/view/:id', component: MasterViewComponent, canActivate: [AuthGuard]  },
  { path: 'app/lists/compare/:id1/:id2', component: CompareOrdersComponent, canActivate: [AuthGuard]  },
  { path: 'app/matrix', component: MatrixFilesComponent, canActivate: [AuthGuard] },
  { path: 'app/masterlistview', component: MasterlistviewComponent, canActivate: [AuthGuard]  },
  { path: 'app/settings', component: SettingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

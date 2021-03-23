import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {GridComponent} from './components/grid/grid.component';


const routes: Routes = [
  { path: '', component: GridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['/']);
    };
  }
}

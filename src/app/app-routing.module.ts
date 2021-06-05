import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialTableDemoComponent } from './material-table-demo/material-table-demo.component';

const routes: Routes = [
  { path: 'table-component', component: MaterialTableDemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

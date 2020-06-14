import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';

@NgModule({
  imports: [
      CommonModule,
      PatientsRoutingModule,
  ],
  declarations: [
      PatientsComponent,
  ],
})
export class PatientsModule { }

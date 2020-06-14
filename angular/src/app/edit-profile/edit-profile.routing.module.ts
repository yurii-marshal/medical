import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';

export const editProfileRoutes: Routes = [
    {
        path: '',
        component: EditProfileComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(editProfileRoutes)],
    exports: [RouterModule],
})

export class EditProfileRoutingModule { }

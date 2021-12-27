import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FileUploadPage } from './file-upload.page';

const routes: Routes = [{
  path: '',
  component: FileUploadPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUploadRoutingModule {
}

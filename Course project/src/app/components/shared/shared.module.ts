// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { LoaderInterceptor } from 'src/app/core/interceptors/loading.interceptor';
// import { LoaderService } from 'src/app/core/services/loading-service';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  //   providers:[
  //     LoaderService,
  //     {
  //       provide: HTTP_INTERCEPTORS,
  //       useClass: LoaderInterceptor,
  //       multi: true,
  //     },
  //   ]
})
export class SharedModule {}

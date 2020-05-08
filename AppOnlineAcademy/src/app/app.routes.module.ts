import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./components/landing/home-page/home-page.component";
import { AuthTemplateComponent } from "./components/authentication/auth-template/auth-template.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
    canActivate: [AuthGuard],
    pathMatch: "full",
  },
  { path: "home", component: HomePageComponent, canActivate: [AuthGuard] },
  { path: "login", component: AuthTemplateComponent },
  { path: "register", component: AuthTemplateComponent },
  {
    path: "courses",
    canActivate: [AuthGuard],
    pathMatch: "full",
    loadChildren: "./components/courses/courses.module#CoursesModule",
  },
  { path: "**", component: HomePageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutesModule {}

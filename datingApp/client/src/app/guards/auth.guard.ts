import { Injectable } from "@angular/core";
import {  CanActivate } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class authGuard implements CanActivate {
  constructor(private toastr: ToastrService) {}

  canActivate(): boolean {
    const user = localStorage.getItem("user");
    if(!user){
      this.toastr.error("You shall not pass!");
      return false;
    } else{
      return true;
    }
  }
}

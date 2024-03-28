import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class adminGuard implements CanActivate {
  constructor(private accountService: AccountService,private toastr: ToastrService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user=>{
        if(user?.roles.includes("Admin") || user?.roles.includes("Moderator")){
          return true;
        }
        this.toastr.error("You cannot  enter this area");
        return false;
      })
    )
  }
}

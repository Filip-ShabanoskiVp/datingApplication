import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable()
export class jwtInterceptor implements HttpInterceptor{

  constructor(private accountServeice: AccountService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.accountServeice.currentUser$.pipe(
      take(1),
      switchMap(user =>{
        if(user) {
            req = req.clone({
              setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
        })
      }

      return next.handle(req);
    }))

  }
};

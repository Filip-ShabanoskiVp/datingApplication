import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  model: any = {};

  constructor(public acconutService: AccountService, private router: Router, private toastr: ToastrService,private fb: FormBuilder){}

  ngOnInit(): void {
  }


  login() {
    this.acconutService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.model = {};
      }
    })
  }

  logout(){
    this.acconutService.logout();
    this.router.navigateByUrl("/");
  }

}

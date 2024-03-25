import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent  implements OnInit{
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(response=>{
      console.log(response);
      this.cancel();
    }, error=>{
      console.log(error)
      this.toastr.error(error.error);
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}

import { Component, OnInit } from '@angular/core';
import { IUser } from './models/user';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'The dating app';
  users: any;

  constructor(private accountService: AccountService, private presence: PresenceService) {}

  ngOnInit(): void {
    if(typeof localStorage !== "undefined"){
      this.setCurrentUser();
    }
  }

  setCurrentUser(){
    const userString: string | null = localStorage.getItem("user");

    if(userString != null){
    const user: IUser = JSON.parse(userString);
    if(user){
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
    }
  }
}

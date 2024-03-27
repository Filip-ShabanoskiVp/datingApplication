import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { Observable, take } from 'rxjs';
import { Pagination } from '../../models/pagination';
import { UserParams } from '../../models/userParams';
import { AccountService } from '../../services/account.service';
import { IUser } from '../../models/user';

@Component({
  selector: 'app-momber-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  members!: Member[];
  pagination!: Pagination;
  userParams!: UserParams;
  user!: IUser;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(private memberService: MembersService){
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response=>{
      this.members = response.result.flat();
      this.pagination = response.pagination;
    })
  }

  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}

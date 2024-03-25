import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-momber-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  members$!: Observable<Member[]>
  constructor(private memberService: MembersService ){}

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }
}

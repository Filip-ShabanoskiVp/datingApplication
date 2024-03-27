import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent implements OnInit{
  @Input() member!: Member

  constructor(private memberService: MembersService, private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  addMember(member: Member){
    this.memberService.addLike(this.member.username).subscribe(()=>{
      this.toastr.success("You have liked "+ this.member.knownAs);
    });
  }

}

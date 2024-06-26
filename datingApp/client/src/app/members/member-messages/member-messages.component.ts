import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { MembersService } from '../../services/members.service';
import { NgForm } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @ViewChild('messageForm') messageForm!: NgForm
  @Input() username!: string;
  @Input() messages: Message[] = [];
  messageContent!: string;

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {
  }

  sendMessage(){
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages: Message[] = [];
  pagination!: Pagination;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;
  loading = false

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response=>{
      this.messages = response.result.flat();
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: number){
    this.messageService.deletMessage(id).subscribe(()=>{
      this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
    })
  }

  pageChanged(event: any){
    if(this.pageNumber!=event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}

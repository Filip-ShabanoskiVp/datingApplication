import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { IUser } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-momber-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static: true}) memberTabs!: TabsetComponent;
  member!: Member ;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  activeTab!: TabDirective;
  messages: Message[] = [];
  user!: IUser

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService, private accountService: AccountService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
      this.user = user!;
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    })

    this.route.queryParams.subscribe(params=>{
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: "500px",
        height: "500px",
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user, this.member.username)
    } else {
      this.messageService.stopConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopConnection();
  }

}

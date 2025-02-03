import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ChatServiceService } from '../../../services/chat-service.service';

@Component({
  standalone: false,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  userId: string = '';
  messages: any[] = [];
  newMessage: string = '';
  private routeSub!: Subscription;
  user: any = {};

  constructor(private route: ActivatedRoute, private userService: UserService, private chatService: ChatServiceService) {}

  async ngOnInit(): Promise<void> {
    this.routeSub = this.route.params.subscribe(async (params) => {
      this.userId = params['id'];
      await this.loadMessagesofUser();
      this.loadMessage();
    });
  }

  async loadMessagesofUser() {
    return new Promise<void>((resolve) => {
      this.userService.getUserData(this.userId).subscribe((res: any) => {
        this.user = res;
        resolve(); // Resolves the Promise after data is set
      });
    });
  }

  loadMessage(){
    let messagesdata = {
      senderId: this.userService.getUserIdfromToken(),
      receiverId: this.user.id
    }
    this.chatService.getMessages(messagesdata).subscribe((res: any) => {
      this.messages = res;
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      let data = {
        senderId: this.userService.getUserIdfromToken(),
        receiverId: this.user.id,
        message: this.newMessage
      };
      this.chatService.sendMessage(data).subscribe((req: any) => {
        console.log(req.message);
      });
      this.newMessage = '';
    }
    this.loadMessage();
  }

  senderdata(id:Object){
    return  this.userService.getUserIdfromToken() === id ? true : false;
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ChatServiceService } from '../../../services/chat-service.service';
import { io } from 'socket.io-client';

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
  socket: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private chatService: ChatServiceService) {}

  async ngOnInit(): Promise<void> {
    this.socket = io('http://192.168.29.119:3000/');
    console.log()

    this.routeSub = this.route.params.subscribe(async (params) => {
      this.userId = params['id'];
      await this.loadMessagesofUser();
      this.loadMessage();
    });

    this.socket.on('receiveMessage', (messageData: any) => {
      if (
        (messageData.senderId === this.userService.getUserIdfromToken() && messageData.receiverId === this.user.id) ||
        (messageData.senderId === this.user.id && messageData.receiverId === this.userService.getUserIdfromToken())
      ) {
        this.messages.push(messageData); 
      }
    });
  }

  async loadMessagesofUser() {
    return new Promise<void>((resolve) => {
      this.userService.getUserData(this.userId).subscribe((res: any) => {
        this.user = res;
        resolve();
      });
    });
  }

  loadMessage() {
    let messagesdata = {
      senderId: this.userService.getUserIdfromToken(),
      receiverId: this.user.id
    };
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

      this.socket.emit('sendMessage', data);

      this.messages.push(data);

      this.newMessage = '';
    }
  }

  senderdata(id: string): boolean {
    return this.userService.getUserIdfromToken() === id;
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChattingApplicationRoutingModule } from './chatting-application-routing.module';
// import { ChatComponent } from './chat/chat.component';
// import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    // ChatComponent,
    // UserListComponent
  ],
  imports: [
    CommonModule,
    ChattingApplicationRoutingModule
  ]
  
})
export class ChattingApplicationModule { }

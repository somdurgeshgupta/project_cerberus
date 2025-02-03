import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChattingApplicationComponent } from './chatting-application.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ChatComponent } from './chat/chat.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
      path: '',
      component: ChattingApplicationComponent, // Parent container component
      children: [
        { path: 'chats', component: UserListComponent },  // Default path to show the user list
        { path: 'chat/:id', component: ChatComponent },
        {
          path: '',
          redirectTo: 'chats', // Default child route
          pathMatch: 'full',
        },
      ],
    },
    {
      path: '**', // Catch-all route
      component: PageNotFoundComponent, // Display PageNotFoundComponent outside of Dashboard layout
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChattingApplicationRoutingModule { }

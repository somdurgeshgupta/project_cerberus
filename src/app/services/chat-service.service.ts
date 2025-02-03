import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private http: HttpClient) { }

  sendMessage(data: any){
    return this.http.post(environment.API_URL + 'message/send', data)
  }

  getMessages(messagesdata:any){
    return this.http.post(environment.API_URL + 'message/history', messagesdata)
  }
}

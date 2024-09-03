import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _endpoint = '/chats';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * return work history
   * @param candidate
   */
  list(page: number = 1, filters: any): Observable<any> {
    let url = this._endpoint + '?page=' + page + '&expand=staff,contact,company,store,candidateUnreadCount,recentMessage';

    if (filters.company_id) {
      url += "&company_id=" + filters.company_id;
    }
    
    if (filters.store_id) {
      url += "&store_id=" + filters.store_id;
    }

    if (filters.staff_id) {
      url += "&staff_id=" + filters.staff_id;
    }

    return this._authhttp.get(url, true);
  }

  messages(chat_uuid: string, page: number = 1, last_index: number = null): Observable<any> {
    let url = this._endpoint + '/messages/' + chat_uuid + "?page=" + page;

    if (last_index) {
      url += "&last_index=" + last_index;
    }
    
    return this._authhttp.get(url);
  }

  newMessages(chat_uuid: string, last_index: number = null): Observable<any> {
    let url = this._endpoint + '/new-messages/' + chat_uuid;

    if (last_index) {
      url += "?last_index=" + last_index;
    }
    
    return this._authhttp.get(url);
  }

  unreadCount(): Observable<any> {
    let url = this._endpoint + '/unread-count'
    return this._authhttp.get(url);
  }

  view(chat_uuid: string): Observable<any> {
    let url = this._endpoint + '/' + chat_uuid + "?expand=staff,contact,company,store"
    return this._authhttp.get(url);
  }

  /**
   * start chat with current employer
   * @returns 
   */
  startChat() : Observable<any> {
    let url = this._endpoint + '/start-chat'
    return this._authhttp.post(url, {
    });
  }

  sendMessage(chat_uuid: string, message: string): Observable<any> {
    let url = this._endpoint + '/send-message'
    return this._authhttp.post(url, {
      chat_uuid,
      message
    });
  }
 
  markRead(chat_uuid: string): Observable<any> {
    let url = this._endpoint + '/mark-read/' + chat_uuid;
    return this._authhttp.patch(url, {});
  }
}

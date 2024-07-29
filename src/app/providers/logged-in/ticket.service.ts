import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//models
import { Ticket } from 'src/app/models/ticket';
import { TicketComment } from 'src/app/models/ticket_comment';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public endpoint: string = "/tickets";

  constructor(
    public _authhttp: AuthHttpService
  ) { }

  /**
   * return ticket lists
   * @param page
   * @returns
   */
  list(page: number = 1): Observable<any> {
    const url = `${this.endpoint}?expand=agent,staff&page=${page}`;
    return this._authhttp.get(url, true);
  }

  /**
   * list comments
   * @param ticket_uuid
   * @returns
   */
  listComments(ticket_uuid: string): Observable<any> {
    const url = `${this.endpoint}/comments/${ticket_uuid}?expand=ticketCommentAttachments.attachment,agent,staff`;
    return this._authhttp.get(url);
  }

  /**
   * return ticket detail
   * @param ticket_uuid
   * @returns
   */
  view(ticket_uuid): Observable<any> {
    let url = `${this.endpoint}/${ticket_uuid}?expand=ticketAttachments.attachment,agent,staff,ticketComments,ticketComments.agent,ticketComments.staff,ticketComments.ticketCommentAttachments.attachment`;
    return this._authhttp.get(url);
  }

  /**
   * generate tickets
   * @param ticket
   * @param attachments
   * @returns
   */
  create(ticket: Ticket, attachments = []): Observable<any> {
    let url = `${this.endpoint}`;
    return this._authhttp.post(url, {
      'detail':  ticket.ticket_detail,
      attachments: attachments
    });
  }

  /**
   * comment on ticket
   * @param model
   * @param attachments
   * @returns
   */
  comment(model: TicketComment, attachments = []): Observable<any> {
    let url = `${this.endpoint}/comment/${model.ticket_uuid}`;
    return this._authhttp.patch(url, {
      comment_detail:  model.ticket_comment_detail,
      attachments: attachments
    });
  }
}

import { Contact } from "./contact";
import { Company } from "./company";
import { Staff } from "./staff";
import { Store } from "./store";
import { ChatMessage } from "./chat-message";

export class Chat {
    chat_uuid: string;
    candidate_id: number;
    company_id: number;
    parent_company_id: number;
    store_id: number;
    contact_uuid: string;
    staff_id: number;
    created_at: string;
    updated_at: string;
 
    staffUnreadCount: number;
    candidateUnreadCount: number;
    contactUnreadCount: number;

    contact: Contact;
    company: Company;
    parentCompany: Company;
    staff: Staff;
    store: Store;
    recentMessage: ChatMessage;
    chatMessages: ChatMessage[];
}
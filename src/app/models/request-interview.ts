import { Request } from "./request";
import { RequestApplication } from "./request-application";

export class RequestInterview {
    request_interview_uuid: string; 
    application_uuid: string; 
    request_uuid: string;
    candidate_id: number; 
    fulltimer_uuid: string; 
    interview_at: string;
    internal_note: string;
    status: number;
    staff_id: number;
    interview_note: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    request: Request;
    requestApplication: RequestApplication;
}
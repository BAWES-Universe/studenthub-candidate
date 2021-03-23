import { Candidate } from './candidate';
import { Company } from './company';
import { Request } from './request';

export class Invitation {
    invitation_uuid: string;
    candidate_id: number;
    request_uuid: string;
    invitation_status: number;// (1-Invited , 2- rejected, 3- accepted)
    invitation_created_by: number;
    invitation_updated_by: number;
    invitation_created_at: string;
    invitation_updated_at: string;
    candidate: Candidate;
    request: Request;
    company: Company;
}

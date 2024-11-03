import { Company } from "./company";
import { Store } from "./store";
import { Exam } from "./exam";
import { Staff } from "./staff";
import { CandidateWorkHistory } from "./candidate-work-history";
 

export class Certificate {
    certificate_uuid : string;
    certificate_type: number; 
    candidate_id: number; 
    candidate_work_history_id: number; 
    exam_uuid: string;
    store_id: number; 
    company_id: number; 
    parent_company_id: number; 
    start_date: string;
    end_date: string;
    staff_id: number; 
    is_deleted: any;
    created_at: string;
    updated_at: string;

    isOpen: boolean;
    company: Company;
    parentCompany: Company;
    store: Store;
    exam: Exam;
    staff: Staff;
    candidateWorkHistory: CandidateWorkHistory;
}

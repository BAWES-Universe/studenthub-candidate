import { Company } from "./company";
import { Store } from "./store";

export class CandidateWorkHistory {
    id: number;
    candidate_id: number;
    store_id: number; 
    company_id: number; 
    parent_company_id: number; 
    staff_id: number; 
    start_date: string;
    end_date: string;
    candidate_hourly_rate: number; 
    company_hourly_rate: number;
    transfer_cost: number;//store level transfer cost
    transferCost: number;//effective transfer cost 
    company: Company;
    store: Store;
}
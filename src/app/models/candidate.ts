import { Store } from './store';
import { Company } from './company';
import { Bank } from './bank';
import { University } from './university';
import { Country } from './country';
import { CandidateExperience } from './candidate.experience';
import { CandidateSkill } from './candidate.skill';
import { Area } from './area';
 
export class Candidate {
    employee_id:number;
    candidate_id: string;
    candidate_uid: string;
    store_id: number;
    bank_id: number;
    university_id: number;
    country_id: number;//nationality
    bank_account_name: string;
    candidate_iban: string;
    candidate_name: string;
    candidate_name_ar: string;
    candidate_objective: string;
    candidate_gender: number;
    candidate_personal_photo: string;
    candidate_video: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_address_line1: string;
    candidate_area_uuid: string;
    candidate_latitude: string;
    candidate_longitude: string;
    candidate_birth_date: string;
    candidate_civil_id: string;
    candidate_civil_expiry_date: string;
    candidate_civil_photo_front: string;
    candidate_civil_photo_back: string;
    candidate_driving_license: number; 
    candidate_resume: string;
    candidate_hourly_rate: string;
    candidate_status: string;
    approved: number;
    isProfileCompleted: number;
    age: string;
    candidate_job_search_status: any;
    pendingField: any[];

    tempLocation: any; //temp profile photo location while photo upload 

    store: Store;
    company: Company;
    university: University;
    country: Country;
    area: Area;    
    nationality: Country;
    bank: Bank;
    candidateExperiences: CandidateExperience[];
    candidateSkills: CandidateSkill[];
}

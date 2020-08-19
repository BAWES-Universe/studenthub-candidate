import { Store } from './store';
import { Brand } from './brand';

export class Company{
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_common_name_en: string;
    company_common_name_ar: string;
    company_description_en: string;
    company_description_ar: string;
    company_website: string;
    company_email: string;
    company_logo: string;
    company_status: number;
    total_candidates: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
    brands: Brand[];
}

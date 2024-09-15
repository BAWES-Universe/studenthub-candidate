
export class Salary {
	transfer_id: number;
	candidate_id: number;
	candidate_hourly_rate: number;
	hours: number;
	minutes: number;
	seconds: number;
	candidate_bonus: number;
	tc_created_at: string;
	status: string;

	candidate_total: number;
	total: number;//candidate_total - dynamically calculated
	currency_code: string;
	
	company_name: string;
	store_name: string;
	transfer_benef_name: string;
	transfer_benef_iban: string;
	bank: any;
}

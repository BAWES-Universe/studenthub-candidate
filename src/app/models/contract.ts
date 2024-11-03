import { FixedPriceContract } from "./fixed-price-contract";
import { HourlyContract } from "./hourly-contract";
import { MonthlySalaryContract } from "./monthly-salary-contract";

export class Contract {
    contract_uuid: string;
    company_id: number;
    type: string;
    detail: string;
    start_date: string;
    end_date: string;
    transfer_cost: number;
    currency_code: string;
    status: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    fixedPriceContract: FixedPriceContract;
    hourlyContract: HourlyContract;
    monthlySalaryContract: MonthlySalaryContract;
    amount: any;//FixedPriceContract | HourlyContract | MonthlySalaryContract
}
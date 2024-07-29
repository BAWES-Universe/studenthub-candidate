import { Company } from "./company";
import { DiscountCategory } from "./discount-category";
import { Store } from "./store";

export class Discount {
    discount_uuid: string;
    category_id: number;
    company_id: number;
    store_id: number;
    description_en: string;
    description_ar: string;
    how_to_apply_en: string;
    how_to_apply_ar: string;
    image: string;
    valid_until: string;
    created_at: string;
    updated_at: string;
    discountCategory: DiscountCategory;
    store: Store;
    company: Company;
    category: DiscountCategory;
}
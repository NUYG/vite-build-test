import type {SPTemplate} from "@/models/saleProcess";


export interface PersonalSPDetail extends SPTemplate{
    pjName: string,
    bedroom: string,
    bathroom: number,
    size: number,
    balcony: string,
    door: string,
    fee: number,
    price: number,
}

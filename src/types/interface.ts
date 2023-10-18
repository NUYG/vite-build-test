export interface ExtData {
    id: number;
    gender: string;
    name: string;
    phone: string;
    dob: string;
    fb: string;
    email: string;
    persona: string;
    nid: string;
    address: string;
    territory: string[];
    avtData: any;
    terData: any[];
}

export interface UserData {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    extData: ExtData[];
}

export interface PjData {
    id: number;
    code: string;
    name: string;
    projectColor: string;
}

export  interface UnitData {
    id: number;
    unitCode: string;
    rentingPrice: string;
    sellingPrice: string;
    renting: boolean;
    selling: boolean;
    PjData: PjData ;
    bedroom: string;
}

export interface SalesData {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    extData:ExtData[]
}

export interface ProcessData {
    id: number;
    unitData: UnitData;
    customerName: string;
    salesData: SalesData;
    agentData: AgentData;
    rent: boolean;
    peakStatus: string;
    status: string;
    nextMeetingDate: null|string;
    last_update_by_agent: boolean;
    price?: number,
    cusPrice?: number,
    ownPrice?: number,
    fav: boolean;
}
interface AgentData {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}
export interface PgMeta {
    [key: string]: boolean;
}

export interface Props {
  role: string;
  statusProps:string;
}
export interface StatusRepo {
    [key: string]: number;
}

export interface FPUser {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    extData: UserExtData[] | null
}


export interface UserExtData {
    address: string,
    avtData: null | {
        alt: string,
        id: number,
        imgUrl: string,
    },
    dob: null | Date | string,
    email: null | string,
    fb: string,
    gender: string,
    id: number,
    name: string,
    nid: string,
    persona: string,
    phone: string,
    terData: {
        id: number,
        name: string
    }[],
    territory: number[]
}


export interface BasicContactor extends Partial<UserExtData> {
    id: number,
    name: string,
    phone: string,
}


export interface BasicFPUser extends Omit<FPUser, 'extData'> {
    extData: BasicContactor[] | null
}

export enum InquiryStatusEnum {
    waiting = 'waiting',
    canceled = 'canceled',
    done = 'done'
}


export const maxRunningSP = 7
export const maxRunningPSP = 4

export const parseCeilingPrice = (cellingPrice:number, renting:boolean) => {
    if(cellingPrice)
    {
        return renting ? cellingPrice?.toFixed(2) : (cellingPrice/1000).toFixed(3)
    }else
    {
        return 0
    }
}

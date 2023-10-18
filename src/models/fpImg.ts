export interface FPImg {
    id: number,
    alt: string,
    thumb?: string,
    wm_url?: string,
    img_url?: string,
}


export interface SwipeBoxImg extends Partial<FPImg>{
    id: number,
    alt: string,
    thumb: string,
    wm_url: string,
}


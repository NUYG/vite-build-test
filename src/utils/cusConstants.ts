export enum CusRank {
    INACTIVE = 'in',
    RENT = 'r',
    BUY = 'b',
    INVEST = 'iv',
}

export const cusRankColor = {
    [CusRank.RENT] : '#48BD48' ,
    [CusRank.BUY] : '#F76754',
    [CusRank.INACTIVE] : '',
    [CusRank.INVEST] : '#FFD028'
}
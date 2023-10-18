export enum ternary {
    disable = -1,
    normal,
    enable,
}


export enum Roles {
    Agent = 'Agent',
    Sales = 'Sales',
    AAS = 'A.Assistant',
    Manager = 'Manager',
    Tele = 'Telesale',
    Admin = 'Admin',
    Guest = 'Guest',
    HoD = 'HoD',
}

export const baseUrl = {
    [Roles.Tele]: '/tele',
    [Roles.Sales] :'/moi-gioi',
    [Roles.Admin]: '/fp_admin',
    [Roles.AAS]: '/aas',
    [Roles.Manager]: '/fp_manager',
    [Roles.Agent]: '/agent',
    [Roles.Guest] : '/khach',
    [Roles.HoD] : '/truong-bo-phan',
    fpUser: '/nguoi-dung',

}

export const hostName: any = {
    'dev.crm.fpland.vn': 'devEnv',
    'dev.more.fpland.vn': 'devEnv',
    'staging.crm.fpland.vn': 'stagingEnv',
    'staging.more.fpland.vn': 'stagingEnv',
    'crm.fpland.vn': 'mainEnv',
    'more.fpland.vn': 'mainEnv',
    '127.0.0.1': 'devEnv',
    'localhost': 'devEnv',
}
export const apiUrls = {
    POST_IMG: '/api/img',
    MOVE_INDEX_IMG: '/api/move-img',
    DELETE_IMG: '/api/delete-img',
    ICON_URL: "/src/assets/icons/",
    ANIMATION_JSON:'/src/assets/animJson/'
}

const MEDIA_URL = '/media/';
export const IMG_URL = MEDIA_URL + 'imgs/';



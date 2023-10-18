import {post} from "@/utils/dataQuery";

interface favRespond {
    succeed: boolean,
    resText: string,
}

export enum favObj {
    UNIT = 'UNIT',
    CONTACTOR = 'CONTACTOR',
    UINQUIRY = 'UINQUIRY',
    SP = 'SP',
    PSP = 'PSP',
    PROJECT = 'PROJECT',
}

const favUrl = {
    UNIT: '/favorite/favorite_unit',
    CONTACTOR: '/favorite/favorite_contactor',
    UINQUIRY: '/favorite/favorite_inq',
    SP: '/favorite/favorite_sp',
    PSP: '/favorite/favorite_psp',
    PROJECT: '/favorite/favorite_project',
}

const favObjAPI = async (favObjType: favObj, objId: number, fav: boolean) => {
    const res: favRespond = await post(favUrl[favObjType], {
        objId: objId,
        favorite: fav,
    })
    // window.alert(res.resText);
    return (res && res.succeed);
};

export { favObjAPI };

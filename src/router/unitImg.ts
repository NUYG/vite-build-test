import {fpUnitBaseUrl} from "@/router/URLs";
import type{ RouteRecordRaw } from 'vue-router';

const fpUnitImg  : Array<RouteRecordRaw> =  [
    {
        path: fpUnitBaseUrl + '-:unitID',
        name: 'Fp Unit Img',
        component:() => (import('@/views/GalleryUnitPage/FpGallery.vue')),
    },
]

export default fpUnitImg

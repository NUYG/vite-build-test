import type {tourOptions} from "@/views/Guidance/shepherd";
import {defaultTourOptions, defaultTourStepOptions, nextStepBtn, prevStepBtn} from "@/views/Guidance/tourData/common";


export const salesDashboardTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Tạo khách hàng + nhu cầu khách ở đây',
            attachTo: {
                element: '.step-1',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '2',
            text: 'Khu vực khách hàng bạn tương tác gần nhất',
            attachTo: {
                element: '.step-2',
                on: 'left'
            },
            canClickTarget: true,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
            ...defaultTourStepOptions,
        },
    ],
}

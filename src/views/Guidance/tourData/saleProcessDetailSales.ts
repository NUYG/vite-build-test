import type {tourOptions} from "@/views/Guidance/shepherd";
import {defaultTourOptions, defaultTourStepOptions, nextStepBtn, prevStepBtn} from "@/views/Guidance/tourData/common";


export const salesSPDetailTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Tình trạng giao dịch.',
            attachTo: {
                element: '.sale-process-sales-1',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '2',
            text: 'Hộp tin nhắn để trao đổi với Agent MORE về các vấn đề thông tin liên quan đến giao dịch',
            attachTo: {
                element: '.sale-process-sales-2',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
            ...defaultTourStepOptions,
        },
        {
            id: '3',
            ...defaultTourStepOptions,
            text: 'Chọn khung giờ phù hợp để đặt lịch hẹn xem nhà.',
            attachTo: {
                element: '.sale-process-sales-3',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {
                    ...nextStepBtn(),
                    label: 'Bắt đầu đặt lịch hẹn',
                    text: 'Bắt đầu đặt lịch hẹn',
                }
            ],
        },
    ],
}

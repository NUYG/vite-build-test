import type {tourOptions} from "@/views/Guidance/shepherd";
import {defaultTourOptions, defaultTourStepOptions, nextStepBtn, prevStepBtn} from "@/views/Guidance/tourData/common";


export const salesDetailCustomerTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Chào mừng bạn đến với mục quản lý khách hàng.',
            attachTo: {
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '2',
            text: 'Nhấn vào mở rộng để cập nhật thông tin khách hàng.',
            attachTo: {
                element: '.cus-detail-tour-1',
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
            text: 'Nhấn vào tư vấn để tìm thêm các đề xuất căn hộ phù hợp với nhu cầu.',
            attachTo: {
                element: '.cus-detail-tour-2',
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
            id: '4',
            ...defaultTourStepOptions,
            text: 'Nhấn vào thẻ giao dịch để bắt đầu đặt lịch hẹn.',
            attachTo: {
                element: '.cus-detail-tour-3',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
    ],
}

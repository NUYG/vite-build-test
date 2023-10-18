import type {tourOptions} from "@/views/Guidance/shepherd";
import {defaultTourOptions, defaultTourStepOptions, nextStepBtn, prevStepBtn} from "@/views/Guidance/tourData/common";


export const salesPairingUnitTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Xem chi tiết nhu cầu đã tạo',
            attachTo: {
                element: '.first-pair-unit-tour-1',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '2',
            ...defaultTourStepOptions,
            text: 'Tình trạng nhà',
            attachTo: {
                element: '.first-pair-unit-tour-2',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
        {
            id: '2a',
            ...defaultTourStepOptions,
            text: 'Tính xác minh thông tin căn hộ',
            attachTo: {
                element: '.first-pair-unit-tour-2a',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
        {
            id: '3',
            ...defaultTourStepOptions,
            text: 'Thêm căn hộ vào danh sách so sánh',
            attachTo: {
                element: '.first-pair-unit-tour-3',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
        {
            id: '4',
            ...defaultTourStepOptions,
            text: 'Chia sẻ "một chạm" trực tiếp đến khách hàng',
            attachTo: {
                element: '.first-pair-unit-tour-4',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
        {
            id: '5',
            text: 'Khi không tìm được căn hộ phù hợp, nhấn vào mở rộng để nhận hỗ trợ',
            attachTo: {
                element: '.first-pair-unit-tour-5',
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
            id: '5a',
            ...defaultTourStepOptions,
            text: 'Thêm căn hộ quan tâm vào giỏ hàng để đặt lịch hẹn',
            attachTo: {
                element: '.first-pair-unit-tour-5a',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {...nextStepBtn()}
            ],
        },
        {
            id: '6',
            text: 'Căn hộ được quan tâm được đưa vào đây',
            attachTo: {
                element: '.first-pair-unit-tour-6',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [
                {...prevStepBtn()},
                {
                    label: 'Hoàn thành',
                    text: 'Hoàn thành',
                    action() {
                        return this.next();
                    }
                }
            ],
            ...defaultTourStepOptions,
        },
    ],
}

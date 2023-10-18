import type {tourOptions} from "@/views/Guidance/shepherd";
import {defaultTourOptions, defaultTourStepOptions, nextStepBtn, prevStepBtn} from "@/views/Guidance/tourData/common";


export const salespjPickTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            ...defaultTourStepOptions,
            title: 'Chào mừng bạn đến với MORE',
            text: 'Để bắt đầu, nhấn vào biểu tượng khách hàng trên menu',
            attachTo: {
                element: '.pj-pick-step-1',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [],
            advanceOn: {
                selector: '.pj-pick-step-1',
                event: 'click',
            },
        },
    ],
}


export const newSalesCusTour: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Tạo khách hàng với MORE sẽ giúp bạn tìm được căn hộ phù hợp và theo dõi khách hàng dễ dàng hơn.',
            attachTo: {
                element: '.new-sales-step-2',
                on: 'bottom'
            },
            canClickTarget: true,
            buttons: [],
            ...defaultTourStepOptions,
            advanceOn: {
                selector: '.new-sales-step-2',
                event: 'click',
            },
        },
    ],
}


export const salesMobileCusCreate: tourOptions = {
    ...defaultTourOptions,
    steps: [
        {
            id: '1',
            text: 'Chọn nhu cầu phù hợp với khách hàng',
            attachTo: {
                element: '.new-sales-step-3',
                on: 'bottom'
            },
            canClickTarget: true,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '2',
            ...defaultTourStepOptions,
            text: 'Nhấn bắt đầu',
            attachTo: {
                element: '.new-sales-step-4',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [],
            advanceOn: {
                selector: '.new-sales-step-4',
                event: 'click',
            },
        },
        {
            id: '3',
            text: 'Chọn hoặc điền vào ô tìm dự án để cung cấp các dự án bạn đang quan tâm',
            attachTo: {
                element: () => '.new-sales-step-5',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '4',
            text: 'Chọn dự án "khác" hoặc gõ tên dự án của bạn vào ô tìm dự án để tự quản lý giao dịch cá nhân.',
            attachTo: {
                element: '.new-sales-step-6',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '4a',
            ...defaultTourStepOptions,
            text: 'Nhấn tiếp theo',
            attachTo: {
                element: '.new-sales-step-6a',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [],
            advanceOn: {
                selector: '.new-sales-step-6a',
                event: 'click',
            },
        },
        {
            id: '5',
            ...defaultTourStepOptions,
            text: 'Nhấn vào "Thông tin khác" để cung cấp chi tiết nhu cầu hơn.',
            attachTo: {
                element: '.new-sales-step-7',
                on: 'top-end'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            advanceOn: {
                selector: '.new-sales-step-7',
                event: 'click',
            },
        },
        {
            id: '5a',
            ...defaultTourStepOptions,
            text: 'Nhấn vào "Hoàn thành" để đến phần thông tin khách hàng.',
            attachTo: {
                element: '.new-sales-step-7a',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [],
            advanceOn: {
                selector: '.new-sales-step-7a',
                event: 'click',
            },
        },
        {
            id: '6',
            ...defaultTourStepOptions,
            text: 'Điền tên khách hàng',
            attachTo: {
                element: '.new-sales-step-8',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [{...nextStepBtn()}],
        },
        {
            id: '7',
            ...defaultTourStepOptions,
            text: 'Thêm thông tin liên lạc khách giúp liên lạc với khách dễ dàng hơn.',
            attachTo: {
                element: '.new-sales-step-9',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
        },
        {
            id: '8',
            text: 'Thêm ảnh đại diện cho khách hàng',
            attachTo: {
                element: '.new-sales-step-10',
                on: 'bottom'
            },
            canClickTarget: false,
            buttons: [{...nextStepBtn()}],
            ...defaultTourStepOptions,
        },
        {
            id: '9',
            ...defaultTourStepOptions,
            text: 'Nhấn "bắt đầu tư vấn" để nhận đề xuất các căn hộ tốt nhất từ hệ thống',
            attachTo: {
                element: '.new-sales-step-11',
                on: 'top'
            },
            classes: 'top-tour-step-card',
            canClickTarget: true,
            buttons: [{
                label: 'Tôi đã hiểu',
                text: 'Tôi đã hiểu',
                action() {
                    return this.next();
                }
            }],
            advanceOn: {
                selector: '.new-sales-step-11',
                event: 'click',
            },
        },
    ],
}

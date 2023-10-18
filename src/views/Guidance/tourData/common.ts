import type {stepBtn, tourOptions, tourStepOptions} from "@/views/Guidance/shepherd";

export const defaultTourOptions: tourOptions = {
    useModalOverlay: true,
}


export const defaultTourStepOptions: tourStepOptions = {
    cancelIcon: {
        enabled: false,
        label: 'Hủy',
    },
    classes: 'tour-step-card',
}


export const nextStepBtn = (): stepBtn => {
    return {
        label: 'Tiếp tục',
        text: 'Tiếp tục',
        classes: 'd-flex justify-content-center align-items-center tour-step-card-btn',
        action() {
            return this.next();
        }
    }
}


export const prevStepBtn = (): stepBtn => {
    return {
        label: 'Trở lại',
        text: 'Trở lại',
        classes: 'd-flex justify-content-center align-items-center tour-step-card-btn',
        action() {
            return this.back();
        }
    }
}


export const completeBtn = (): stepBtn => {
    return {
        label: 'Hoàn thành',
        text: 'Hoàn thành',
        classes: 'd-flex justify-content-center align-items-center tour-step-card-btn',
        action() {
            return this.hide();
        }
    }
}

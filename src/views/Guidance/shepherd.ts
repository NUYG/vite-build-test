export const tourVersion: number = 0.1

// 'on' only accept: 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'
export interface attachElement {
    element?: string | any,
    on?: string,
}

export interface stepBtn {
    label: string,
    disabled?: boolean,
    classes?: string, // classes add to <a>
    secondary?: boolean, // add shepherd-button-secondary class to button
    text: string,
    action(): any,
}


export interface tourStepOptionsFull {
    text: HTMLElement | string,
    title: string,
    attachTo: attachElement,
    canClickTarget: boolean,
    cancelIcon: {
        enabled?: boolean,
        label?: string,
    },
    classes: string, // add to content element
    buttons: stepBtn[],
    advanceOn: {
        selector: string,
        event: string,
    },
    highlightClass: string // class apply to highlight element
    id: string,
    modalOverlayOpeningPadding: number,
    modalOverlayOpeningRadius: number,

    showOn(): boolean,

    scrollTo: boolean | {
        [index: string]: string,
    },

    scrollToHandler(): any,

    when: {
        [index: string]: any,
    }
}


export interface tourStepOptions extends Partial<tourStepOptionsFull> {
}


export interface tourOptionsFull {
    classPrefix: string,
    confirmCancel: boolean,
    confirmCancelMessage: string,
    defaultStepOptions: tourStepOptions,
    exitOnEsc: boolean,
    keyboardNavigation: boolean,
    stepsContainer: any,
    modalContainer: any,
    steps: tourStepOptions[],
    tourName: string,
    useModalOverlay: boolean,
}


export interface tourOptions extends Partial<tourOptionsFull> {
}


export interface userTourSaveData {
    [index: string]: pageTourSaveData // pagename
}

export interface pageTourSaveData {
    stepNum: number,
    done: boolean,
}


export interface tourSaveData {
    [index: string]: {  // username
        disabled: boolean,
        version: number,
        tourData: userTourSaveData
    }
}


export const defaultUserPageTourData = (): pageTourSaveData => {
    return {
        stepNum: 0,
        done: false,
    }
}


export const defaultUserTourSaveData = (pageName: string): userTourSaveData => {
    return {
        [pageName]: defaultUserPageTourData(),
    }
}


export const defaultTourSaveData = (username: string, pageName: string): tourSaveData => {
    return {
        [username]: {
            disabled: false,
            tourData: defaultUserTourSaveData(pageName),
            version: tourVersion,
        }
    }
}

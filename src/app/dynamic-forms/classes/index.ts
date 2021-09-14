export class QuestionBase<T> {
    value: T | undefined;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    options: { key: string, value: string }[];
    fichas?: { cod_ficha: string, name: string }
    applies_security_protocol?: boolean;

    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        options?: { key: string, value: string }[];
        fichas?: { cod_ficha: string, name: string }
        applies_security_protocol?: boolean;
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
        if (options.controlType === 'staffReceivingTheGuard') {
            this.fichas = 
        }
    }
}

export class DropdownQuestion extends QuestionBase<string> {
    controlType = 'dropdown';
}

export class TextboxQuestion extends QuestionBase<string> {
    controlType = 'textbox';
}

export class StaffReceivingTheGuard extends QuestionBase<string> {
    controlType = 'staffReceivingTheGuard'
}
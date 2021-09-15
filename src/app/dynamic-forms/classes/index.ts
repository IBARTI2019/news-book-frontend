export class QuestionBase<T> {
    value: T | undefined;
    code?: string;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    options: { key: string, value: string }[];
    fichas?: { cod_ficha: string, identification_card?: string, name_and_surname?: string }[];
    applies_security_protocol?: boolean;

    constructor(options: {
        value?: T;
        key?: string;
        code?: string;
        label?: string;
        required?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        options?: { key: string, value: string }[];
        fichas?: { cod_ficha: string, identification_card?: string, name_and_surname?: string }[];
        applies_security_protocol?: boolean;
    } = {}, public service: any) {
        this.value = options.value;
        this.key = options.key || '';
        this.code = options.code || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
        if (options.key === 'staffReceivingTheGuard') {
            this.service.planned_staff().subscribe((data: any) => {
                this.fichas = data;
            })
        } else {
            this.fichas = options.fichas || [];
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
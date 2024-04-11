import { sample_service } from '../../../data-for-services';

export class Ecu {
    position!: { x: number, y: number };
    id!: number;
    label!: string;
    type!: string;
    connectedTo!: number;
    software!: { [key: string]: any, option2: any, option3: any,  option4: any};
    hardware!: { [key: string]: any, option2: any, option3: any,  option4: any};
    sample_service!: any
}

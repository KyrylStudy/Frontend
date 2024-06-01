import { sample_service } from '../../../data-for-services';

export class Ecu {
    //position!: { x: number, y: number };
    id!: BigInt;
    label!: string;
    type!: string;
    description!: string;
    positionX!: number;
    positionY!: number;
    connectedTo!: number;
    //architecture!: number;
    //software!: { [key: string]: any, option2: any, option3: any,  option4: any};
    //hardware!: { [key: string]: any, option2: any, option3: any,  option4: any};
    //sample_service!: any
}

export class EcuPost {
    label!: string;
    type!: string;
    description!: string;
    positionX!: number;
    positionY!: number;
    connectedTo!: number;
}

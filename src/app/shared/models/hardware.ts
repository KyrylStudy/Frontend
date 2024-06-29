export class Hardware {
    id!: BigInt;
    label!: string;
    type!: string;
    description!: string;
    positionX!: number;
    positionY!: number;
    connectedTo!: number;
}

export class NewHardware {
    label!: string;
    type!: string;
    description!: string;
    positionX!: number;
    positionY!: number;
    connectedTo!: number;
}

export class Service {
    id!: BigInt;
    name!: string;
    type!: string;
    description!: string;
    positionX!: number;
    positionY!: number;
    connectedTo!: string;
}

export class Connection {
    id!: number;
    ecuId!: number;
    busId!: number;
}
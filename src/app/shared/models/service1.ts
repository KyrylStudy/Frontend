export class Service {
    id!: number;
    label!: string;
    type!: string;
    connectedTo!: number;
    software!: { [key: string]: any, option2: any, option3: any,  option4: any};
}

export class Connection {
    id!: number;
    ecuId!: number;
    busId!: number;
}
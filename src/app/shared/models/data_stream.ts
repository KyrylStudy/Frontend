export class DataStream {
    id!: BigInt; 
    name!: string; 
    type!: string;
    description!: string;
    positionFromX!: string;
    positionFromY!: string;
    positionToX!: string;
    positionToY!: string;
    connectedFrom!: string;
    connectedTo!: string;
    twoWayConnection!: boolean;
}


export class NewDataStream {
    name!: string;
    type!: string;
    description!: string;
    positionFromX!: string;
    positionFromY!: string;
    positionToX!: string;
    positionToY!: string;
    connectedFrom!: string;
    connectedTo!: string;
    twoWayConnection!: boolean;
}
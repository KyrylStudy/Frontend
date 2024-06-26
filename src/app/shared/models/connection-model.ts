export class Connection {
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


export class NewConnection {
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
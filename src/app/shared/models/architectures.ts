export class Architecture {
    id!: number; 
    name!: String;
    type!: String;
    description!: String;
}

export class NewArchitecture {
    name!: String;
    type!: String;
    description!: String;
}

export const START_ARCHITECTURE: Architecture = {
    id: 0,
    name: 'Select Architecture',
    type: 'Architecture',
    description: 'Welcome Architecture Description',
    };
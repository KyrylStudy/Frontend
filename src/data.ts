import {Ecu} from './app/shared/models/ecu'
import {Line} from './app/shared/models/line'
import { sample_service } from './data-for-services'

export const sample_ecu: Ecu[] = [
    { position: { x: 200, y: 200 }, id: 1, label: 'ECU 1', type: 'ECU', connectedTo: 2,
     software: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
     hardware: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
     sample_service: sample_service},
    { position: { x: 400, y: 400 }, id: 2, label: 'ECU 2', type: 'ECU', connectedTo: 1,
    software: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
    hardware: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
    sample_service: sample_service},
    { position: { x: 500, y: 100 }, id: 3, label: 'ECU 3', type: 'ECU', connectedTo: 1,
    software: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
    hardware: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'},
    sample_service: sample_service}

]

export const sample_lines: Line[] = [
    { positionFrom: { x: 200, y: 200 }, positionTo: { x: 400, y: 400 }, connectedFrom: 1, connectedTo: 2},
    { positionFrom: { x: 200, y: 200 }, positionTo: { x: 500, y: 100 }, connectedFrom: 2, connectedTo: 3},
    // Add more line objects as needed
];



//должен быть конструктор оьектов что бы строить реальные оьекты по даннымм которые получает
// фронт с бекаю в конструкторе дожны быть методы по умолчанию одним из которых должен быть метор по изменению параметров позиции
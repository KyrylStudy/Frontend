import {Service} from './app/shared/models/service1'

export const sample_service: Service[] = [
    {id: 1, label: 'Service 1', type: 'Service', connectedTo: 2,
     software: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'}},
    {id: 2, label: 'Service 2', type: 'Service', connectedTo: 1,
    software: { option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'}}
]
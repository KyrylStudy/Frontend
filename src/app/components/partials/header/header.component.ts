import { Component } from '@angular/core';
import { Ecu } from '../../../shared/models/ecu';
import { EcuService } from '../../../services/ecu.service';
import { ServicesIncideEcuService } from '../../../services/services-incide-ecu.service';
//import { MainScreenComponent } from '../main-screen/main-screen.component';
import { Line } from '../../../shared/models/line';
import { LineCreationService } from '../../../services/header-main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  options = [
    { id: 1, label: 'new ECU' },
    { id: 2, label: 'new Service' },
    { id: 3, label: 'new Bus' },
    // ... more options
  ];
  selectedOption: any = null;
  showDropdown = false;

  constructor(private ecuService: EcuService, private serviceService: ServicesIncideEcuService,
     private lineCreationService: LineCreationService) {}

  toggleDropdown(): void {
      this.showDropdown = !this.showDropdown;
  }

  numberECU = 3;

  selectOption(option: any): void {
    if (option.label === 'new ECU') {
      const newEcu: Ecu = { position: { x: 0, y: 0 }, id: this.ecuService.getAll().length + 1, label: 'ECU ' + (this.ecuService.getAll().length + 1), type: 'ECU', connectedTo: 0, software: {option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'}, hardware: {option1: 'Value 1', option2: 'Value 1', option3: 'Value 1',  option4: 'Value 1'}, sample_service: this.serviceService.getAll()};
      this.ecuService.addNewEcu(newEcu);
      //this.selectedOption = newEcu;
    } else if (option.label === 'new Bus') {
      this.lineCreationService.setCreatingLine(true);
      document.body.style.backgroundColor = 'green'; // Change background color to green
    } else {
      this.selectedOption = option;
    }
    this.showDropdown = false;
  
  }


  userImage: string | null = null; // Path to user image, set to null if not available
  userName: string = 'John Doe'; // Default user name

  //--------------------02.04.2024
  creatingNewLine = false;



}



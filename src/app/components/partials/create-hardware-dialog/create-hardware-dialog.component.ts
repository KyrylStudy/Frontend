import { Component, Input } from '@angular/core';
import { HardwareService } from '../../../services/hardware.service';
import { NewHardware } from '../../../shared/models/hardware';


@Component({
  selector: 'create-hardware-dialog',
  templateUrl: './create-hardware-dialog.component.html',
  styleUrl: './create-hardware-dialog.component.scss'
})
export class CreateHardwareDialogComponent {

  constructor( private hardwareService:HardwareService) { 
  }

  ngOnInit(): void {
  }


  @Input() createHardwareData: any | null = null;

  close(): void {
    this.createHardwareData.showCreateHardwareDialog = false;
  }

  selectedOption: any = null;
  showDropdown: boolean = false;
  toggleDropdownType(){
    this.showDropdown = !this.showDropdown;
  }

  options = [
    { id: 1, label: 'ECU' },
    { id: 2, label: 'BUS' }
  ];


  newHardwareName: any = null;
  newHardwareDescription: any = null;

  selectOption(option: any){
    if (option.label === 'ECU') {

      this.showDropdown = !this.showDropdown;
      this.selectedOption = option;
    }else if(option.label === 'BUS'){

      this.showDropdown = !this.showDropdown;
      this.selectedOption = option;
    }else{
      return;
    }
  }

  save(){

      if (this.selectedOption && this.newHardwareName && this.newHardwareDescription) {
          const newEcu: NewHardware = {
            label: this.newHardwareName,
            type: this.selectedOption.label,
            description: this.newHardwareDescription,
            positionX: 228,
            positionY: 229,
            connectedTo: this.createHardwareData.ecus.length};
            this.hardwareService.createHardware(newEcu, this.createHardwareData.selectedArchitecture.id);
            
            this.createHardwareData.showCreateHardwareDialog = false;
      }else {
        console.log("All required feelds have to be filled!")
      }

  }

}

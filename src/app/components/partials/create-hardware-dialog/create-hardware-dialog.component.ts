import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { LineCreationService } from '../../../services/data-stream.service';
import { NewHardware } from '../../../shared/models/hardware';
import { NewArchitecture } from '../../../shared/models/architectures';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'create-hardware-dialog',
  templateUrl: './create-hardware-dialog.component.html',
  styleUrl: './create-hardware-dialog.component.scss'
})
export class CreateHardwareDialogComponent {

  constructor(private architectureService:ArchitectureService, private ecuService:EcuService, private lineCreationService: LineCreationService) { 
  }

  ngOnInit(): void {
    /*this.ecuService.hardwares$.subscribe({
      next: data => {
        this.users = data;
      },
      error: error => {
        this.errorMessage = 'Failed to load users';
        console.error(error);
      }
    });*/
  }


  @Input() createHardwareData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  close(): void {
    this.closeDialog.emit(true);
  }

  selectedOption: any = null;
  showDropdown: boolean = false;
  toggleDropdownType(){
    this.showDropdown = !this.showDropdown;
  }

  options = [
    { id: 1, label: 'ECU' },
    { id: 2, label: 'BUS' },
    { id: 3, label: 'CAN' },
  ];

  //createEcuMod: boolean = false;
  //createBusMod: boolean = false;
  newHardwareName: any = null;
  newHardwareDescription: any = null;

  selectOption(option: any){
    if (option.label === 'ECU') {

      this.showDropdown = !this.showDropdown;
      this.selectedOption = option;
    }else if(option.label === 'BUS'){

      this.showDropdown = !this.showDropdown;
      this.selectedOption = option;
    }else if(option.label === 'CAN'){

      this.showDropdown = !this.showDropdown;
      this.selectedOption = option;
    }else{
      return;
    }
  }

  newArchitectureName: any = null;
  newArchitectureDescription: any = null;
  hardware: any = 'new Hardware';
  architecture: any = 'new Architecture';

 /* createNewHardware(newHardware: NewHardware, architectureId:number): void {
    this.ecuService.createHardware(newHardware, architectureId);
  }*/

  save(){
    if(this.createHardwareData.showCreateHardwareDialog === this.hardware){
      if (this.selectedOption && this.newHardwareName && this.newHardwareDescription) {
          const newEcu: NewHardware = {
            label: this.newHardwareName,
            type: this.selectedOption.label,
            description: this.newHardwareDescription,
            positionX: 228,
            positionY: 229,
            connectedTo: this.createHardwareData.ecus.length};
           
           // this.createNewHardware(newEcu, this.createHardwareData.selectedArchitecture.id);
            this.ecuService.createHardware(newEcu, this.createHardwareData.selectedArchitecture.id);
            
           
            this.closeDialog.emit(true);
      
          
      }else {
        console.log("All required feelds have to be filled!")
      }
    }else if(this.createHardwareData.showCreateHardwareDialog === this.architecture){
      if (this.newArchitectureName && this.newArchitectureDescription) {
        if(this.createHardwareData.architectures){
          const newArchitecture: NewArchitecture = {
            name: this.newArchitectureName,
            type: 'Architecture',
            description: this.newArchitectureDescription,
            };
      
           /* this.ecuService.createArchitecture(newArchitecture).subscribe(data =>{
              this.createHardwareData.architectures?.push(data)
              console.log(this.createHardwareData.architectures)
            }
            );*/
            this.architectureService.createArchitecture(newArchitecture)
        }
        this.closeDialog.emit(true);
      }else {
        console.log("All required feelds have to be filled!")
      }
      
    }
    
  }

}

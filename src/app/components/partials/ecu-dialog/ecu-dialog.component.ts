// dialog.component.ts

import { Component, EventEmitter, Output, Input, Renderer2, OnInit } from '@angular/core';
//import { EcuService } from '../../../services/ecu.service';
import { HardwareService } from '../../../services/hardware.service';
import { LineCreationService } from '../../../services/data-stream.service';
import { DataStream } from '../../../shared/models/data_stream';
import { Hardware } from '../../../shared/models/hardware';
import { HardwarePropertyService } from '../../../services/hardware-property.service';
import { HardwareProperty, NewHardwareProperty } from '../../../shared/models/hardware_property';
import { ServiceService } from '../../../services/service.service';
import { ArchitectureService } from '../../../services/architecture.service';
//import { HardwareService } from '../../../services/hardware.service';


@Component({
  selector: 'ecu-dialog',
  templateUrl: './ecu-dialog.component.html',
  styleUrls: ['./ecu-dialog.component.scss']
})
export class DialogComponent implements OnInit{

  constructor(/*private hardwareService:HardwareService,*/  private architectureService:ArchitectureService, private serviceService:ServiceService,
      private hardwarePropertyService:HardwarePropertyService, private hardwareService:HardwareService,
      private lineCreationService: LineCreationService, private renderer: Renderer2) { }


  nameEditMod: boolean = false;
  editName(){
    this.nameEditMod = true;
  }

  canselEditingName(){
    this.nameEditMod = false;
  }

  saveName(){
    this.hardwareService.updateHardware(this.selectedEcu, this.selectedEcu.id);
    this.nameEditMod = false;
  }


  hardwarePropertyEditMod: boolean = false;
  hardwarePropertyId: any = null;
  editProperty(hardwareProperty: HardwareProperty){
    this.hardwarePropertyId = hardwareProperty.id;
  }

  canselEditingProperty(){
    this.hardwarePropertyId = null;
  }

  deleteProperty(hardwareProperty: HardwareProperty){
    this.hardwarePropertyService.deleteHardwareProperty(hardwareProperty.id, this.selectedEcu.id)
  }

  saveProperty(hardwareProperty: HardwareProperty){
    this.hardwarePropertyService.updateHardwareProperty(hardwareProperty, hardwareProperty.id, this.selectedEcu.id)
    this.hardwarePropertyId = null;
  }
  
  editDescription(){ 
    this.descriptionEditMod = true;
    setTimeout(()=>{
      this.autoResizeTextarea();
    },50)

  }

  autoResizeTextarea() {
    const textarea = document.getElementById('textarea-description');
    if(textarea){
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  saveDescription(){
    this.hardwareService.updateHardware(this.selectedEcu, this.selectedEcu.id);
    this.descriptionEditMod = false;
  }

  canselEditingDescription(){
    this.descriptionEditMod = false;
  }

  selectedEcu: any = null;
  ngOnInit(): void{
    this.subscribeOnSelectedArchitecture();

    this.subscribeOnHardwareProperties();

    this.subscribeOnSelectedHardware();
 
    this.subscribeOnHardwares();

    this.subscribeOnDataStreams();    
  }

  dataStreams: DataStream[] = [];
  subscribeOnDataStreams(){
    this.lineCreationService.dataStreams$.subscribe(
        {
          next: data => {
            this.dataStreams = data;
          },
          error: error => {
            console.error(error);
          }
        }
    );
  }

  selectedArchitecture: any = null;
  subscribeOnSelectedArchitecture(){
  this.architectureService.selectedArchitecture$.subscribe(
      {
        next: data => {
          this.selectedArchitecture = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}




  @Input() dialogData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>(); 

  close(): void {
    this.closeDialog.emit(true);
    //this.serviceService.setSelectedService(null)
   // this.dialogData.showServiceDialog = false;
    this.dialogData.showDataStreamDialog = false;
  }

  delete(): void {
   var busIdDeleteArray: any[] = [];
    for(let i = 0; i < this.dialogData.connections.length; i++){
      if(this.dialogData.connections[i].connectedFrom == this.selectedEcu.id.toString()){
        busIdDeleteArray.push(this.dialogData.connections[i].id);
        this.deleteBus(this.dialogData.connections[i].id)
      }else if(this.dialogData.connections[i].connectedTo == this.selectedEcu.id.toString()){        
        busIdDeleteArray.push(this.dialogData.connections[i].id);
        this.deleteBus(this.dialogData.connections[i].id)
        
      }
    }

    this.hardwareService.deleteHardware(this.selectedEcu.id);

    for(let i = 0; i < busIdDeleteArray.length; i++){
      this.dialogData.connections = this.dialogData.connections.filter((item: { id: any; }) => item.id != busIdDeleteArray[i]);
    }
    //this.dialogData.ecus = this.dialogData.ecus.filter((item: { id: any; }) => item.id !== this.dialogData.selectedEcu.id);

//покащо не работает

    var servicesOfSelectedEcu = this.serviceService.servicesMap.get(this.selectedEcu.id);
   // var dataStreams: DataStream[] = [];
   // this.lineCreationService.getAllDataStreams(this.selectedArchitecture.id).subscribe(data => {
   //   dataStreams = data;

      if(servicesOfSelectedEcu){
        for(let i = 0; i < servicesOfSelectedEcu.length; i++){
          for(let j = 0; j < this.dataStreams.length; j++){
            if(servicesOfSelectedEcu[i].id.toString() == this.dataStreams[j].connectedFrom ||
             servicesOfSelectedEcu[i].id.toString() == this.dataStreams[j].connectedTo){
              this.lineCreationService.deleteDataStream(this.dataStreams[j].id).subscribe(data => {
                //this.lineCreationService.getAllDataStreams(this.selectedArchitecture.id)
              });
            }
          }
        }
      }
   // });
    
    

    this.closeDialog.emit(true);
  }


  
  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();
  }



  subscribeOnSelectedHardware(){
  this.hardwareService.selectedHardware$.subscribe(
    {
      next: data => {
        this.selectedEcu = data;
      },
      error: error => {
        console.error(error);
      }
    }
);
}


  subscribeOnHardwares(){
  this.hardwareService.hardwares$.subscribe(
      {
        next: data => {
          this.hardwares = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

hardwareKey: string = '';
hardwareValue: string = '';

addHardwareValue(): void {
  if (this.selectedEcu && this.hardwareKey && this.hardwareValue) {

    const newHardwareProperty: NewHardwareProperty = {name: this.hardwareKey, value: this.hardwareValue};

    this.hardwarePropertyService.createHardwareProperty(newHardwareProperty, this.selectedEcu.id);

    this.hardwareKey = '';
    this.hardwareValue = '';
  }
}

hardwareProperties: HardwareProperty[] | null = null;
subscribeOnHardwareProperties(){
  this.hardwarePropertyService.hardwareProreries$.subscribe(
      {
        next: data => {
          this.hardwareProperties = data;
        },
        error: error => {
         // this.errorMessage = 'Failed to load users';
          console.error(error);
        }
      }
  );
}


  hardwares: Hardware[] = [];

  //------------------------19.05
  showService: boolean = false;


  openDialog(): void {
    this.showService = true;
    this.dialogData.showHardwareDetailsDialogContent = false;
    this.serviceService.loadAllServices(this.dialogData.selectedEcu.id); 
    this.dialogData.initializeGraph(this.dialogData.connections);  
  }

  saveServices() {}
 

//-------------------------------28.05

  serviceDialogData: any = this;
  dataForServiceDialog = this;
  showDataStreamDialog: boolean = false;

 
    dataForDataStreamDetails:any = null;
    getDataStreamsFromServiceComponent(event: any){
      this.dataForDataStreamDetails = event;
      console.log("data from services geted ", this.dataForDataStreamDetails)

    }

    descriptionEditMod: boolean = false;



    // Initialize the auto resize for existing content on page load


}

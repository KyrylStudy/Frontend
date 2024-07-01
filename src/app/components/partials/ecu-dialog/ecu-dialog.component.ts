// dialog.component.ts

import { Component, EventEmitter, Output, Input, Renderer2/*, OnInit*/ } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { LineCreationService } from '../../../services/header-main.service';
import { Service } from '../../../shared/models/service';
import { NewConnection } from '../../../shared/models/connection-model';
import { DataStream } from '../../../shared/models/data_stream';
import { Hardware } from '../../../shared/models/hardware';
import { Observable, forkJoin } from 'rxjs';
import { HardwarePropertyService } from '../../../services/hardware-property.service';
import { HardwareProperty, NewHardwareProperty } from '../../../shared/models/hardware_property';
import { ServiceService } from '../../../services/service.service';


@Component({
  selector: 'ecu-dialog',
  templateUrl: './ecu-dialog.component.html',
  styleUrls: ['./ecu-dialog.component.scss']
})
export class DialogComponent /*implements OnInit*/{

  constructor(private serviceService:ServiceService,  private hardwarePropertyService:HardwarePropertyService, private ecuService:EcuService,private lineCreationService: LineCreationService, private renderer: Renderer2) { 
  }

  selectedEcu: Hardware | null = null;
  ngOnInit(): void{

    this.subscribeOnHardwareProperties();

    this.subscribeOnSelectedHardware();

    this.subscribeOnHardwares();
   // this.getAllHardwares(this.dialogData.selectedArchitecture.id);
    
  }




  @Input() dialogData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>(); 

  close(): void {
    this.closeDialog.emit(true);
    this.dialogData.showServiceDialog = false;
    this.dialogData.showDataStreamDialog = false;
  }

  delete(): void {
   var busIdDeleteArray: any[] = [];
    for(let i = 0; i < this.dialogData.connections.length; i++){
      if(this.dialogData.connections[i].connectedFrom == this.selectedEcu?.id.toString()){
        busIdDeleteArray.push(this.dialogData.connections[i].id);
        this.deleteBus(this.dialogData.connections[i].id)
      }else if(this.dialogData.connections[i].connectedTo == this.selectedEcu?.id.toString()){        
        busIdDeleteArray.push(this.dialogData.connections[i].id);
        this.deleteBus(this.dialogData.connections[i].id)
        
      }
    }
    if(this.selectedEcu)
    this.deleteEcu(this.selectedEcu.id)

    for(let i = 0; i < busIdDeleteArray.length; i++){
      this.dialogData.connections = this.dialogData.connections.filter((item: { id: any; }) => item.id != busIdDeleteArray[i]);
    }
    //this.dialogData.ecus = this.dialogData.ecus.filter((item: { id: any; }) => item.id !== this.dialogData.selectedEcu.id);

//покащо не работает
    var servicesOfSelectedEcu = this.dialogData.servicesMap.get(this.selectedEcu?.id);
    var dataStreams: DataStream[] = [];
    this.lineCreationService.getAllDataStreams(this.dialogData.selectedArchitecture.id).subscribe(data => {
      dataStreams = data;
    });
    if(servicesOfSelectedEcu){
      for(let i = 0; i < servicesOfSelectedEcu.length; i++){
        for(let j = 0; j < dataStreams.length; j++){
          if(servicesOfSelectedEcu[i].id.toString() == dataStreams[j].connectedFrom){
            this.lineCreationService.deleteDataStream(dataStreams[j].id);
          }else if(servicesOfSelectedEcu[i].id.toString() == dataStreams[j].connectedTo){
            this.lineCreationService.deleteDataStream(dataStreams[j].id);
          }
        }
      }
    }
    

    this.closeDialog.emit(true);
  }

  /*private deleteEcu(id: BigInt){
    this.ecuService.deleteEcu(id).subscribe();
  }*/

    private deleteEcu(id: BigInt): void {
      this.ecuService.deleteHardware(id);
    }

  
  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();
  }



subscribeOnSelectedHardware(){
  this.ecuService.selectedHardware$.subscribe(
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
  this.ecuService.hardwares$.subscribe(
      {
        next: data => {
          this.hardwares = data;
        },
        error: error => {
         // this.errorMessage = 'Failed to load users';
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
  
    /*this.ecuService.createHardwareProperty(NewHardware, this.selectedEcu.id).subscribe(data =>{
      this.hardware[this.hardware.length] = data
    });*/

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





  showHardware(){
    console.log(this.hardwares)
    //console.log(this.servicesMap)
  }

  hardwares: Hardware[] = [];

  //------------------------19.05
  showService: boolean = false;


  openDialog(): void {
    this.showService = true;
    this.dialogData.showHardwareDetailsDialogContent = false;
    //console.log(this.dialogData.selectedEcu)
    this.serviceService.loadAllServices(this.dialogData.selectedEcu.id); 
    this.dialogData.initializeGraph(this.dialogData.connections);
    /*for(let i = 0; i < this.dialogData.ecus.length; i++){
      if(this.dialogData.canReach(this.dialogData.selectedEcu.id.toString(), this.dialogData.ecus[i].id.toString())){

      }
    }*/
    
  }

  onCloseDialog(): void {
    this.dialogData.showService = false;
    
  }

 /* private updateService(Service: Service, id: BigInt){
    //console.log(Line)
    this.ecuService.updadeService(Service, id).subscribe();
   }*/

  saveServices() {}
 

//-------------------------------28.05

  createDatastream(){
    this.dialogData.creatingDatastreamModus = !this.dialogData.creatingDatastreamModus;
  }

  serviceDialogData: any = this;


  onCloseCreateDialog(){
    this.showCreateDialog = !this.showCreateDialog;
  }

  showCreateDialog: boolean = false;
  openCreateServiceDialog(){
    this.showCreateDialog = !this.showCreateDialog;
  }

  goBack(){ 
    this.showService = false;
    this.dialogData.showHardwareDetailsDialogContent = true;
  }

  dataForServiceDialog = this;
  //showServiceDialog:boolean = false;
  selectedService: any = null;
  showServiceDialog: boolean = false;
  showDataStreamDialog: boolean = false;

  openServiceDetailsDialog(service: Service){

    this.selectedService = service;
    this.showServiceDialog = true;
    this.showService = false;
    //this.dialogData.selectedService = service;   ------------------!!!!!!!!!!!
    //this.dialogData.isEcuDetailsMod = !this.dialogData.isEcuDetailsMod;
  }

  /*onCloseServiceDetailsDialog(){
    this.showServiceDialog = !this.showServiceDialog;
  }*/
 
    dataForDataStreamDetails:any = null;
    getDataStreamsFromServiceComponent(event: any){
      this.dataForDataStreamDetails = event;
      console.log("data from services geted ", this.dataForDataStreamDetails)

    }


    //--------------------25.06



  
  

}

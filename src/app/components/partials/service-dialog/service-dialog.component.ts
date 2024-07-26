import { Component, EventEmitter, Input, Output } from '@angular/core';
//import { EcuService } from '../../../services/ecu.service';
import { HardwareService } from '../../../services/hardware.service';
import { LineCreationService } from '../../../services/data-stream.service';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../shared/models/service';
import { DataStream } from '../../../shared/models/data_stream';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {

  constructor(private architectureService:ArchitectureService, private serviceService:ServiceService/*, private ecuService:EcuService */, private lineCreationService: LineCreationService/*, private renderer: Renderer2,
    private elementRef: ElementRef*/) { 

  }

  selectedService: any | null = null;
  subscribeOnSelectedService(){
    this.serviceService.selectedService$.subscribe(
        {
          next: data => {
            this.selectedService = data;
          },
          error: error => {
            console.error(error);
          }
        }
    );
  }

  servicesMap: Map<BigInt, Service[]> = new Map();
  subscribeOnServices(){
    this.serviceService.allServicesInArchitectureMap$.subscribe(
        {
          next: data => {
            this.servicesMap = data;
          },
          error: error => {
            console.error(error);
          }
        }
    );
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


selectedArchitecture: any | null = null;
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


ngOnInit(): void{
  this.subscribeOnSelectedArchitecture();

  this.subscribeOnSelectedService();

  this.subscribeOnServices();

  this.subscribeOnDataStreams();
}

  @Input() serviceDetilsData: any | null = null;


    close(){ 
      this.serviceService.setSelectedService(null);
    }

  delete(){ 
    //debugger
    var dataStreamsIdDeleteArray: any[] = [];
   // var dataStreams = this.lineCreationService.getDataStreams();  
    //var selectedService = this.serviceDetilsData.selectedService;
    for(let i = 0; i < this.dataStreams.length; i++){ 
      
      if(this.dataStreams[i].connectedFrom === this.selectedService.id.toString()){
        dataStreamsIdDeleteArray.push(this.dataStreams[i].id);
        this.deleteDataStream(this.dataStreams[i].id);
      }else if(this.dataStreams[i].connectedTo === this.selectedService.id.toString()){        
        dataStreamsIdDeleteArray.push(this.dataStreams[i].id);
        this.deleteDataStream(this.dataStreams[i].id);        
      }
    }
    this.deleteService(this.serviceDetilsData.selectedService.id);

    this.serviceService.setSelectedService(null)

   // this.serviceDetilsData.showService = true;
    
  }

  private deleteService(id: BigInt){
  
    //this.serviceDetilsData.dialogData.servicesMap.get(this.serviceDetilsData.dialogData.selectedEcu.id); 
    this.serviceService.deleteService(id);
  }

  private deleteDataStream(id: BigInt){
    this.lineCreationService.deleteDataStream(id).subscribe({ 
      next: (data) => {
        // Assuming the deletion was successful if this callback is called
  
        //console.log("architekture id  ", this.serviceDetilsData.dialogData.selectedArchitecture.id)
        //var architektureId = this.serviceDetilsData.selectedArchitecture.id
      
        this.serviceDetilsData.getDataStreams(this.selectedArchitecture.id);
        
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

}

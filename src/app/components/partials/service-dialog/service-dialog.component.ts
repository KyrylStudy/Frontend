import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { LineCreationService } from '../../../services/header-main.service';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../shared/models/service';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {

  constructor(private serviceService:ServiceService, private ecuService:EcuService , private lineCreationService: LineCreationService/*, private renderer: Renderer2,
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



ngOnInit(): void{
  this.subscribeOnSelectedService();

  this.subscribeOnServices();
}

  @Input() serviceDetilsData: any | null = null;


    close(){ 
      this.serviceService.setSelectedService(null);
    }

  delete(){ 
    //debugger
    var dataStreamsIdDeleteArray: any[] = [];
    var dataStreams = this.serviceDetilsData.dataForDataStreamDetails.dataStreams;  
    //var selectedService = this.serviceDetilsData.selectedService;
    for(let i = 0; i < dataStreams.length; i++){ 
      
      if(dataStreams[i].connectedFrom === this.selectedService.id.toString()){
        dataStreamsIdDeleteArray.push(dataStreams[i].id);
        this.deleteDataStream(dataStreams[i].id);
      }else if(dataStreams[i].connectedTo === this.selectedService.id.toString()){        
        dataStreamsIdDeleteArray.push(dataStreams[i].id);
        this.deleteDataStream(dataStreams[i].id);
        
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
        var architektureId = this.serviceDetilsData.selectedArchitecture.id
      
        this.serviceDetilsData.dataForDataStreamDetails.getDataStreams(architektureId);
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

}

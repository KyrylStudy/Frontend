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
  this.subscribeOnServices();
}

  @Input() serviceDetilsData: any | null = null;

  close(): void {
    this.serviceDetilsData.showDialog = false;
    this.serviceDetilsData.showServiceDialog = false;
  }

  delete(){ 
    //debugger
    var dataStreamsIdDeleteArray: any[] = [];
    var dataStreams = this.serviceDetilsData.dataForDataStreamDetails.dataStreams; 
    var selectedService = this.serviceDetilsData.selectedService;
    for(let i = 0; i < dataStreams.length; i++){ 
      
      if(dataStreams[i].connectedFrom === selectedService.id.toString()){
        dataStreamsIdDeleteArray.push(dataStreams[i].id);
        this.deleteDataStream(dataStreams[i].id);
      }else if(dataStreams[i].connectedTo === selectedService.id.toString()){        
        dataStreamsIdDeleteArray.push(dataStreams[i].id);
        this.deleteDataStream(dataStreams[i].id);
        
      }
    }
    this.deleteService(this.serviceDetilsData.selectedService.id);


    

    /*for(let i = 0; i < dataStreamsIdDeleteArray.length; i++){
      this.serviceDetilsData.dataForDataStreamDetails.dataStreams = this.serviceDetilsData.dataForDataStreamDetails.dataStreams.filter((item: { id: any; }) => item.id != dataStreamsIdDeleteArray[i]);
    }
    this.dialogData.ecus = this.dialogData.ecus.filter((item: { id: any; }) => item.id !== this.dialogData.selectedEcu.id);*/
    this.serviceDetilsData.showServiceDialog = false;
    this.serviceDetilsData.showService = true;
    
  }

  private deleteService(id: BigInt){
    /*this.ecuService.deleteService(id).subscribe({
      next: (data) => {
        // Assuming the deletion was successful if this callback is called
        console.log('Service deleted successfully', data);
        // Fetch the updated list of services
        this.serviceService.getAllServices();

        //обновить опции в дропдауне сервисов 
        var that = this;
        setTimeout(function(){
          that.serviceDetilsData.dataForDataStreamDetails.selectedOption = null;
          that.serviceDetilsData.dataForDataStreamDetails.selectedService = null;
          that.serviceDetilsData.dataForDataStreamDetails.options = 
          that.serviceDetilsData.dialogData.servicesMap.get(that.serviceDetilsData.dialogData.selectedEcu.id);//добавить сервис есу
        }, 300)
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting service', error);
      }
    });*/
    this.serviceDetilsData.dialogData.servicesMap.get(this.serviceDetilsData.dialogData.selectedEcu.id); 
    this.serviceService.deleteService(id);
  }

  private deleteDataStream(id: BigInt){
    this.lineCreationService.deleteDataStream(id).subscribe({
      next: (data) => {
        // Assuming the deletion was successful if this callback is called
  
        //console.log("architekture id  ", this.serviceDetilsData.dialogData.selectedArchitecture.id)
        var architektureId = this.serviceDetilsData.dialogData.selectedArchitecture.id
      
        this.serviceDetilsData.dataForDataStreamDetails.getDataStreams(architektureId);
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

}

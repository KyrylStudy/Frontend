import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { newService } from '../../../shared/models/service';
import { Hardware } from '../../../shared/models/hardware';
import { ServiceService } from '../../../services/service.service';


@Component({
  selector: 'app-create-service-infrastructure-dialog',
  templateUrl: './create-service-infrastructure-dialog.component.html',
  styleUrl: './create-service-infrastructure-dialog.component.scss'
})
export class CreateServiceInfrastructureDialogComponent {

  constructor(private serviceService:ServiceService, private ecuService:EcuService, /*private lineCreationService: LineCreationService*/) { }

  selectedEcu: Hardware | null = null;
  ngOnInit(): void{

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

  @Input() createServiceDialogData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  close(): void {
    this.closeDialog.emit(true);
  }

  newServiceName: any = null;
  newServiceDescription: any = null;
  
  save(){

      if (this.newServiceName && this.newServiceDescription) {

          const newService: newService = {
            name: this.newServiceName,
            type: "Service",
            description: this.newServiceDescription,
            positionX: 228,
            positionY: 229,
            connectedTo: '9'};
           
            if(this.selectedEcu)
            this.serviceService.createService(newService, this.selectedEcu.id)
            /*if(this.selectedEcu){
              this.ecuService.createService(newService, this.selectedEcu.id).subscribe({
                next: (data) => {
                  //this.createServiceDialogData.dialogData.getAllServices();
  
                  //var that = this;
                  //setTimeout(function(){
                    this.createServiceDialogData.dataForDataStreamDetails.selectedOption = null;
                    this.createServiceDialogData.dataForDataStreamDetails.selectedService = null;
                    debugger
                    if(this.selectedEcu){
                      
                      //let jjjjj = this.ecuService.getAllServicesByEcuId(this.selectedEcu.id)
                     // this.createServiceDialogData.dataForDataStreamDetails.options =
                       this.ecuService.getAllServicesByEcuId(this.selectedEcu.id).subscribe(
                        {
                          next: data => {
                            this.createServiceDialogData.dataForDataStreamDetails.options = data;
                          },
                          error: error => {
                            console.error(error);
                          }
                        }
                       )
                    }
                    //that.createServiceDialogData.dialogData.servicesMap.get(that.selectedEcu.id);
                 // }, 300)
                },
                error: (error) => {
                  // Handle the error here if needed
  
                }
              });
            } */        
             this.closeDialog.emit(true);
      }else {
            console.log("All required feelds have to be filled!")
      }
        
  }
    
}

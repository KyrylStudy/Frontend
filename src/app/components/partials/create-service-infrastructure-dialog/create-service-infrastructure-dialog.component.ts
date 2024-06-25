import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { newService } from '../../../shared/models/service';


@Component({
  selector: 'app-create-service-infrastructure-dialog',
  templateUrl: './create-service-infrastructure-dialog.component.html',
  styleUrl: './create-service-infrastructure-dialog.component.scss'
})
export class CreateServiceInfrastructureDialogComponent {

  constructor(private ecuService:EcuService, /*private lineCreationService: LineCreationService*/) { 


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
           
             this.ecuService.createService(newService, this.createServiceDialogData.dialogData.selectedEcu.id).subscribe({
              next: (data) => {
                this.createServiceDialogData.dialogData.getAllServices();

                var that = this;
                setTimeout(function(){
                  that.createServiceDialogData.dataForDataStreamDetails.selectedOption = null;
                  that.createServiceDialogData.dataForDataStreamDetails.selectedService = null;
                  that.createServiceDialogData.dataForDataStreamDetails.options = that.createServiceDialogData.dialogData.servicesMap.get(that.createServiceDialogData.dialogData.selectedEcu.id);
                }, 300)
              },
              error: (error) => {
                // Handle the error here if needed

              }
            });

            


             /*var that = this;
        setTimeout(function(){
          that.serviceDetilsData.dataForDataStreamDetails.selectedOption = null;
          that.serviceDetilsData.dataForDataStreamDetails.selectedService = null;
          that.serviceDetilsData.dataForDataStreamDetails.options = that.serviceDetilsData.dialogData.servicesMap.get(that.serviceDetilsData.dialogData.selectedEcu.id);
        }, 300)*/
           
             this.closeDialog.emit(true);
      }else {
            console.log("All required feelds have to be filled!")
      }
        
  }
    
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {

  @Input() serviceDetilsData: any | null = null;

  close(): void {
    this.serviceDetilsData.showDialog = false;
    this.serviceDetilsData.showServiceDialog = false;
  }


  delete(){
    
  }

}

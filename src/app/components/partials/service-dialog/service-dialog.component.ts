import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent {

  @Input() serviceDetilsData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>(); 


  close(): void {
    this.closeDialog.emit(true);
  }

  delete(){
    
  }

}

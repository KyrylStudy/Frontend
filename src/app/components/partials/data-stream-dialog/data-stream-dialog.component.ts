import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-stream-dialog',
  templateUrl: './data-stream-dialog.component.html',
  styleUrl: './data-stream-dialog.component.scss'
})
export class DataStreamDialogComponent {
  
  @Input() dataStreamsData: any | null = null;

  delete(){
    
  }

  

}

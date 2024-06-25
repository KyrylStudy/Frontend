import { Component, Input } from '@angular/core';
import { LineCreationService } from '../../../services/header-main.service';

@Component({
  selector: 'app-data-stream-dialog',
  templateUrl: './data-stream-dialog.component.html',
  styleUrl: './data-stream-dialog.component.scss'
})
export class DataStreamDialogComponent {

  constructor(/*private ecuService:EcuService,*/ private lineCreationService: LineCreationService/*, private renderer: Renderer2,
    private elementRef: ElementRef*/) { 


  }
  
  @Input() dataStreamsData: any | null = null;

  deleteDataStreamButton(){
   
    this.deleteDataStream(this.dataStreamsData.dataForDataStreamDetails.selectedDataStream.id);
  }

  private deleteDataStream(id: BigInt){
    this.lineCreationService.deleteDataStream(id).subscribe({
      next: (data) => {
        // Assuming the deletion was successful if this callback is called
        this.dataStreamsData.showDataStreamDialog = false;
        this.dataStreamsData.showService = true;
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

  

}

import { Component, Input, OnInit } from '@angular/core';
import { LineCreationService } from '../../../services/header-main.service';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'app-data-stream-dialog',
  templateUrl: './data-stream-dialog.component.html',
  styleUrl: './data-stream-dialog.component.scss'
}) 
export class DataStreamDialogComponent implements OnInit{

  constructor(private architectureService:ArchitectureService, private lineCreationService: LineCreationService) { 
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

  ngOnInit(): void {
    this.subscribeOnSelectedArchitecture()
  }



  close(){
    this.dataStreamsData.showDataStreamDialog = false;
  }
  
  @Input() dataStreamsData: any | null = null;


  deleteDataStreamButton(){
   
    this.deleteDataStream(this.dataStreamsData.selectedDataStream.id);
  }

  private deleteDataStream(id: BigInt){
    this.lineCreationService.deleteDataStream(id).subscribe({ 
      next: (data) => {
        // Assuming the deletion was successful if this callback is called
        this.lineCreationService.getAllDataStreams(this.selectedArchitecture);

        this.dataStreamsData.showDataStreamDialog = false;
        
        //this.dataStreamsData.showService = true;
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

  

}

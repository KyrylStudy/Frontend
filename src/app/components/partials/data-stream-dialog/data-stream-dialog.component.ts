import { Component, Input, OnInit } from '@angular/core';
import { LineCreationService } from '../../../services/data-stream.service';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'app-data-stream-dialog',
  templateUrl: './data-stream-dialog.component.html',
  styleUrl: './data-stream-dialog.component.scss'
}) 
export class DataStreamDialogComponent implements OnInit{

  constructor(private architectureService:ArchitectureService, private lineCreationService: LineCreationService) { 
  }

  twoWayConnectionEditMod: boolean = false;
  /*editTwoWayConnection(){
    this.twoWayConnectionEditMod = true;
    this.dataStreamsData.selectedDataStream.twoWayConnection = !this.dataStreamsData.selectedDataStream.twoWayConnection;
  }*/
  twoWayConnectionChange(event:any){
    this.dataStreamsData.selectedDataStream.twoWayConnection = event.target.checked;
    console.log(this.dataStreamsData.selectedDataStream.twoWayConnection)
  }

  /*canselTwoWayConnection(){
    this.twoWayConnectionEditMod = false;
  }

  saveTwoWayConnection(){
    this.twoWayConnectionEditMod = false;
  }*/

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
        this.dataStreamsData.getDataStreams(this.selectedArchitecture.id);
        this.dataStreamsData.showDataStreamDialog = false;
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error deleting Data Stream', error);
      }
    });
  }

  

}

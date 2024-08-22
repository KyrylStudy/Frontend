import { Component, Input, OnInit } from '@angular/core';
import { LineCreationService } from '../../../services/data-stream.service';
import { ArchitectureService } from '../../../services/architecture.service';
import { DataStreamProperty, NewDataStreamProperty } from '../../../shared/models/data_stream_property';
import { DataStreamPropertyService } from '../../../services/data-stream-property.service';

@Component({
  selector: 'app-data-stream-dialog',
  templateUrl: './data-stream-dialog.component.html',
  styleUrl: './data-stream-dialog.component.scss'
}) 
export class DataStreamDialogComponent implements OnInit{

  constructor(private architectureService:ArchitectureService, private lineCreationService: LineCreationService,
     private dataStreamPropertyService:DataStreamPropertyService) { 
  }

  twoWayConnectionEditMod: boolean = false;
  
  save(){

  }

  nameEditMod:boolean = false;
  editName(){
    this.nameEditMod = true;
  }

  canselEditingName(){
    this.nameEditMod = false;
  }

  saveName(){
    this.lineCreationService.updateDataStream(this.dataStreamsData.selectedDataStream, this.dataStreamsData.selectedDataStream.id);
    this.nameEditMod = false;
  }

  descriptionEditMod:boolean = false;
  editDescription(){ 
    this.descriptionEditMod = true;
    setTimeout(()=>{
      this.autoResizeTextarea();
    },50)

  }

  autoResizeTextarea() {
    const textarea = document.getElementById('textarea-description');
    if(textarea){
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  saveDescription(){
    this.lineCreationService.updateDataStream(this.dataStreamsData.selectedDataStream, this.dataStreamsData.selectedDataStream.id);
    this.descriptionEditMod = false;
  }

  canselEditingDescription(){
    this.descriptionEditMod = false;
  }

  twoWayConnectionChange(){
   this.dataStreamsData.selectedDataStream.twoWayConnection = !this.dataStreamsData.selectedDataStream.twoWayConnection;
   this.lineCreationService.updateDataStream(this.dataStreamsData.selectedDataStream, this.dataStreamsData.selectedDataStream.id);
  }

  dataStreamPropertyId: any = null; 
  editProperty(dataStreamProperty: DataStreamProperty){
    this.dataStreamPropertyId = dataStreamProperty.id;
  }

  canselEditingProperty(){
    this.dataStreamPropertyId = null;
  }

  deleteProperty(dataStreamProperty: DataStreamProperty){
    this.dataStreamPropertyService.deleteDataStreamProperty(dataStreamProperty.id, this.dataStreamsData.selectedDataStream.id)
  }

  saveProperty(dataStreamProperty: DataStreamProperty){
    this.dataStreamPropertyService.updateDataStreamProperty(dataStreamProperty, dataStreamProperty.id, this.dataStreamsData.selectedDataStream.id)
    this.dataStreamPropertyId = null;
  }

  propertyKey: string = '';
  propertyValue: string = '';

  addServiceProperty(): void {
    if (this.dataStreamsData.selectedDataStream && this.propertyKey && this.propertyValue) {

      const newDataStreamProperty: NewDataStreamProperty = {name: this.propertyKey, value: this.propertyValue};

      this.dataStreamPropertyService.createDataStreamProperty(newDataStreamProperty, this.dataStreamsData.selectedDataStream.id);

      this.propertyKey = '';
      this.propertyValue = '';
    }
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

  dataStreamProperties: DataStreamProperty[] = [];
  subscribeOnDataStreamProperties(){
    this.dataStreamPropertyService.dataStreamProreries$.subscribe(
        {
          next: data => {
            this.dataStreamProperties = data;
          },
          error: error => {
            console.error(error);
          }
        }
    );
  }

  ngOnInit(): void {
    this.subscribeOnSelectedArchitecture()

    this.dataStreamPropertyService.loadAllDataStreamProperties(this.dataStreamsData.selectedDataStream.id);

    this.subscribeOnDataStreamProperties();
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

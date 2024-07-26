import { Component, EventEmitter, Output, Input } from '@angular/core';
import { LineCreationService } from '../../../services/data-stream.service';
//import { Connection } from '../../../shared/models/connection-model';
//import { EcuService } from '../../../services/ecu.service';
import { Hardware } from '../../../shared/models/hardware';

@Component({
  selector: 'bus-dialog',
  templateUrl: './bus-dialog.component.html',
  styleUrl: './bus-dialog.component.scss'
})
export class BusDialogComponent {
  @Input() dialogData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  close(): void {
    this.closeDialog.emit(true);
    //console.log(this.dialogData)
  }

  delete(): void {
    var connectedFromEcuId = this.dialogData.selectedConnection.connectedFrom;
    var connectedFromEcu: Hardware | null = null;
    var connectedToEcuId = this.dialogData.selectedConnection.connectedTo;
    var connectedToEcu: Hardware | null = null;
    for(let i = 0; i < this.dialogData.ecus.length; i++){
      if(this.dialogData.ecus[i].id == connectedFromEcuId){
        //connectedFromEcu = this.dialogData.ecus[i];
        this.dialogData.ecus[i].connectedTo = ''
        console.log(this.dialogData.ecus[i])
      }
      if(this.dialogData.ecus[i].id == connectedToEcuId){
        //connectedToEcu = this.dialogData.ecus[i];
        this.dialogData.ecus[i].connectedTo = ''
        console.log(this.dialogData.ecus[i])
      }
    }

    this.dialogData.connections = this.dialogData.connections.filter((item: { id: any; }) => item.id !== this.dialogData.selectedConnection.id);
    //console.log(this.dialogData.connections)
    this.deleteBus(this.dialogData.selectedConnection.id);
    this.closeDialog.emit(true);
  }

  constructor(private lineCreationService: LineCreationService/*, private ecuService:EcuService*/) {}

  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();

    let indexToRemove = this.dialogData.connections.findIndex((obj: { id: BigInt; }) => obj.id === id);

    // Удаляем объект, если он найден
    if (indexToRemove > -1) {
      this.dialogData.connections.splice(indexToRemove, 1);
    }
  }

}


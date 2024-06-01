import { Component, EventEmitter, Output, Input } from '@angular/core';
import { LineCreationService } from '../../../services/header-main.service';
import { Line } from '../../../shared/models/line';
import { EcuService } from '../../../services/ecu.service';
import { Ecu } from '../../../shared/models/ecu';

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
    var connectedFromEcuId = this.dialogData.selectedBus.connectedFrom;
    var connectedFromEcu: Ecu | null = null;
    var connectedToEcuId = this.dialogData.selectedBus.connectedTo;
    var connectedToEcu: Ecu | null = null;
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
   /* if(connectedFromEcu){
      connectedFromEcu.connectedTo = ''
      this.updateEcu(connectedFromEcu, connectedFromEcuId);
    }
    if(connectedToEcu){
      connectedToEcu.connectedTo = ''
      this.updateEcu(connectedToEcu, connectedToEcuId);
    }*/
    /*for(let i = 0; i < this.dialogData.lines.length; i++){
      if(this.dialogData.lines[i].id === this.dialogData.selectedBus.id){
        this.dialogData.lines[i].delete
      }
    }*/
    this.dialogData.lines = this.dialogData.lines.filter((item: { id: any; }) => item.id !== this.dialogData.selectedBus.id);
    //console.log(this.dialogData.lines)
    this.deleteBus(this.dialogData.selectedBus.id);
    this.closeDialog.emit(true);
  }

  constructor(private lineCreationService: LineCreationService, private ecuService:EcuService) {}

  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();
  }

  private updateEcu(Ecu: Ecu, id: BigInt){
    this.ecuService.updateEcu(Ecu, id).subscribe();
   }
}


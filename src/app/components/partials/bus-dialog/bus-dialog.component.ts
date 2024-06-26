import { Component, EventEmitter, Output, Input } from '@angular/core';
import { LineCreationService } from '../../../services/header-main.service';
//import { Connection } from '../../../shared/models/connection-model';
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

    this.dialogData.lines = this.dialogData.lines.filter((item: { id: any; }) => item.id !== this.dialogData.selectedBus.id);
    //console.log(this.dialogData.lines)
    this.deleteBus(this.dialogData.selectedBus.id);
    this.closeDialog.emit(true);
  }

  constructor(private lineCreationService: LineCreationService, private ecuService:EcuService) {}

  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();

    let indexToRemove = this.dialogData.lines.findIndex((obj: { id: BigInt; }) => obj.id === id);

    // Удаляем объект, если он найден
    if (indexToRemove > -1) {
      this.dialogData.lines.splice(indexToRemove, 1);
    }
  }

  private updateEcu(Ecu: Ecu, id: BigInt){
    this.ecuService.updateEcu(Ecu, id).subscribe();
   }
}


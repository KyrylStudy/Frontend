// dialog.component.ts

import { Component, EventEmitter, Output, Input, Renderer2/*, OnInit*/ } from '@angular/core';
import { EcuService } from '../../../services/ecu.service';
import { LineCreationService } from '../../../services/header-main.service';
import { Service } from '../../../shared/models/service';
import { NewLine } from '../../../shared/models/line';


@Component({
  selector: 'ecu-dialog',
  templateUrl: './ecu-dialog.component.html',
  styleUrls: ['./ecu-dialog.component.scss']
})
export class DialogComponent /*implements OnInit*/{
  @Input() dialogData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  close(): void {
    this.closeDialog.emit(true);
  }

  delete(): void {
   var busIdDeleteArray: any[] = [];
    for(let i = 0; i < this.dialogData.lines.length; i++){
      if(this.dialogData.lines[i].connectedFrom == this.dialogData.selectedEcu.id.toString()){
        busIdDeleteArray.push(this.dialogData.lines[i].id);
        this.deleteBus(this.dialogData.lines[i].id)
      }else if(this.dialogData.lines[i].connectedTo == this.dialogData.selectedEcu.id.toString()){        
        busIdDeleteArray.push(this.dialogData.lines[i].id);
        this.deleteBus(this.dialogData.lines[i].id)
        
      }
    }
    this.deleteEcu(this.dialogData.selectedEcu.id)

    for(let i = 0; i < busIdDeleteArray.length; i++){
      this.dialogData.lines = this.dialogData.lines.filter((item: { id: any; }) => item.id != busIdDeleteArray[i]);
    }
    this.dialogData.ecus = this.dialogData.ecus.filter((item: { id: any; }) => item.id !== this.dialogData.selectedEcu.id);
    this.closeDialog.emit(true);
  }

  private deleteEcu(id: BigInt){
    this.ecuService.deleteEcu(id).subscribe();
  }

  private deleteBus(id: BigInt){
    this.lineCreationService.deleteBus(id).subscribe();
  }

  constructor(private ecuService:EcuService,private lineCreationService: LineCreationService, private renderer: Renderer2) { 


  }

  /*ngOnInit(): void{
    //this.get()
    
  }*/

  //------------------------19.05
  showService: boolean = false;

  openDialog(): void {
    this.showService = !this.showService;
    this.dialogData.isEcuDetailsMod = !this.dialogData.isEcuDetailsMod;
    //console.log(this.dialogData.selectedEcu)
    this.dialogData.getAllServices(this.dialogData.selectedEcu.id)
    this.dialogData.initializeGraph(this.dialogData.lines);
    /*for(let i = 0; i < this.dialogData.ecus.length; i++){
      if(this.dialogData.canReach(this.dialogData.selectedEcu.id.toString(), this.dialogData.ecus[i].id.toString())){

      }
    }*/
    
  }

  onCloseDialog(): void {
    this.showService = false;
  }

 /* private updateService(Service: Service, id: BigInt){
    //console.log(Line)
    this.ecuService.updadeService(Service, id).subscribe();
   }*/

  saveServices() {}
   /* debugger
    console.log(this.dialogData.ecus);
    for(let i = 0; i < this.dialogData.ecus.length; ++i){
      var servicesOfEcu = this.dialogData.servicesMap.get(this.dialogData.ecus[i].id);
      console.log("services: ", servicesOfEcu);
      for(let j = 0; j < servicesOfEcu.length; j++){
          this.updateService(servicesOfEcu[j], servicesOfEcu[j].id);
      }
    }
  }*/

//-------------------------------28.05

  createDatastream(){
    this.dialogData.creatingDatastreamModus = !this.dialogData.creatingDatastreamModus;
  }

  serviceDialogData: any = this;


  onCloseCreateDialog(){
    this.showCreateDialog = !this.showCreateDialog;
  }

  showCreateDialog: boolean = false;
  openCreateServiceDialog(){
    this.showCreateDialog = !this.showCreateDialog;
  }

  goBack(){
    this.showService = !this.showService;
    this.dialogData.isEcuDetailsMod = !this.dialogData.isEcuDetailsMod;
  }

  
  

}

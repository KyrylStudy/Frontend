import { Component, Input,/*, Output*/ 
OnInit} from '@angular/core';
import { Architecture } from '../../../shared/models/architectures';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'app-architecture-details-dialog',
  templateUrl: './architecture-details-dialog.component.html',
  styleUrl: './architecture-details-dialog.component.scss'
})
export class ArchitectureDetailsDialogComponent implements OnInit{

  @Input() architectureDetailsData: any | null = null;

  constructor(private architectureService:ArchitectureService) { }

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

  architectures: any[] | null = null;
  subscribeOnArchitectures(){
    this.architectureService.architectures$.subscribe(
        {
          next: data => {
            this.architectures = data;
          },
          error: error => {
            console.error(error);
          }
        }
    );
  }

  ngOnInit(): void{
    this.subscribeOnSelectedArchitecture();
    this.subscribeOnArchitectures();
  }

 close(){
  this.architectureDetailsData.showArchitectureDetails = false;
 }

 delete(){
  if(this.selectedArchitecture){
    this.architectureService.deleteArchitecture(this.selectedArchitecture.id)
    this.architectureDetailsData.showArchitectureDetails = false;
  }
 }

 nameEditMod: boolean = false;
 editName(){
   this.nameEditMod = true;
 }

 canselEditingName(){
   this.nameEditMod = false;
 }

 saveName(){
  if(this.selectedArchitecture){
   this.architectureService.updateArchitecture(this.selectedArchitecture, BigInt(this.selectedArchitecture.id));
   this.nameEditMod = false;
  }
 }

 descriptionEditMod: boolean = false;
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
  this.architectureService.updateArchitecture(this.selectedArchitecture, this.selectedArchitecture.id);
  this.descriptionEditMod = false;
}

canselEditingDescription(){
  this.descriptionEditMod = false;
}

}

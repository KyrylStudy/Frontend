import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewArchitecture } from '../../../shared/models/architectures';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({ 
  selector: 'app-create-architecture',
  templateUrl: './create-architecture.component.html',
  styleUrl: './create-architecture.component.scss'
})
export class CreateArchitectureComponent {
  constructor(private architectureService:ArchitectureService) { 
  }

  ngOnInit(): void {
  }

  @Input() createArchitectureData: any | null = null;

  close(): void {
    this.createArchitectureData.showCreateArchitectureDialog = false;
  }

  newArchitectureName: any = null;
  newArchitectureDescription: any = null;
  architecture: any = 'new Architecture';


  save(){
      if (this.newArchitectureName && this.newArchitectureDescription) {
        if(this.createArchitectureData.architectures){
          const newArchitecture: NewArchitecture = {
            name: this.newArchitectureName,
            type: 'Architecture',
            description: this.newArchitectureDescription,
            };

            this.architectureService.createArchitecture(newArchitecture)
        }
        this.createArchitectureData.showCreateArchitectureDialog = false;
      }else {
        console.log("All required feelds have to be filled!")
      }
      
    }
    
  }


import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { Hardware, NewHardware } from '../../../shared/models/hardware';
import { Connection } from '../../../shared/models/connection-model';
import { NewConnection } from '../../../shared/models/connection-model';
import { EcuService } from '../../../services/ecu.service';
//import { HeaderComponent } from '../header/header.component';
//import { sample_lines } from '../../../../data'; // Import sample_lines from data.ts
import { LineCreationService } from '../../../services/data-stream.service';
import { Software } from '../../../shared/models/software';
import { NewSoftware } from '../../../shared/models/software';
import { HardwareProperty } from '../../../shared/models/hardware_property';
import { NewHardwareProperty } from '../../../shared/models/hardware_property';
import { Architecture } from '../../../shared/models/architectures';
import { NewArchitecture } from '../../../shared/models/architectures';
//import { Connection } from '../../../shared/models/service';
import { Service } from '../../../shared/models/service';
import { Observable, concatMap, forkJoin, tap } from 'rxjs';
import { DataStream } from '../../../shared/models/data_stream';
import { MainInternalServiceService } from '../../../services/main-internal-service.service';
import { ArchitectureService } from '../../../services/architecture.service';
import { HardwarePropertyService } from '../../../services/hardware-property.service';
import { ServiceService } from '../../../services/service.service';




@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',

})
export class MainScreenComponent implements OnInit{

  showCreateHardwareDialog: any = null;
  showBusDialog: boolean = false;
  
  
  dialogData: any = this; //data for export

  //showHardwareDetailsDialog: boolean = false;
  showHardwareDetailsDialogContent = false;

  openHarwareDetailsDialog(hardware: Hardware): void { 
    this.updateCurrentState();
    this.ecuService.setSelectedHardware(hardware);
    this.showHardwareDetailsDialogContent = true;
    
    this.hardwarePropertyService.loadAllHardwareProperties(hardware.id);
  }

  closeHarwareDetailsDialog(): void {
    this.ecuService.setSelectedHardware(null)
    this.showHardwareDetailsDialogContent = false;
  }



  selectedConnection: Connection | null = null;
  openHardwareConnectionDetailsDialog(connection: Connection): void {
    this.updateCurrentState();
    this.selectedConnection = connection;
    this.showBusDialog = true;
  }


  onCloseBusDialog(): void {
    this.showBusDialog = false;
  }

  onCloseCreateHardwareDialog(): void {
    this.showCreateHardwareDialog = null;
  }

 //--------01.04.--------------
 connections: Connection[] = [];
 
 //------------------ 


//moveEnabled = this.HeaderComponent.moveEnabled;
  ECUwidth = 150 + 4;
  ECUheight = 75 + 4;

  ecus:Hardware[] = [];

  isSidebarOpen = false;
  servisecOfSelectedEcu: Hardware | null = null;
  selectedEcu: Hardware | null = null;


  dataFromHeader: any;

  constructor(private serviceService:ServiceService, private hardwarePropertyService:HardwarePropertyService, private architectureService:ArchitectureService,
     private mainInternalService:MainInternalServiceService, private ecuService:EcuService, private lineCreationService: LineCreationService, private renderer: Renderer2,
    private elementRef: ElementRef) { 


  }
  

  onDragEnded(event: any, ecu: Hardware): void {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getElementPosition(element.parentElement);

    ecu.positionX = boundingClientRect.x - parentPosition.left;
    ecu.positionY = boundingClientRect.y - parentPosition.top;
  
    this.rewriteLine(ecu);
 
  }


  private getElementPosition(element: any): { left: number, top: number } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  rewriteLine(ecu: Hardware) {
   
    const ecuDragging: any = document.querySelector('.cdk-drag-dragging');

    var ecuRect = ecuDragging.getBoundingClientRect();

   
//console.log(ecuDragging.offsetWidth)
   //----------------------------------------------------------------------вот єту штуку можно вставить на удаление 
          
          var numberOfConnections = 0;
         
            for(let i = 0; i < this.connections.length; i++){
              if(this.connections[i].connectedFrom == ecu.id.toString()
                || this.connections[i].connectedTo == ecu.id.toString()){
                  numberOfConnections++; 
              }
            }
       


          //const busWidth = ecuDragging.children[0].offsetWidth;

          var positionOfConnection = 0;
          if(numberOfConnections >= 1){
            //debugger
            var positionOfConnection = Number(ecuRect.width)/(numberOfConnections - 1);
          }else{
            positionOfConnection = 0
          }
          //console.log('positionOfConnection  ', positionOfConnection)

          numberOfConnections = 0;
//console.log(this.zoomLevel)  //ecuRect
//console.log(ecuRect.top)

    if(ecu.type == 'BUS' /*|| ecu.type == 'CAN'*/){
      for(let i = 0; i < this.connections.length; i++){
        if(this.connections[i].connectedFrom == ecu.id.toString()
          || this.connections[i].connectedTo == ecu.id.toString()){
            if(this.connections[i].connectedTo == ecu.id.toString()){
              this.connections[i].positionToX = (ecuRect.left + positionOfConnection*numberOfConnections).toString();
              this.connections[i].positionToY = (ecuRect.top - (96 + (96 - 96*this.zoomLevel)) /*- ecuRect.height*this.zoomLevel*/).toString();
              //console.log(this.lines[i].positionToX = (ecuRect.left + positionOfConnection*numberOfConnections).toString())
            }else {
              this.connections[i].positionFromX = (ecuRect.left + positionOfConnection*numberOfConnections).toString();
              this.connections[i].positionFromY = (ecuRect.top - (96 + (96 - 96*this.zoomLevel)) /*- ecuRect.height*this.zoomLevel*/).toString();
             // console.log(this.lines[i].positionFromX = (ecuRect.left + positionOfConnection*numberOfConnections).toString())
            }
           // console.log('positionToX  ', this.lines[i].positionToX )
            numberOfConnections++;
        }
      }
    }else{
      for(let i = 0; i < this.connections.length; i++){
        if(this.connections[i].connectedFrom == ecu.id.toString()){
          this.connections[i].positionFromX = (ecuRect.left + (this.ECUwidth/2)).toString(); 
          this.connections[i].positionFromY = (ecuRect.top - (this.ECUheight + (this.ECUheight - this.ECUheight*this.zoomLevel))).toString();
        }else if(this.connections[i].connectedTo == ecu.id.toString()){
          this.connections[i].positionToX = (ecuRect.left + (this.ECUwidth/2)).toString();
          this.connections[i].positionToY = (ecuRect.top - (this.ECUheight + (this.ECUheight - this.ECUheight*this.zoomLevel))).toString();
        }
      }
    }



}

 //software:Software[] = [];
 //hardware:Software[] = [];

  zoomLevel: number = 1; // Initial zoom level

  zoomIn() {
    if(this.zoomLevel < 1.1){
      this.zoomLevel += 0.1; // Increase zoom level 

      console.log(this.servicesCountMap)
      //console.log(this.servicesMap) 
      //this.initializeGraph(this.connections);
      //console.log('can i reach? ', this.canReach('41', '51'));//-----------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

  }

  zoomOut() {
    if (this.zoomLevel > 0.7) {
      this.zoomLevel -= 0.1; // Decrease zoom level, ensuring it doesn't go below 0.1
    }
  }



//----------------------01.04.--------------------------------------------------------02.04
creatingLine = false;

subscribeOnSelectedHardware(){
  this.ecuService.selectedHardware$.subscribe(
      {
        next: data => {
          this.selectedEcu = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

subscribeOnHardwares(){
  this.ecuService.hardwares$.subscribe(
      {
        next: data => {
          this.ecus = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

architectures: Architecture[] | null = null;
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

selectedArchitecture: Architecture | null = null;
subscribeOnSelectedArchitecture(){
  this.architectureService.selectedArchitecture$.subscribe(
      {
        next: data => {
          this.selectedArchitecture = data;
          
          if(this.selectedArchitecture)
          this.lineCreationService.getAllDataStreams(this.selectedArchitecture.id).subscribe(data=>{
            this.dataStreams = data;
          });
          if (data) {
           this.ecuService.loadAllHardwares(data.id).subscribe(data => {
            this.serviceService.getAllServices(data);
            console.log(data)
           });
          }
          
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

hardwareProperties: HardwareProperty[] | null = null;
subscribeOnHardwareProperties(){
  this.hardwarePropertyService.hardwareProreries$.subscribe(
      {
        next: data => {
          this.hardwareProperties = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

servicesMap: Map<BigInt, Service[]> = new Map();
subscribeOnServices(){
  this.serviceService.allServicesInArchitectureMap$.subscribe(
      {
        next: data => {
          this.servicesMap = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

servicesCountMap: Map<BigInt, number> = new Map();
//servicesMap: Map<BigInt, Service[]> = new Map();
subscribeOnServicesCount(){
  this.serviceService.allServicesInArchitectureCountMap$.subscribe(
      {
        next: data => {
          this.servicesCountMap = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

dataStreams: DataStream[] = [];
subscribeOnDataStreams(){
  this.lineCreationService.dataStreams$.subscribe(
      {
        next: data => {
          this.dataStreams = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

  ngOnInit(): void{

    this.subscribeOnArchitectures();
    this.architectureService.loadAllArchitectures();

    this.subscribeOnSelectedHardware();
    this.subscribeOnHardwares();

    this.subscribeOnDataStreams();

    this.subscribeOnSelectedArchitecture();
    this.architectureService.loadArchitecture(BigInt(1));

    this.subscribeOnHardwareProperties();

    this.subscribeOnServicesCount();
    this.subscribeOnServices();

    //-------------------------------------------------
    this.getAllBus(1);
  }
//----------------------------------------------------------------------------------------------
  private getAllBus(architectureId: number){
    this.lineCreationService.getAllBus(architectureId).subscribe(data => {
      this.connections = data;
    });
  }


//---------------------03.06

private graph: { [key: string]: string[] } = {};


  public initializeGraph(lines: Connection[]): void {
    this.graph = {};

    lines.forEach(line => {
      if (!this.graph[line.connectedFrom]) {
        this.graph[line.connectedFrom] = [];
      }
      if (!this.graph[line.connectedTo]) {
        this.graph[line.connectedTo] = [];
      }

      // Добавляем оба направления, так как порядок не важен
      this.graph[line.connectedFrom].push(line.connectedTo);
      this.graph[line.connectedTo].push(line.connectedFrom);

      // Если соединение двустороннее, добавляем обратную связь
      if (line.twoWayConnection) {
        this.graph[line.connectedTo].push(line.connectedFrom);
        this.graph[line.connectedFrom].push(line.connectedTo);
      }
    });
  }

  // Метод для проверки возможности перехода от одного блока к другому
  public canReach(start: string, end: string): boolean {
    if (start === end) {
      return false;
    }

    let visited: Set<string> = new Set();
    let queue: string[] = [start];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) continue;

      if (current === end) {
        return true;
      }

      visited.add(current);

      if(this.graph[current]){
        for (let neighbor of this.graph[current]) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
      
    }

    return false;
  }





//----------------------------------------------------------------------------HEADER---START-----

optionsDropdownCreate = [
  { id: 1, label: 'new Hardware' },
  { id: 3, label: 'new Connection' },
  { id: 4, label: 'new Architecture' },
];
selectedOptionDropdownCreate: any = null;


   updateBus(Line: Connection, id: BigInt){
    this.lineCreationService.updateBus(Line, id).subscribe();
   }

    updateEcu(Ecu: Hardware, id: BigInt): void {
    this.ecuService.updateHardware(Ecu, id);
  }

   updateCurrentState() {

      for(let i = 0; i < this.connections.length; ++i){
        
        this.updateBus(this.connections[i], this.connections[i].id);
      }
      for(let i = 0; i < this.ecus.length; ++i){
        
        this.updateEcu(this.ecus[i], this.ecus[i].id);
      }
   }

showDropdown = false; 
toggleDropdownCreate(): void {
    this.showDropdown = true;
}


showDropdownSelectArchitecture = false; 
toggleDropdownSelectArchitecture(): void {
    this.showDropdownSelectArchitecture = true;
}

selectArchitecture(option: Architecture): void {
  this.updateCurrentState();
  this.architectureService.setSelectedArchitecture(option);

  const svgContainer = document.getElementById('svg-container');

  if (!svgContainer) {
      return; 
  }

  const connections = svgContainer.querySelectorAll('line');
  connections.forEach(connection => {
      svgContainer.removeChild(connection); // Remove each line element
    });

  this.getAllBus(option.id);
  this.showDropdownSelectArchitecture = false;
  
}

startEcu: Hardware | null = null;
endEcu: Hardware | null = null;
creatingBusModus: Boolean = false;
startTargetEcuElementNewBus: any;
endTargetEcuElementNewBus: any;
busWidthStart: any;
busWidthEnd: any;

onEcuClick(ecu: Hardware, event: MouseEvent){
  if(this.creatingBusModus){
    if (!this.startEcu) {
      // First click, select start ECU
      this.startTargetEcuElementNewBus = event.target as HTMLElement;
      this.renderer.addClass(this.startTargetEcuElementNewBus, 'selected');

      this.startEcu = ecu;
      if(this.startEcu.type == "BUS" /*|| this.startEcu.type == "CAN"*/){
        this.busWidthStart = event.target as HTMLElement;
      }
      
      //console.log('Selected start ECU:', this.startEcu);
    } else if (!this.endEcu) {
      // Second click, select end ECU and create line
      this.endTargetEcuElementNewBus = event.target as HTMLElement;
      this.renderer.addClass(this.endTargetEcuElementNewBus, 'selected');

      this.endEcu = ecu;
      if(this.endEcu.type == "BUS" /*|| this.endEcu.type == "CAN"*/){
        this.busWidthEnd = event.target as HTMLElement;
      }

      //console.log('Selected end ECU:', this.endEcu);
      if (this.startEcu !== this.endEcu) {
        // Ensure start and end ECUs are different
        
        //----------------------------------------------------слалать из этого фрагмента функцию
        if(((this.startEcu.type == "BUS"/*&&this.endEcu.type != "CAN") || (this.startEcu.type == "CAN"&&this.endEcu.type != "BUS"*/))){

          var numberOfConnections = 0;
          if(this.startEcu){
            for(let i = 0; i < this.connections.length; i++){
              if(this.connections[i].connectedFrom == this.startEcu.id.toString()
                || this.connections[i].connectedTo == this.startEcu.id.toString()){
                  numberOfConnections++;
              }
            }
          }

          var positionOfConnection = 0;
          if(numberOfConnections >= 1){
             positionOfConnection = Number(this.busWidthStart.offsetWidth)/(numberOfConnections);
          }else{
            positionOfConnection = 0
          }

          numberOfConnections = 0;
          if(this.startEcu){
            for(let i = 0; i < this.connections.length; i++){
              if(this.connections[i].connectedFrom == this.startEcu.id.toString()
                || this.connections[i].connectedTo == this.startEcu.id.toString()){
                  if(this.connections[i].connectedFrom == this.startEcu.id.toString()){
                    this.connections[i].positionFromX = (this.startEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }else {
                    this.connections[i].positionToX = (this.startEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }
                  numberOfConnections++;
              }
            }
          }

          const newLine: NewConnection = {
          name: 'Bus ' + (this.connections.length + 1), type: 'Bus',
          description: 'default description',
          positionFromX:  (this.startEcu.positionX - 2 + positionOfConnection*numberOfConnections).toString(),
          positionFromY: (this.startEcu.positionY - 38).toString(),
          positionToX:(this.endEcu.positionX + (this.ECUwidth/2)).toString(),
          positionToY: (this.endEcu.positionY).toString(),
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(),
          twoWayConnection: false};

          if(this.selectedArchitecture)
          this.lineCreationService.createBus(this.selectedArchitecture.id, newLine).subscribe(data =>{
            this.connections[this.connections.length] = data
            //console.log(this.lines)
            //this.setValueToShare(this);
          });
  
          console.log('New line created:', newLine); 

//-------------------------------------------------------слалать из этого фрагмента функцию
        }else if(((this.endEcu.type == "BUS"/*&&this.startEcu.type != "CAN") || (this.endEcu.type == "CAN"&&this.startEcu.type != "BUS"*/))){

         // this.createNewConnction(this.endEcu, this.startEcu, this.busWidthEnd)
          console.log('end = bus')
          //this.busWidthEnd = event.target as HTMLElement;
          
          var numberOfConnections = 0;
          if(this.endEcu){
            for(let i = 0; i < this.connections.length; i++){
              if(this.connections[i].connectedFrom == this.endEcu.id.toString()
                || this.connections[i].connectedTo == this.endEcu.id.toString()){
                  numberOfConnections++;
              }
            }
          }

          //console.log('numberOfConnections  ', numberOfConnections)

          var positionOfConnection = 0;
          if(numberOfConnections >= 1){
            var positionOfConnection = Number(this.busWidthEnd.offsetWidth)/(numberOfConnections);
          }else{
            positionOfConnection = 0
          }
          //console.log('positionOfConnection  ', positionOfConnection)

          numberOfConnections = 0;
          if(this.endEcu){
            for(let i = 0; i < this.connections.length; i++){
              if(this.connections[i].connectedFrom == this.endEcu.id.toString()
                || this.connections[i].connectedTo == this.endEcu.id.toString()){
                  if(this.connections[i].connectedTo == this.endEcu.id.toString()){
                    this.connections[i].positionToX = (this.endEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }else {
                    this.connections[i].positionFromX = (this.endEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }
                 // console.log('positionToX  ', this.lines[i].positionToX )
                  numberOfConnections++;
              }
            }
          }



          const newLine: NewConnection = {
          name: 'Bus ' + (this.connections.length + 1), type: 'Bus',
          description: 'default description', 
          positionFromX: (this.startEcu.positionX + (this.ECUwidth/2)).toString(),
          positionFromY: this.startEcu.positionY.toString(), 
          positionToX: (this.endEcu.positionX - 2 + positionOfConnection*numberOfConnections).toString(),
          positionToY: (this.endEcu.positionY - 38).toString(), 
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), 
          twoWayConnection: false};

          if(this.selectedArchitecture)
          this.lineCreationService.createBus(this.selectedArchitecture.id, newLine).subscribe(data =>{
            this.connections[this.connections.length] = data
            //console.log(this.lines)
            //this.setValueToShare(this);
          });
  
         console.log('New line created:', newLine);

//----------------------------------------------------------------------------------------------------------------------------          
        }else{
          console.log("ECU has to be connected with BUS or CAN")
        }
      
      } else {
        console.log('Start and end ECUs cannot be the same');
      }
      // Reset start and end ECUs
      
      this.startEcu = null;
      this.endEcu = null;
      this.creatingBusModus = false;
      setTimeout(()=>{
        this.renderer.removeClass(this.startTargetEcuElementNewBus, 'selected');
        this.renderer.removeClass(this.endTargetEcuElementNewBus, 'selected');
      }, 1000)

    }
   // console.log('Creating a line between ECUs');
  } else {
    // Default ECU click handling logic
    console.log("default ecu click")
  }
  }

  
   


selectOptioWhatToCreate(option: any): void {
    this.updateCurrentState();
   if (option.label === 'new Hardware') {
    this.showCreateHardwareDialog = option.label;
  } else if (option.label === 'new Connection') {
    //this.showCreateHardwareDialog = option.label;
    this.creatingBusModus = true;
  } else if (option.label === 'new Architecture'){
    this.showCreateHardwareDialog = option.label;
    this.selectedOptionDropdownCreate = option;   
  } else {
    this.selectedOptionDropdownCreate = option;
  }
  this.showDropdown = false; 

}


userImage: string | null = null; // Path to user image, set to null if not available
userName: string = 'John Doe'; // Default user name

//--------------------02.04.2024
creatingNewLine = false;

//---------------------------------------------------HEADER---END------------------



}










import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { Ecu, EcuPost } from '../../../shared/models/ecu';
import { Line } from '../../../shared/models/line';
import { NewLine } from '../../../shared/models/line';
import { EcuService } from '../../../services/ecu.service';
//import { HeaderComponent } from '../header/header.component';
//import { sample_lines } from '../../../../data'; // Import sample_lines from data.ts
import { LineCreationService } from '../../../services/header-main.service';
import { Software } from '../../../shared/models/software';
import { NewSoftware } from '../../../shared/models/software';
import { Hardware } from '../../../shared/models/hardware';
import { NewHardware } from '../../../shared/models/hardware';
import { ServicesIncideEcuService } from '../../../services/services-incide-ecu.service';
import { Architecture } from '../../../shared/models/architectures';
import { Connection } from '../../../shared/models/service';
import { DialogComponent } from '../ecu-dialog/ecu-dialog.component';
import { Service } from '../../../shared/models/service';
import { Observable, concatMap, forkJoin, tap } from 'rxjs';



@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',

})
export class MainScreenComponent implements OnInit{

  showBusDialog: boolean = false;
  showDialog: boolean = false;
  dialogData: any = this;

  openDialog(ecu: Ecu): void {
    this.showDialog = true;
    this.isEcuDetailsMod = true;
    this.openSidebar(ecu);
   // this.selectedEcu = ecu;
    console.log("ecu: ", this.selectedEcu)
  }

  openBusDialog(bus: Line): void {
    this.showBusDialog = true;
    this.selectedBus = bus;
    console.log( this.selectedBus )
  }

  selectedBus: Line | null = null;
  /*openBusDialog(ecu: Ecu): void {
    this.selectedEcu = ecu;
    this.getAllSoftwareByEcuId(ecu.id);
    console.log(this.software)
    this.getAllHardwareByEcuId(ecu.id);
    console.log(this.hardware)
    this.isSidebarOpen = true;
  }*/

  onCloseDialog(): void {
    this.showDialog = false;
    this.isEcuDetailsMod = false;
  }
  onCloseBusDialog(): void {
    this.showBusDialog = false;
  }

 //--------01.04.--------------
 lines: Line[] = [];
 
 //------------------ 


//moveEnabled = this.HeaderComponent.moveEnabled;
  ECUwidth = 200 + 10;
  ECUheight = 100 + 10;

  ecus:Ecu[] = [];

  isSidebarOpen = false;
  servisecOfSelectedEcu: Ecu | null = null;;
  selectedEcu: Ecu | null = null;
  isEcuDetailsMod = false;

  dataFromHeader: any;

  constructor(private ecuService:EcuService, private lineCreationService: LineCreationService, private renderer: Renderer2,
    private elementRef: ElementRef) { 


  }
  

  onDragEnded(event: any, ecu: Ecu): void {
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

  rewriteLine(ecu: Ecu) {
   
    const ecuDragging: any = document.querySelector('.cdk-drag-dragging');

    var ecuRect = ecuDragging.getBoundingClientRect();

   
//console.log(ecuDragging.offsetWidth)
   //----------------------------------------------------------------------вот єту штуку можно вставить на удаление 
          
          var numberOfConnections = 0;
         
            for(let i = 0; i < this.lines.length; i++){
              if(this.lines[i].connectedFrom == ecu.id.toString()
                || this.lines[i].connectedTo == ecu.id.toString()){
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

    if(ecu.type == 'BUS' || ecu.type == 'CAN'){
      for(let i = 0; i < this.lines.length; i++){
        if(this.lines[i].connectedFrom == ecu.id.toString()
          || this.lines[i].connectedTo == ecu.id.toString()){
            if(this.lines[i].connectedTo == ecu.id.toString()){
              this.lines[i].positionToX = (ecuRect.left + positionOfConnection*numberOfConnections).toString();
              this.lines[i].positionToY = (ecuRect.top - 100).toString();
              //console.log(this.lines[i].positionToX = (ecuRect.left + positionOfConnection*numberOfConnections).toString())
            }else {
              this.lines[i].positionFromX = (ecuRect.left + positionOfConnection*numberOfConnections).toString();
              this.lines[i].positionFromY = (ecuRect.top - 100).toString();
             // console.log(this.lines[i].positionFromX = (ecuRect.left + positionOfConnection*numberOfConnections).toString())
            }
           // console.log('positionToX  ', this.lines[i].positionToX )
            numberOfConnections++;
        }
      }//----------------------------------------------------------------------вот єту штуку можно вставить на удаление 
    }else{
      for(let i = 0; i < this.lines.length; i++){
        if(this.lines[i].connectedFrom == ecu.id.toString()){
          this.lines[i].positionFromX = (ecuRect.left + (this.ECUwidth/2)).toString();
          this.lines[i].positionFromY = (ecuRect.top - ((this.ECUheight/2) / this.zoomLevel)).toString();
        }else if(this.lines[i].connectedTo == ecu.id.toString()){
          this.lines[i].positionToX = (ecuRect.left + (this.ECUwidth/2)).toString();
          this.lines[i].positionToY = (ecuRect.top - ((this.ECUheight/2) / this.zoomLevel)).toString();
        }
      }
    }



}

//-----------------software----------hardware----------

  openSidebar(ecu: Ecu): void {
    this.selectedEcu = ecu;
    this.getAllSoftwareByEcuId(ecu.id);
    //console.log(this.software)
    this.getAllHardwareByEcuId(ecu.id);
    //console.log(this.hardware)
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  // Variables to hold software and hardware input values
softwareKey: string = '';
softwareValue: string = '';
hardwareKey: string = '';
hardwareValue: string = '';


 //software: Software | null = null;
 software:Software[] = [];
 hardware:Software[] = [];

  private getAllSoftwareByEcuId(id: BigInt){
    this.ecuService.getAllSoftwareByEcuId(id).subscribe(data => {
      this.software = data;
    });
  }

  private getAllHardwareByEcuId(id: BigInt){
    this.ecuService.getAllHardwareByEcuId(id).subscribe(data => {
      this.hardware = data;
    });
  }

  //--------------------------------------------------

  zoomLevel: number = 1; // Initial zoom level

  zoomIn() {
    this.zoomLevel += 0.1; // Increase zoom level 

    //console.log(this.servicesMap) 
    this.initializeGraph(this.lines);
    console.log('can i reach? ', this.canReach('59', '50'));//-----------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1; // Decrease zoom level, ensuring it doesn't go below 0.1
    }
  }

//------------------------------------------------------------------------------------------- 17.03.2024



addSoftwareValue(): void {
  if (this.selectedEcu && this.softwareKey && this.softwareValue) {
    const NewSoftware: NewSoftware = {name: this.softwareKey, value: this.softwareValue};
  
    this.ecuService.createSoftware(NewSoftware, this.selectedEcu.id).subscribe(data =>{
      this.software[this.software.length] = data
    });
    this.softwareKey = '';
    this.softwareValue = '';
  }
}

addHardwareValue(): void {
  if (this.selectedEcu && this.hardwareKey && this.hardwareValue) {

    const NewHardware: NewHardware = {name: this.hardwareKey, value: this.hardwareValue};
  
    this.ecuService.createHardware(NewHardware, this.selectedEcu.id).subscribe(data =>{
      this.hardware[this.hardware.length] = data
    });

    this.hardwareKey = '';
    this.hardwareValue = '';
  }
}

//-----------------------24.03-------------------------------------------------------

showListOfServices(): void {
  this.servisecOfSelectedEcu = this.selectedEcu;
  this.selectedEcu = null;
  console.log(this.servisecOfSelectedEcu)
  console.log(this.selectedEcu)
}

//----------------------01.04.--------------------------------------------------------02.04
creatingLine = false;




  ngOnInit(): void{

    this.getAllBus(1);
    this.getAllEcus(1);  
    this.getAllArchitectures();

    this.getAllServices();

  }

  private getAllBus(architectureId: number){
    this.lineCreationService.getAllBus(architectureId).subscribe(data => {
      this.lines = data;
    });
  }

  private getAllEcus(id: number) {
     this.ecuService.getAll(id).subscribe(data => {
      this.ecus = data;
      
    });
  }

  architectures: Architecture[] | null = null;
  private getAllArchitectures(){
    this.ecuService.getAllArchitectures().subscribe(data => {
      this.architectures = data;
      
    });
    if(this.architectures)
    this.selectedArchitecture = this.architectures[0];
  }

  /*services: Service[][] = [];
  private getAllServices(){
    const requests = this.ecus.map(ecu => this.ecuService.getAllServicesByEcuId(ecu.id));
    
    forkJoin(requests).subscribe(results => {
      this.services = results;
    });

  }*/

  servicesCountMap: Map<BigInt, number> = new Map();
  servicesMap: Map<BigInt, Service[]> = new Map();
  getAllServices(): void {
    // Assuming ecus array is already populated, otherwise, you need to fetch it first
    if (this.ecus.length > 0) {
      const serviceObservables: Observable<Service[]>[] = this.ecus.map(ecu => this.ecuService.getAllServicesByEcuId(ecu.id));

      forkJoin(serviceObservables).subscribe(serviceArrays => {
        serviceArrays.forEach((services, index) => {
          const ecuId = this.ecus[index].id;
          this.servicesCountMap.set(ecuId, services.length);
          this.servicesMap.set(ecuId, services);
        });
      });
    }
  }

//------------------------28.05

dataStreams: Line[] = [];
creatingDatastreamModus: Boolean = false;


//----------------------01.06
viewSwitch: boolean = true;
toggleView(){
  if(this.viewSwitch){
    this.viewSwitch = false
    console.log(this.viewSwitch)
  }else {
    this.viewSwitch = true
    console.log(this.viewSwitch)
  }
  

}
//---------------------03.06

private graph: { [key: string]: string[] } = {};


  public initializeGraph(lines: Line[]): void {
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
      return true;
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

options = [
  { id: 1, label: 'new ECU' },
  { id: 2, label: 'new Service' },
  { id: 3, label: 'new Bus' },
  { id: 4, label: 'new Architecture' },
];
selectedOption: any = null;


   private updateBus(Line: Line, id: BigInt){
    //console.log(Line)
    this.lineCreationService.updateBus(Line, id).subscribe();
   }

   private updateEcu(Ecu: Ecu, id: BigInt){
    //console.log(Line)
    this.ecuService.updateEcu(Ecu, id).subscribe();
   }

   saveLines() {
    

      for(let i = 0; i < this.lines.length; ++i){
        //console.log(this.linesFromMain[i])
        this.updateBus(this.lines[i], this.lines[i].id);
      }
      for(let i = 0; i < this.ecus.length; ++i){
        //console.log(this.linesFromMain[i])
        this.updateEcu(this.ecus[i], this.ecus[i].id);
      }
      //console.log(this.dataFromMain)

   }

showDropdown = false; 
toggleDropdownCreate(): void {
    this.showDropdown = !this.showDropdown;
}


showDropdownSelectArchitecture = false; 
toggleDropdownSelectArchitecture(): void {
    this.showDropdownSelectArchitecture = !this.showDropdownSelectArchitecture;
}

selectedArchitecture: any | null = null;
async selectArchitecture(option: any): Promise<void> {
  this.selectedArchitecture = option;

  const svgContainer = document.getElementById('svg-container');

  if (!svgContainer) {
      return;
  }

  const lines = svgContainer.querySelectorAll('line');
    lines.forEach(line => {
      svgContainer.removeChild(line); // Remove each line element
    });

  await this.getAllEcus(option.id); 
  await this.getAllBus(option.id);
  var that = this;
 setTimeout(function(){
   that.getAllServices();
 }, 100) 

  this.showDropdownSelectArchitecture = false;
}

startEcu: Ecu | null = null;
endEcu: Ecu | null = null;
creatingBusModus: Boolean = false;
startTargetEcuElementNewBus: any;
endTargetEcuElementNewBus: any;
busWidthStart: any;
busWidthEnd: any;

onEcuClick(ecu: Ecu, event: MouseEvent){
  if(this.creatingBusModus){
    if (!this.startEcu) {
      // First click, select start ECU
      this.startTargetEcuElementNewBus = event.target as HTMLElement;
      this.renderer.addClass(this.startTargetEcuElementNewBus, 'selected');

      //ecu.connectedTo = "777";
      this.startEcu = ecu;
      if(this.startEcu.type == "BUS" || this.startEcu.type == "CAN"){
        this.busWidthStart = event.target as HTMLElement;
      }
      
      console.log('Selected start ECU:', this.startEcu);
    } else if (!this.endEcu) {
      // Second click, select end ECU and create line
      this.endTargetEcuElementNewBus = event.target as HTMLElement;
      this.renderer.addClass(this.endTargetEcuElementNewBus, 'selected');

     // ecu.connectedTo = "777";
      this.endEcu = ecu;
      console.log('Selected end ECU:', this.endEcu);
      if (this.startEcu !== this.endEcu) {
        // Ensure start and end ECUs are different
        
        //----------------------------------------------------слалать из этого фрагмента функцию
        if(this.startEcu.type == "BUS" || this.startEcu.type == "CAN"){
          //console.log('start = bus')

          
          
          var numberOfConnections = 0;
          if(this.startEcu){
            for(let i = 0; i < this.lines.length; i++){
              if(this.lines[i].connectedFrom == this.startEcu.id.toString()
                || this.lines[i].connectedTo == this.startEcu.id.toString()){
                  numberOfConnections++;
              }
            }
          }

          //console.log('numberOfConnections  ', numberOfConnections)

          var positionOfConnection = 0;
          if(numberOfConnections >= 1){
             positionOfConnection = Number(this.busWidthStart.offsetWidth)/(numberOfConnections);
          }else{
            positionOfConnection = 0
          }
          //console.log('positionOfConnection  ', positionOfConnection)

          numberOfConnections = 0;
          if(this.startEcu){
            for(let i = 0; i < this.lines.length; i++){
              if(this.lines[i].connectedFrom == this.startEcu.id.toString()
                || this.lines[i].connectedTo == this.startEcu.id.toString()){
                  if(this.lines[i].connectedFrom == this.startEcu.id.toString()){
                    this.lines[i].positionFromX = (this.startEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }else {
                    this.lines[i].positionToX = (this.startEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }
                  //console.log('positionFromX  ', this.lines[i].positionFromX )
                  numberOfConnections++;
              }
            }
          }



          const newLine: NewLine = {
          name: 'Bus ' + (this.lines.length + 1), type: 'Bus',
          description: 'default description',
          positionFromX:  (this.startEcu.positionX - 2 + positionOfConnection*numberOfConnections).toString(),
          positionFromY: (this.startEcu.positionY - 38).toString(),
          positionToX:(this.endEcu.positionX + (this.ECUwidth/2)).toString(),
          positionToY: (this.endEcu.positionY).toString(),
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(),
          twoWayConnection: false};

          this.lineCreationService.createBus(this.selectedArchitecture.id, newLine).subscribe(data =>{
            this.lines[this.lines.length] = data
            //console.log(this.lines)
            //this.setValueToShare(this);
          });
  
          console.log('New line created:', newLine);

//-------------------------------------------------------слалать из этого фрагмента функцию
        }else if(this.endEcu.type == "BUS" || this.startEcu.type == "CAN"){
          console.log('end = bus')
          this.busWidthEnd = event.target as HTMLElement;
          
          var numberOfConnections = 0;
          if(this.endEcu){
            for(let i = 0; i < this.lines.length; i++){
              if(this.lines[i].connectedFrom == this.endEcu.id.toString()
                || this.lines[i].connectedTo == this.endEcu.id.toString()){
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
            for(let i = 0; i < this.lines.length; i++){
              if(this.lines[i].connectedFrom == this.endEcu.id.toString()
                || this.lines[i].connectedTo == this.endEcu.id.toString()){
                  if(this.lines[i].connectedTo == this.endEcu.id.toString()){
                    this.lines[i].positionToX = (this.endEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }else {
                    this.lines[i].positionFromX = (this.endEcu.positionX + positionOfConnection*numberOfConnections).toString();
                  }
                 // console.log('positionToX  ', this.lines[i].positionToX )
                  numberOfConnections++;
              }
            }
          }



          const newLine: NewLine = {
          name: 'Bus ' + (this.lines.length + 1), type: 'Bus',
          description: 'default description', 
          positionFromX: (this.startEcu.positionX + (this.ECUwidth/2)).toString(),
          positionFromY: this.startEcu.positionY.toString(), 
          positionToX: (this.endEcu.positionX - 2 + positionOfConnection*numberOfConnections).toString(),
          positionToY: (this.endEcu.positionY - 38).toString(), 
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), 
          twoWayConnection: false};

          this.lineCreationService.createBus(this.selectedArchitecture.id, newLine).subscribe(data =>{
            this.lines[this.lines.length] = data
            //console.log(this.lines)
            //this.setValueToShare(this);
          });
  
         console.log('New line created:', newLine);

//----------------------------------------------------------------------------------------------------------------------------          
        }else{
          const newLine: NewLine = {name: 'Bus ' + (this.lines.length + 1), type: 'Bus',
          description: 'default description', positionFromX: (this.startEcu.positionX + (this.ECUwidth/2)).toString(),
          positionFromY: this.startEcu.positionY.toString(), positionToX: (this.endEcu.positionX + (this.ECUwidth/2)).toString(),
          positionToY: this.endEcu.positionY.toString(), connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), twoWayConnection: false};

          this.lineCreationService.createBus(this.selectedArchitecture.id, newLine).subscribe(data =>{
            this.lines[this.lines.length] = data
            console.log(this.lines)
            //this.setValueToShare(this);
          });
  
        //  console.log('New line created:', newLine);
        }

        // Add new line to service
       

      } else {
        //ecu.connectedTo = "";
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
    console.log('Creating a line between ECUs');
  } else {
    // Default ECU click handling logic
    console.log("default ecu click")
  }
  }

  
   


selectOption(option: any): void {
   if (option.label === 'new ECU') {
    //console.log(this.dataFromMain.ecus)
    const newEcu: EcuPost = {label: 'ECU ' + (this.ecus.length + 1), type: 'ECU',
    description: 'default description', positionX: 228, positionY: 229, connectedTo: this.ecus.length};
  
    this.ecuService.createEcu(newEcu, this.selectedArchitecture.id).subscribe(data =>{
      this.ecus[this.ecus.length] = data
      console.log(this.ecus)
      //this.setValueToShare(this);
    }
    );
  
    //this.selectedOption = newEcu;
  } else if (option.label === 'new Bus') {
    this.creatingBusModus = true;
    //document.body.style.backgroundColor = 'green'; // Change background color to green
  } else {
    this.selectedOption = option;
  }
  this.showDropdown = false;  //---------------------------commited-->

}


userImage: string | null = null; // Path to user image, set to null if not available
userName: string = 'John Doe'; // Default user name

//--------------------02.04.2024
creatingNewLine = false;

//---------------------------------------------------HEADER---END------------------






}










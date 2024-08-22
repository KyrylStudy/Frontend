import { Component, ElementRef, EventEmitter, Input, Output,QueryList,Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Service } from '../../../shared/models/service';
import { NewDataStream } from '../../../shared/models/data_stream';
//import { EcuService } from '../../../services/ecu.service';
import { HardwareService } from '../../../services/hardware.service';
import { DataStream } from '../../../shared/models/data_stream';
import { LineCreationService } from '../../../services/data-stream.service';
import { Hardware } from '../../../shared/models/hardware';
import { ServiceService } from '../../../services/service.service';
import { ArchitectureService } from '../../../services/architecture.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  @Input() serviceData: any | null = null; 
  dataFromServicesDashbord: any = this;
  showDataStreamDialog: boolean = false;

  dataForServiceDialog = this;
  //showServiceDialog:boolean = false; 

  setSenderRecieverStylesOnDataStreams(){
    
    console.log(228)

    this.dataStreams.forEach((item, index)=>{
      const element = this.el.nativeElement.querySelector(`[dataStreamId="${item.id}"]`);
      //const element = document.querySelector(`[dataStreamId="${item.id}"]`);
      if(element)
      element.style.cssText += 'marker-start: url(#arrowhead)';
      /*if(element){
        const computedStyles = window.getComputedStyle(element);
        for (let i = 0; i < computedStyles.length; i++) {
          if(computedStyles[i] === 'stroke'){
           
          }
          console.log(`${computedStyles[i]}: ${computedStyles.getPropertyValue(computedStyles[i])}`);
      }
      }*/
      //console.log(element.style.stroke)
      //const nativeElement = this.lineElement.nativeElement;
      //this.renderer.setStyle(element, 'stroke', 'url(#reciever-sender)');

      //this.renderer.setAttribute(element, 'stroke', '!url(#reciever-sender)');

      //element.style.setProperty('stroke', 'url(#reciever-sender)', 'important');


      //element.style.stroke = "url(#reciever-sender)"
      //console.log(element.style.stroke)
      
      console.log(element)
    })
  }


  goBack(){ 
    this.serviceData.showService = false; 
    this.serviceData.dialogData.showHardwareDetailsDialogContent = true; 
  }


  openServiceDetailsDialog(service: Service){ 
    this.updateCurrentState();
    this.serviceService.setSelectedService(service)
  }


  constructor(private architectureService:ArchitectureService, private serviceService:ServiceService, private renderer: Renderer2, private el: ElementRef,
     private hardwareService: HardwareService, private lineCreationService: LineCreationService) { 
  }


  /*onDragEnded(event: any, ecu: Service): void {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getElementPosition(element.parentElement);

    ecu.positionX = boundingClientRect.x - parentPosition.left; 
    ecu.positionY = boundingClientRect.y - parentPosition.top;
  
  
    this.rewriteLine(ecu);
    this.lineCreationService.setDataStreams(this.dataStreams); 
 
  }


  private getElementPosition(element: any): { left: number, top: number } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }*/
 

  rewriteLine(service: Service) {
    const ecuDragging = this.el.nativeElement.querySelector(`[serviceId="${service.id}"]`);
    var ecuRect = ecuDragging.getBoundingClientRect();

    //const parentPosition = this.getElementPosition(ecuDragging.parentElement);
    var ParentEcuId:any;
    debugger
    this.servicesMap.forEach((value:any, key:any)=>{
      for(let i = 0; i < value.length; i++){
        if(value[i].id === service.id){
          ParentEcuId = key;
          console.log(ParentEcuId)
        }
        
      }
    })
    //debugger
    const parentEcu:any = document.getElementById(`drag-boundary-${ParentEcuId}`);
    const parentPosition = parentEcu.getBoundingClientRect();

    var positionX =  parentPosition.left;
    var positionY =  parentPosition.top;

    const workArea:any = document.getElementById("horisontal-wrapper");
    const workAreaPosition = workArea.getBoundingClientRect();

    var workAreaPositionX =  workAreaPosition.left;
    var workAreaPositionY =  workAreaPosition.top;


   // console.log("positionX ", positionX, " | ", ParentEcuId)
   // console.log("positionY ", positionY, " | ", ParentEcuId)
if(this.zoomLevel === 1){
  for (let i = 0; i < this.dataStreams.length; i++) {
    if (this.dataStreams[i].connectedFrom === service.id.toString()) {
      console.log(this.dataStreams[i])
        this.dataStreams[i].positionFromX = (service.positionX + (this.ServiceWidth / 2) + positionX - workAreaPositionX - 2).toString();
        this.dataStreams[i].positionFromY = (service.positionY + (this.ServiceHeight / 2) + positionY - workAreaPositionY - 5).toString();
    } else if (this.dataStreams[i].connectedTo === service.id.toString()) {
        this.dataStreams[i].positionToX = (service.positionX + (this.ServiceWidth / 2) + positionX - workAreaPositionX - 2).toString();
        this.dataStreams[i].positionToY = (service.positionY + (this.ServiceHeight / 2) + positionY - workAreaPositionY - 5).toString();
    }
  }
}else if(this.zoomLevel === 2){
  for (let i = 0; i < this.dataStreams.length; i++) {
    if (this.dataStreams[i].connectedFrom === service.id.toString()) {
        this.dataStreams[i].positionFromX = (service.positionX + (this.ServiceWidth / 2) + positionX - workAreaPositionX + (38)).toString();
        this.dataStreams[i].positionFromY = (service.positionY + (this.ServiceHeight / 2) + positionY - workAreaPositionY + (28)).toString();
    } else if (this.dataStreams[i].connectedTo === service.id.toString()) {
        this.dataStreams[i].positionToX = (service.positionX + (this.ServiceWidth / 2) + positionX - workAreaPositionX + (38)).toString();
        this.dataStreams[i].positionToY = (service.positionY + (this.ServiceHeight / 2) + positionY - workAreaPositionY + (28)).toString();
    }
  }
}   
}



handleDragMoved(event: any, item: any): void {
  this.setElementPosition(event, item);
  this.rewriteLine(item);
}

setElementPosition(event: any, ecu: Hardware): void {
  const element = event.source.getRootElement();
  
  
  const boundingClientRect = element.getBoundingClientRect();
  const parentPosition = this.getElementPosition(element.parentElement);

  ecu.positionX = (boundingClientRect.x - parentPosition.left);
  ecu.positionY = (boundingClientRect.y - parentPosition.top) ;


  //ecu.positionX = (event.pointerPosition.x );
 // ecu.positionY = (event.pointerPosition.y) ;
 /*var ParentEcuId:any;
 this.servicesMap.forEach((value:any, key:any)=>{
   for(let i = 0; i < value.length; i++){
     if(value[i].id === ecu.id){
       ParentEcuId = key;
     }
     
   }
 })
 const parentEcu:any = document.getElementById(`drag-boundary-${ParentEcuId}`);
 const parentPosition = parentEcu.getBoundingClientRect();

 var positionX =  parentPosition.left;
 var positionY =  parentPosition.top;
  

 const elementRect = event.source.element.nativeElement.getBoundingClientRect();

 let newX = (event.pointerPosition.x - positionX) / this.zoomLevel;
 let newY = (event.pointerPosition.y - positionY) / this.zoomLevel;
 console.log(newX)
 // Ensure the element stays within the boundaries
 newX = Math.max(0, Math.min(newX, parentEcu.width - elementRect.width / this.zoomLevel));
 newY = Math.max(0, Math.min(newY, parentEcu.height - elementRect.height / this.zoomLevel));

 ecu.positionX = newX;
 ecu.positionY = newY;*/

}


private getElementPosition(element: any): { left: number, top: number } {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

/*rewriteLine1(ecu: Service) {


      for (let i = 0; i < this.dataStreams.length; i++) {
          if (this.dataStreams[i].connectedFrom == ecu.id.toString()) {
              this.dataStreams[i].positionFromX = (ecu.positionX + (this.ServiceWidth / 2)).toString();
              this.dataStreams[i].positionFromY = (ecu.positionY + (this.ServiceHeight / 2)).toString();
          } else if (this.dataStreams[i].connectedTo == ecu.id.toString()) {
              this.dataStreams[i].positionToX = (ecu.positionX + (this.ServiceWidth / 2)).toString();
              this.dataStreams[i].positionToY = (ecu.positionY + (this.ServiceHeight / 2)).toString();
          }
      }
  }*/
//}


//---------------zoom-----------
zoomLevel: number = 1; // Initial zoom level

zoomIn() {
  if(this.zoomLevel === 1)
  this.zoomLevel += 1; // Increase zoom level 
  this.getDataStreams(this.selectedArchitecture.id);

}

zoomOut() {
  if(this.zoomLevel !== 1){
    this.zoomLevel -= 1; // Decrease zoom level, ensuring it doesn't go below 0.1
    this.getDataStreams(this.selectedArchitecture.id);
  }
    
   

}

selectedService: any | null = null;
subscribeOnSelectedService(){
  this.serviceService.selectedService$.subscribe(
      {
        next: data => {
          this.selectedService = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
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

selectedEcu: any | null = null;
subscribeOnSelectedHardware(){
  this.hardwareService.selectedHardware$.subscribe(
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

hardwares: any[] = [];
subscribeOnHardwares(){
  this.hardwareService.hardwares$.subscribe(
      {
        next: data => {
          this.hardwares = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}

/*checHardwaresOnConnection(firstHardwareId:string, secondHardwareId:string,){
  this.serviceData.dialogData.canReach(firstHardwareId, secondHardwareId);
}*/

servicesMap: any = new Map();
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

//servicesOfSelectedEcu: Service[] = [];
subscribeOnServicesOfSelectedEcu(){
  this.serviceService.services$.subscribe(
      {
        next: data => {
          this.servicesOfSelectedEcu = data;
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

ngOnInit(): void {

  this.subscribeOnDataStreams();

  this.subscribeOnSelectedService();

  this.subscribeOnSelectedArchitecture(); 

  this.subscribeOnServices();

  this.subscribeOnServicesOfSelectedEcu();
 
  this.subscribeOnSelectedHardware();
  this.subscribeOnHardwares();

  this.scrollableEcu.nativeElement.addEventListener('scroll', this.onElementScroll.bind(this));
  this.getDataStreams(this.selectedArchitecture.id)
  
  //this.setSenderRecieverStylesOnDataStreams()
}

@ViewChildren('line') lines!: QueryList<ElementRef>;


ngAfterViewInit() {
  console.log("228:           ", this.lines)
  this.setSenderRecieverStylesOnDataStreams();
  /*this.lines.forEach((lineElement, index) => {
    const line = lineElement.nativeElement;
    //const gradient = this.getGradientForLine(line.getAttribute('connectedFrom'), line.getAttribute('connectedTo'));
    this.renderer.setAttribute(line, 'stroke', 'url(#reciever-sender)');

    //const element = this.el.nativeElement.querySelector(`[dataStreamId="${item.id}"]`);
    //  console.log(element.style.stroke)
      //const nativeElement = this.lineElement.nativeElement;
      //this.renderer.setStyle(line, 'stroke', 'url(#reciever-sender)');


      //element.style.stroke = "url(#reciever-sender)"
      console.log(line.style.stroke)
      console.log(line)
  });*/
}

private getGradientForLine(connectedFrom: string, connectedTo: string): string {
  // Determine which gradient to use based on connectedFrom and connectedTo
  // For simplicity, assume sender-receiver if condition matches
  if (connectedFrom === 'sender' && connectedTo === 'receiver') {
    return 'url(#sender-reciever)';
  } else if (connectedFrom === 'receiver' && connectedTo === 'sender') {
    return 'url(#reciever-sender)';
  }
  return 'none'; // Default style if no gradient
}


/*ngAfterViewInit() {
  this.setSenderRecieverStylesOnDataStreams();
}*/

/*scrollableEcu:any;
ngAfterViewInit(){
  //@ViewChild('scrollableEcu', { static: true }) scrollableEcu!: ElementRef;
  this.scrollableEcu = @ViewChild('scrollableEcu', { static: true }): ElementRef;

}*/


private getDataStreams(architectureId: number){
  
  this.lineCreationService.getAllDataStreams(architectureId).subscribe({
      next: (data) => { 

        //debugger 
        if(this.selectedOption){
          this.getDataStreamsOfSelectdService(data); 
        }else{
          this.dataStreams = data;
          this.rewriteAllDataStreams();
        }
        this.lineCreationService.setDataStreams(this.dataStreams);
       // this.setSenderRecieverStylesOnDataStreams();
      },
      error: (error) => {
        // Handle the error here if needed
        console.error('Error geting Data Stream', error);
      }
    }
    
    
    /*data => {
    if(this.serviceData.selectedService){
      this.getDataStreamsOfSelectdService(data)
    }else{
      this.getAllDataStreams(data)
    }

  }*/);
}


//------------------------------create new line(data stream)
ServiceWidth = 40 + 4;//content + border 
ServiceHeight = 40 + 4 + 12; //content + border + lable with margin

//dataStreams: DataStream[] = [];

  startTargetEcuElementNewBus: any;
  endTargetEcuElementNewBus: any;
  startEcu: Service | null = null;
  endEcu: Service | null = null;
  startLinePsition: any;

  onEcuClick(ecu: Service, event: MouseEvent){ 
    //this.dataStreamsTransport.emit(this); 
    //console.log(this.creatingDatastreamModus)
    
    if(this.creatingDatastreamModus){
      if (!this.startEcu) {
        // First click, select start ECU
        this.startTargetEcuElementNewBus = event.target as HTMLElement;
        this.renderer.addClass(this.startTargetEcuElementNewBus, 'selected');
  
        //ecu.connectedTo = "777";
        this.startEcu = ecu;

        const ecuDragging: any = event.target as HTMLElement;

        var ecuRect = ecuDragging.getBoundingClientRect();
        this.startLinePsition = ecuRect;

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
          const ecuDragging: any = event.target as HTMLElement;

          var ecuRect = ecuDragging.getBoundingClientRect();

          const newDataStream: NewDataStream = {
          name: 'Data Stream ' + (this.dataStreams.length + 1),
          type: 'Data Stream',
          description: 'default description',
          positionFromX: (this.startLinePsition.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionFromY: (this.startLinePsition.top - ((this.ServiceHeight/2) / this.zoomLevel)).toString(),
          positionToX: (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionToY: (ecuRect.top - ((this.ServiceHeight/2) / this.zoomLevel)).toString(),
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), twoWayConnection: false};

          //this.serviceData.dataStreams[this.serviceData.dataStreams.length] = newDataStream

          this.lineCreationService.createDataStream(this.selectedArchitecture.id, newDataStream).subscribe(data =>{
            //this.dataStreams[this.dataStreams.length] = data
            this.getDataStreams(this.selectedArchitecture.id)
            //console.log(this.lines)
            //this.setValueToShare(this);
          });


  
          console.log('New line created:', newDataStream);
        } else {
          //ecu.connectedTo = ""; 
          console.log('Start and end ECUs cannot be the same');
        }
        // Reset start and end ECUs
        
        this.startEcu = null;
        this.endEcu = null;
        this.creatingDatastreamModus = false;
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

//-----------------------------onScroll

    @ViewChild('scrollableEcu', { static: true }) scrollableEcu!: ElementRef;
   //scrollableEcu: any = document.getElementById('myElement');



  previousScrollY: any = 0;
  onElementScroll(): void {
    
    const element = this.scrollableEcu.nativeElement;
    const scrollTop = element.scrollTop;
    

      for (let dataStream of this.dataStreams) {
        let adjustFromY = true;
        let adjustToY = true;
      
        for (let service of this.servicesOfSelectedEcu) {
          if (dataStream.connectedFrom == service.id.toString()) {
            adjustFromY = false;
          }
          if (dataStream.connectedTo == service.id.toString()) {
            adjustToY = false;
          }
        }
      
        //scroll for normal zoom
        if(this.zoomLevel === 1){
          if (adjustFromY) {
            dataStream.positionFromY = (Number(dataStream.positionFromY) - (scrollTop - this.previousScrollY)).toString();
          }
          
          if (adjustToY) {
            dataStream.positionToY = (Number(dataStream.positionToY) - (scrollTop - this.previousScrollY)).toString();
          }
          //scroll for zoom x2
        }else if(this.zoomLevel === 2){
          if (adjustFromY) {
            dataStream.positionFromY = (Number(dataStream.positionFromY) - 0.5*(scrollTop - this.previousScrollY)).toString();
          }
          
          if (adjustToY) {
            dataStream.positionToY = (Number(dataStream.positionToY) - 0.5*(scrollTop - this.previousScrollY)).toString();
          }
        }

      }

   
    this.previousScrollY = scrollTop

    this.lineCreationService.setDataStreams(this.dataStreams);

  
  }
//---------------------------------------------01.06

getLinesForServise(service: Service){
  //1. get all lines
  //2. filter under line.connectedFrom || line.connectedTo === service.id
}

updateCurrentState() {
  //debugger
  console.log(this.hardwares);
  for(let i = 0; i < this.hardwares.length; ++i){
    var servicesOfEcu = this.servicesMap.get(this.hardwares[i].id);
    console.log("services: ", servicesOfEcu);
    for(let j = 0; j < servicesOfEcu.length; j++){
        this.serviceService.updadeService(servicesOfEcu[j], servicesOfEcu[j].id, )
        //this.updateService(servicesOfEcu[j], servicesOfEcu[j].id);
    }
  }

  for(let i = 0; i < this.dataStreams.length; i++){
    this.updateDataStream(this.dataStreams[i], this.dataStreams[i].id)
  }
}

/*private updateService(Service: Service, id: BigInt){

  this.ecuService.updadeService(Service, id).subscribe();
}*/

private updateDataStream(DataStream: DataStream, id: BigInt){

  this.lineCreationService.updateDataStream(DataStream, id).subscribe();
}

//----------------------------17.06

showDropdown = false; 
servicesOfSelectedEcu: Service[] = [];
toggleDropdownServiceForShowDataStreams(): void { 
  this.updateCurrentState();
  this.servicesOfSelectedEcu = this.servicesMap.get(this.selectedEcu.id);
  this.showDropdown = !this.showDropdown;
}


options:any = [];
//selectedService: any = null;
selectedOption: any = null;
selectServiceForShowDataStreams(option: any): void {
  //debugger
  if(option){
    this.selectedOption = option;
    this.dataStreams = [];
    this.getDataStreams(this.selectedArchitecture.id);
  }else{
    this.selectedOption = null;
  }


 // this.getDataStreamsOfSelectdService(this.dataStreams)
  /*if (option.label === 'new Hardware') {

   this.showCreateHardwareDialog = option.label;

 } else if (option.label === 'new Connection') {
   this.showCreateHardwareDialog = option.label;
   this.creatingBusModus = true;
 } else if (option.label === 'new Architecture'){
   this.showCreateHardwareDialog = option.label;
   this.selectedOption = option;   
 } else {
   this.selectedOption = option;
 }*/
  console.log("segergergerg:    ",this.selectedOption)
 this.showDropdown = false; 

}

getDataStreamsOfSelectdService(allDataStreams: any){
    var selectedServiceDataStreams:any = [];
    var connectedServices: any = [];
   // console.log(this.selectedService)
    for(let i = 0; i < allDataStreams.length; i++){
      if(allDataStreams[i].connectedFrom == this.selectedOption.id){
        selectedServiceDataStreams.push(allDataStreams[i]);
        const service = this.el.nativeElement.querySelector(`[serviceId="${Number(allDataStreams[i].connectedTo)}"]`);
        connectedServices.push(service)
      }else if(allDataStreams[i].connectedTo == this.selectedOption.id){
        selectedServiceDataStreams.push(allDataStreams[i]);
        const service = this.el.nativeElement.querySelector(`[serviceId="${Number(allDataStreams[i].connectedFrom)}"]`);
        connectedServices.push(service)
      }
    }
    console.log("0000000000:  ", selectedServiceDataStreams);
    this.dataStreams = selectedServiceDataStreams;
    for(let i = 0; i < connectedServices.length; i++){
      this.rewriteLine(connectedServices[i])
    }
    this.rewriteLine(this.selectedOption)
  }


  rewriteAllDataStreams(){ 
    this.servicesMap.forEach((serviscesOfEcu: any, ecu: any)=>{
      for(let i = 0; i < serviscesOfEcu.length; i++){
        this.rewriteLine(serviscesOfEcu[i])
      }
    })
  }

  selectAllServices(){ 
    this.updateCurrentState();
    this.selectedService = null;
    this.selectedOption = null;
    this.getDataStreams(this.selectedArchitecture.id);
  }

  selectedDataStream: any; 

  openDataStreamDetails(dataStream: DataStream){//------------------------------add logic!!!
    this.updateCurrentState();
    this.selectedDataStream = dataStream;
    this.showDataStreamDialog = true;
    //this.serviceData.showService = false;
    //this.dataStreamsTransport.emit(this); 
  }

  //@Output() dataStreamsTransport = new EventEmitter<any>();


  /*close(): void {
    this.closeDialog.emit(true);
    console.log(this.serviceData.dialogData.dialogData)
    this.serviceData.selectedService = null;
  }*/

    /*onCloseCreateDialog(){
      this.showCreateServiceDialog = false;
    }*/
  
    showCreateServiceDialog: boolean = false;
    openCreateServiceDialog(){
      this.updateCurrentState();
      this.showCreateServiceDialog = true;
    }

    creatingDatastreamModus: Boolean = false;
    openCreateDatastreamDialog(){
      this.updateCurrentState();
      this.creatingDatastreamModus = true;
    }
  
}




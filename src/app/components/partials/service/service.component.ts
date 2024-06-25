import { Component, ElementRef, EventEmitter, Input, Output,QueryList,Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Service } from '../../../shared/models/service';
import { NewDataStream } from '../../../shared/models/data_stream';
import { EcuService } from '../../../services/ecu.service';
import { DataStream } from '../../../shared/models/data_stream';
import { LineCreationService } from '../../../services/header-main.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  @Input() serviceData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();
  dataForServiceDialog = this;
  showServiceDialog:boolean = false;

  openServiceDetailsDialog(service: Service){
    this.showServiceDialog = !this.showServiceDialog;
    //this.serviceData.showService = !this.serviceData.showService;
  }

  onCloseServiceDetailsDialog(){
    this.showServiceDialog = !this.showServiceDialog;
  }

  constructor(private renderer: Renderer2, private el: ElementRef, private ecuService: EcuService, private lineCreationService: LineCreationService) { 

    }

  close(): void {
    this.closeDialog.emit(true);
    console.log(this.serviceData.dialogData.dialogData)
    this.serviceData.selectedService = null;
  }


  onDragEnded(event: any, ecu: Service): void {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getElementPosition(element.parentElement);

    const ecuDragging: any = document.querySelector('.cdk-drag-dragging');

    var ecuRect = ecuDragging.getBoundingClientRect();

   // ecu.positionX = ecuRect.left//boundingClientRect.x - parentPosition.left;
    //ecu.positionY = ecuRect.top//boundingClientRect.y - parentPosition.top;

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

 // @ViewChildren('draggableItem') draggableItems: QueryList<ElementRef>;

  rewriteLine(ecu: Service) {
    //console.log(this.serviceData.dataStreams)
    //const ecuDragging: any = document.querySelector('.cdk-drag-dragging');
    const ecuDragging = this.el.nativeElement.querySelector(`[serviceId="${ecu.id}"]`);
    //const ecuDragging = this.el.nativeElement.querySelector(`#${ecu.id}`);
    //const ecuDragging = ecu as unknown as HTMLElement;
    //debugger
    //var scrollTop = window.scrollY;
    var ecuRect = ecuDragging.getBoundingClientRect();
    for(let i = 0; i < this.dataStreams.length; i++){
      if(this.dataStreams[i].connectedFrom == ecu.id.toString()){
        this.dataStreams[i].positionFromX = (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString();
        this.dataStreams[i].positionFromY = (ecuRect.top /*- ((this.serviceData.ECUheight/2) / this.zoomLevel)*/).toString();
      }else if(this.dataStreams[i].connectedTo == ecu.id.toString()){
        this.dataStreams[i].positionToX = (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString();
        this.dataStreams[i].positionToY = (ecuRect.top /*- ((this.serviceData.ECUheight/2) / this.zoomLevel)*/).toString();
      }
    }
}

//---------------zoom-----------
zoomLevel: number = 1; // Initial zoom level

zoomIn() {
  this.zoomLevel += 0.1; // Increase zoom level 
  this.getDataStreams(this.serviceData.dialogData.dialogData.selectedArchitecture.id);
  /*console.log(this.serviceData.selectedEcu.id)
  console.log(this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id))

  for(let i = 0; i < this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id).length; i++){
    this.rewriteLine(this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id)[i]);
  }*/

 // console.log(this.servicesMap) 
}

zoomOut() {
  if (this.zoomLevel > 0.1) {
    this.zoomLevel -= 0.1; // Decrease zoom level, ensuring it doesn't go below 0.1
    this.getDataStreams(this.serviceData.dialogData.dialogData.selectedArchitecture.id);
    /*for(let i = 0; i < this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id).length; i++){
      this.rewriteLine(this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id)[i]);
    }*/
  }
}

ngOnInit(): void {
 // this.el.nativeElement.querySelector(`[serviceId="${''}"]`);
 this.dataStreamsTransport.emit(this); 
 this.scrollableEcu.nativeElement.addEventListener('scroll', this.onElementScroll.bind(this));
  this.getDataStreams(this.serviceData.dialogData.dialogData.selectedArchitecture.id);
  this.options = this.serviceData.dialogData.dialogData.servicesMap.get(this.serviceData.dialogData.dialogData.selectedEcu.id);
}

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
          this.getDataStreamsOfSelectdService(data)
        }else{
          this.getAllDataStreams(data)
        } 
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
dataStreams: DataStream[] = [];

  startTargetEcuElementNewBus: any;
  endTargetEcuElementNewBus: any;
  startEcu: Service | null = null;
  endEcu: Service | null = null;
  startLinePsition: any;

  onEcuClick(ecu: Service, event: MouseEvent){ 
    this.dataStreamsTransport.emit(this); 
    console.log(this.serviceData.dialogData.dialogData.creatingDatastreamModus)
    if(this.serviceData.dialogData.dialogData.creatingDatastreamModus){
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
          name: 'Service ' + (this.dataStreams.length + 1),
          type: 'Service',
          description: 'default description',
          positionFromX: (this.startLinePsition.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionFromY: (this.startLinePsition.top - ((this.serviceData.dialogData.dialogData.ECUheight/2) / this.serviceData.dialogData.dialogData.zoomLevel)).toString(),
          positionToX: (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionToY: (ecuRect.top - ((this.serviceData.dialogData.dialogData.ECUheight/2) / this.serviceData.dialogData.dialogData.zoomLevel)).toString(),
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), twoWayConnection: false};

          //this.serviceData.dataStreams[this.serviceData.dataStreams.length] = newDataStream

          this.lineCreationService.createDataStream(this.serviceData.dialogData.dialogData.selectedArchitecture.id, newDataStream).subscribe(data =>{
            //this.dataStreams[this.dataStreams.length] = data
            this.getDataStreams(this.serviceData.dialogData.dialogData.selectedArchitecture.id)
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
        this.serviceData.dialogData.dialogData.creatingDatastreamModus = false;
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
      
        for (let service of this.serviceData.dialogData.dialogData.servicesMap.get(this.serviceData.dialogData.dialogData.selectedEcu.id)) {
          if (dataStream.connectedFrom == service.id) {
            adjustFromY = false;
          }
          if (dataStream.connectedTo == service.id) {
            adjustToY = false;
          }
        }
      
        if (adjustFromY) {
          dataStream.positionFromY = (Number(dataStream.positionFromY) - (scrollTop - this.previousScrollY)).toString();
        }
        
        if (adjustToY) {
          dataStream.positionToY = (Number(dataStream.positionToY) - (scrollTop - this.previousScrollY)).toString();
        }
      }

   
    this.previousScrollY = scrollTop

  
  }
//---------------------------------------------01.06

getLinesForServise(service: Service){
  //1. get all lines
  //2. filter under line.connectedFrom || line.connectedTo === service.id
}

saveServices() {
  //debugger
  console.log(this.serviceData.dialogData.dialogData.ecus);
  for(let i = 0; i < this.serviceData.dialogData.dialogData.ecus.length; ++i){
    var servicesOfEcu = this.serviceData.dialogData.dialogData.servicesMap.get(this.serviceData.dialogData.dialogData.ecus[i].id);
    console.log("services: ", servicesOfEcu);
    for(let j = 0; j < servicesOfEcu.length; j++){
        this.updateService(servicesOfEcu[j], servicesOfEcu[j].id);
    }
  }

  for(let i = 0; i < this.dataStreams.length; i++){
    this.updateDataStream(this.dataStreams[i], this.dataStreams[i].id)
  }
}

private updateService(Service: Service, id: BigInt){

  this.ecuService.updadeService(Service, id).subscribe();
}

private updateDataStream(DataStream: DataStream, id: BigInt){

  this.lineCreationService.updateDataStream(DataStream, id).subscribe();
}

//----------------------------17.06

showDropdown = false; 
toggleDropdownCreate(): void {
    this.showDropdown = !this.showDropdown;
}


options:any = [];
//selectedService: any = null;
selectedOption: any = null;
selectOption(option: any): void {
  if(option){
    this.serviceData.selectedService = option;
    //console.log( this.serviceData.selectedService)
    //debugger
    this.selectedOption = option;
    this.dataStreams = [];
    this.getDataStreams(this.serviceData.dialogData.dialogData.selectedArchitecture.id);
  }else{
    this.serviceData.selectedService = null;
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

 this.showDropdown = false; 

}

getDataStreamsOfSelectdService(allDataStreams: any){
    var selectedServiceDataStreams:any = [];
    var connectedServices: any = [];
   // console.log(this.selectedService)
    for(let i = 0; i < allDataStreams.length; i++){
      if(allDataStreams[i].connectedFrom == this.serviceData.selectedService.id){
        selectedServiceDataStreams.push(allDataStreams[i]);
        const service = this.el.nativeElement.querySelector(`[serviceId="${Number(allDataStreams[i].connectedTo)}"]`);
        connectedServices.push(service)
      }else if(allDataStreams[i].connectedTo == this.serviceData.selectedService.id){
        selectedServiceDataStreams.push(allDataStreams[i]);
        const service = this.el.nativeElement.querySelector(`[serviceId="${Number(allDataStreams[i].connectedFrom)}"]`);
        connectedServices.push(service)
      }
    }
    this.dataStreams = selectedServiceDataStreams;
    for(let i = 0; i < connectedServices.length; i++){
      this.rewriteLine(connectedServices[i])
    }
    this.rewriteLine(this.serviceData.selectedService)
  }


  getAllDataStreams(data: any){ 
    var selectedServiceDataStreams:any = [];
    var connectedServices: any = [];
    
    console.log(data)
    for(let i = 0; i < data.length; i++){
      selectedServiceDataStreams.push(data[i]);
        const service1 = this.el.nativeElement.querySelector(`[serviceId="${Number(data[i].connectedTo)}"]`);
        connectedServices.push(service1)
        const service2 = this.el.nativeElement.querySelector(`[serviceId="${Number(data[i].connectedFrom)}"]`);
        connectedServices.push(service2)
    }
    this.dataStreams = selectedServiceDataStreams;
    for(let i = 0; i < connectedServices.length; i++){ 
      this.rewriteLine(connectedServices[i])
    }
    //console.log(connectedServices) 
  }

  selectAllServices(){ 
    this.serviceData.selectedService = null;
    this.selectedOption = null;
    this.getDataStreams(this.serviceData.dialogData.selectedArchitecture.id);
  }

  selectedDataStream: any; 

  openDataStreamDetails(dataStream: DataStream){//------------------------------add logic!!!

    this.selectedDataStream = dataStream;
    this.serviceData.showDataStreamDialog = true;
    this.serviceData.showService = false;
    this.dataStreamsTransport.emit(this); 
  }

  @Output() dataStreamsTransport = new EventEmitter<any>();


  /*close(): void {
    this.closeDialog.emit(true);
    console.log(this.serviceData.dialogData.dialogData)
    this.serviceData.selectedService = null;
  }*/
  
}




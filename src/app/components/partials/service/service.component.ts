import { Component, ElementRef, EventEmitter, Input, Output,Renderer2, ViewChild } from '@angular/core';
import { Service } from '../../../shared/models/service';
import { NewLine } from '../../../shared/models/line';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  @Input() serviceData: any | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2) { 


  }

  close(): void {
    this.closeDialog.emit(true);
    console.log(this.serviceData)
  }


  onDragEnded(event: any, ecu: Service): void {
   /* const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getElementPosition(element.parentElement);

    const ecuDragging: any = document.querySelector('.cdk-drag-dragging');

    var ecuRect = ecuDragging.getBoundingClientRect();

   // ecu.positionX = ecuRect.left//boundingClientRect.x - parentPosition.left;
    //ecu.positionY = ecuRect.top//boundingClientRect.y - parentPosition.top;

    ecu.positionX = boundingClientRect.x - parentPosition.left;
    ecu.positionY = boundingClientRect.y - parentPosition.top;
  
  
    this.rewriteLine(ecu);*/
 
  }


  private getElementPosition(element: any): { left: number, top: number } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  rewriteLine(ecu: Service) {
    //console.log(this.serviceData.dataStreams)
    const ecuDragging: any = document.querySelector('.cdk-drag-dragging');
    //var scrollTop = window.scrollY;
    var ecuRect = ecuDragging.getBoundingClientRect();
    for(let i = 0; i < this.serviceData.dataStreams.length; i++){
      if(this.serviceData.dataStreams[i].connectedFrom == ecu.id.toString()){
        this.serviceData.dataStreams[i].positionFromX = (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString();
        this.serviceData.dataStreams[i].positionFromY = (ecuRect.top /*- ((this.serviceData.ECUheight/2) / this.zoomLevel)*/).toString();
      }else if(this.serviceData.dataStreams[i].connectedTo == ecu.id.toString()){
        this.serviceData.dataStreams[i].positionToX = (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString();
        this.serviceData.dataStreams[i].positionToY = (ecuRect.top /*- ((this.serviceData.ECUheight/2) / this.zoomLevel)*/).toString();
      }
    }
}

//---------------zoom-----------
zoomLevel: number = 1; // Initial zoom level

zoomIn() {
  this.zoomLevel += 0.1; // Increase zoom level 
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
    /*for(let i = 0; i < this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id).length; i++){
      this.rewriteLine(this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id)[i]);
    }*/
  }
}





//------------------------------create new line(data stream)
  

  startTargetEcuElementNewBus: any;
  endTargetEcuElementNewBus: any;
  startEcu: Service | null = null;
  endEcu: Service | null = null;
  startLinePsition: any;

  onEcuClick(ecu: Service, event: MouseEvent){
    console.log(this.serviceData.creatingDatastreamModus)
    if(this.serviceData.creatingDatastreamModus){
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

          const newLine: NewLine = {
          name: 'Bus ' + (this.serviceData.dataStreams.length + 1),
          type: 'Bus',
          description: 'default description',
          positionFromX: (this.startLinePsition.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionFromY: (this.startLinePsition.top - ((this.serviceData.ECUheight/2) / this.serviceData.zoomLevel)).toString(),
          positionToX: (ecuRect.left /*+ (this.serviceData.ECUwidth/2)*/).toString(),
          positionToY: (ecuRect.top - ((this.serviceData.ECUheight/2) / this.serviceData.zoomLevel)).toString(),
          connectedFrom: this.startEcu.id.toString(),
          connectedTo: this.endEcu.id.toString(), twoWayConnection: false};

          this.serviceData.dataStreams[this.serviceData.dataStreams.length] = newLine
  
          console.log('New line created:', newLine);
        } else {
          //ecu.connectedTo = "";
          console.log('Start and end ECUs cannot be the same');
        }
        // Reset start and end ECUs
        
        this.startEcu = null;
        this.endEcu = null;
        this.serviceData.creatingDatastreamModus = false;
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

    @ViewChild('scrollableEcu', { static: true })
  scrollableEcu!: ElementRef;

    ngOnInit(): void {
      this.scrollableEcu.nativeElement.addEventListener('scroll', this.onElementScroll.bind(this));
    }

  previousScrollY: any = 0;
  onElementScroll(): void {
    const element = this.scrollableEcu.nativeElement;
    const scrollTop = element.scrollTop;
    

      for (let dataStream of this.serviceData.dataStreams) {
        let adjustFromY = true;
        let adjustToY = true;
      
        for (let service of this.serviceData.servicesMap.get(this.serviceData.selectedEcu.id)) {
          if (dataStream.connectedFrom == service.id) {
            adjustFromY = false;
          }
          if (dataStream.connectedTo == service.id) {
            adjustToY = false;
          }
        }
      
        if (adjustFromY) {
          dataStream.positionFromY = Number(dataStream.positionFromY) - (scrollTop - this.previousScrollY);
        }
        
        if (adjustToY) {
          dataStream.positionToY = Number(dataStream.positionToY) - (scrollTop - this.previousScrollY);
        }
      }

   
    this.previousScrollY = scrollTop

  
  }
//---------------------------------------------01.06

getLinesForServise(service: Service){
  //1. get all lines
  //2. filter under line.connectedFrom || line.connectedTo === service.id
}
}

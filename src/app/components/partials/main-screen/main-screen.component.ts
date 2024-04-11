import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { Ecu } from '../../../shared/models/ecu';
import { Line } from '../../../shared/models/line';
import { EcuService } from '../../../services/ecu.service';
//import { HeaderComponent } from '../header/header.component';
//import { sample_lines } from '../../../../data'; // Import sample_lines from data.ts
import { LineCreationService } from '../../../services/header-main.service';



@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',

})
export class MainScreenComponent implements OnInit{

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

  constructor(private ecuService:EcuService, private lineCreationService: LineCreationService) { 
    this.ecus = ecuService.getAll();
    //this.lines = ecuService.getLines();

  }
  

  onDragEnded(event: any, ecu: Ecu): void {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getElementPosition(element.parentElement);

    ecu.position.x = boundingClientRect.x - parentPosition.left;
    ecu.position.y = boundingClientRect.y - parentPosition.top;
  
    this.rewriteLine(event, ecu);//удалить что бі посмотреть как создает новые линии
    console.log('x1 = ',  this.lineX1, 'Y1 = ', this.lineY1, 'x2 = ', this.lineX2, 'Y2 = ', this.lineY2)
 
  
  }

  private getElementPosition(element: any): { left: number, top: number } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }


 rewriteLine(event: any, ecu: Ecu) {
    const svgContainer = document.getElementById('svg-container');
    if (!svgContainer) {
        return;
    }

    const ecuElements = document.querySelectorAll('.draggable-item');
    const ecuArray = Array.from(ecuElements);

    //const ecuElements = document.querySelectorAll('.connestion-line');
    //const ecuArray = Array.from(ecuElements);

    // Clear the existing lines from the SVG container
    while (svgContainer.firstChild) {
        svgContainer.removeChild(svgContainer.firstChild);
    }

    // Re-add the lines based on the updated positions in the ecus array
    for (let i = 0; i < ecuArray.length - 1; i++) {
        const ecu1 = ecuArray[i];
        const ecu2 = ecuArray[i + 1];

        // Get the positions of the dragged elements
        const ecu1Rect = ecu1.getBoundingClientRect();
        const ecu2Rect = ecu2.getBoundingClientRect();

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.lineX1 = ecu1Rect.left + (this.ECUwidth/2);
        this.lineY1 = ecu1Rect.top - ((this.ECUheight/2) / this.zoomLevel);
        this.lineX2 = ecu2Rect.left + (this.ECUwidth/2);
        this.lineY2 = ecu2Rect.top - ((this.ECUheight/2) / this.zoomLevel);
        line.setAttribute('x1', (this.lineX1).toString());
        line.setAttribute('y1', (this.lineY1).toString());
        line.setAttribute('x2', (this.lineX2).toString());
        line.setAttribute('y2', (this.lineY2).toString());
 
        line.setAttribute('style', 'stroke: black; stroke-width: 2; cursor: pointer');

        svgContainer.appendChild(line);
    }
 }

 lineX1 = 0;
 lineY1 = 0;
 lineX2 = 0;
 lineY2 = 0;

  openSidebar(ecu: Ecu): void {
    this.selectedEcu = ecu;
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  getSoftwareDetails(ecu: Ecu): Array<{key: string, value: string}> {
    return Object.entries(ecu.software).map(([key, value]) => ({key, value}));
  }

  getHardwareDetails(ecu: Ecu): Array<{key: string, value: string}> {
    return Object.entries(ecu.hardware).map(([key, value]) => ({key, value}));
  }
//--------------------------------------------------------------------------------------13.03.2024
  zoomLevel: number = 1; // Initial zoom level

  zoomIn() {
    console.log(228)
    this.zoomLevel += 0.1; // Increase zoom level
    
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1; // Decrease zoom level, ensuring it doesn't go below 0.1
    }
  }

//------------------------------------------------------------------------------------------- 17.03.2024

// Variables to hold software and hardware input values
softwareKey: string = '';
softwareValue: string = '';
hardwareKey: string = '';
hardwareValue: string = '';

addSoftwareValue(): void {
  if (this.selectedEcu && this.softwareKey && this.softwareValue) {
    this.selectedEcu.software[this.softwareKey] = this.softwareValue;
    this.softwareKey = '';
    this.softwareValue = '';
  }
}

addHardwareValue(): void {
  if (this.selectedEcu && this.hardwareKey && this.hardwareValue) {
    this.selectedEcu.hardware[this.hardwareKey] = this.hardwareValue;
    this.hardwareKey = '';
    this.hardwareValue = '';
  }
}

//-----------------------24.03-------------------------------------------------------

showListOfServices(): void {
  this.servisecOfSelectedEcu = this.selectedEcu;
  this.selectedEcu = null;
  console.log(this.servisecOfSelectedEcu)
}

//----------------------01.04.--------------------------------------------------------02.04
creatingLine = false;

startEcu: Ecu | null = null;
endEcu: Ecu | null = null;

onEcuClick(ecu: Ecu): void {
  if (this.creatingLine) {
    if (!this.startEcu) {
      // First click, select start ECU
      this.startEcu = ecu;
      console.log('Selected start ECU:', this.startEcu);
    } else if (!this.endEcu) {
      // Second click, select end ECU and create line
      this.endEcu = ecu;
      console.log('Selected end ECU:', this.endEcu);
      if (this.startEcu !== this.endEcu) {
        // Ensure start and end ECUs are different
        const newLine: Line = {
          positionFrom: { x: this.startEcu.position.x, y: this.startEcu.position.y },
          positionTo: { x: this.endEcu.position.x, y: this.endEcu.position.y },
          connectedFrom: this.startEcu.id,
          connectedTo: this.endEcu.id
        };
        // Add new line to service
        this.ecuService.addNewLine(newLine);
        console.log('New line created:', newLine);
      } else {
        console.log('Start and end ECUs cannot be the same');
      }
      // Reset start and end ECUs
      this.startEcu = null;
      this.endEcu = null;
    }
    console.log('Creating a line between ECUs');
  } else {
    // Default ECU click handling logic
    console.log('Normal ECU click handling');
  }
}



  ngOnInit(): void{
    // Initialize positions if necessary
    this.ecus.forEach(ecu => {
      ecu.position = ecu.position || { x: 0, y: 0 };
    });

    // Fetch lines data from wherever it's stored (e.g., API call, local storage)
    this.lines = this.ecuService.getLines();


    //this.ecus = this.ecuService.getAll();
    //this.lines = this.ecuService.getLines();
    //--------------02.04-----------------------
    this.lineCreationService.creatingLine$.subscribe((value: boolean) => {
      this.creatingLine = value;
      if (this.creatingLine) {
        // Change background color or apply any other necessary styles
        document.body.style.backgroundColor = 'lightblue';
      } else {
        // Revert background color or styles if needed
        document.body.style.backgroundColor = 'white';
      }
    });
  }

}

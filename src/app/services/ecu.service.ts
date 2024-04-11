import { Injectable } from '@angular/core';
import { Ecu } from '../shared/models/ecu';
import { sample_ecu } from '../../data';
import { Line } from '../shared/models/line';
import { sample_lines } from '../../data';


@Injectable({
  providedIn: 'root'
})
export class EcuService {

 // private lines: Line[] = [];

  constructor() { }

  getAll():Ecu[]{
    return sample_ecu
  }

  addNewEcu(newEcu: Ecu): void {
    sample_ecu.push(newEcu);
  }

  updateEcu(updatedEcu: Ecu): void {
    const index = sample_ecu.findIndex(ecu => ecu.id === updatedEcu.id);
    if (index !== -1) {
      sample_ecu[index] = updatedEcu;
    }
  }

  //---------01.04.------------------
  getLines(): Line[] {
    return sample_lines;
  }

  setLines(lines: Line[]): void {
  //  this.lines = lines;
  }

  //-------02.04.---------ноч
  private createLineMode: boolean = false;
  // Getter for createLineMode
  getCreateLineMode(): boolean {
    return this.createLineMode;
  }

  // Setter for createLineMode
  setCreateLineMode(mode: boolean): void {
    this.createLineMode = mode;
  }

  // Function to add a new line
  addNewLine(line: Line): void {
    sample_lines.push(line);
  }

  // Function to clear create line mode
  clearCreateLineMode(): void {
    this.createLineMode = false;
  }

  // Function to update lines
 /* updateLines(updatedLines: any[]): void {
    this.lines = updatedLines;
  }*/
}

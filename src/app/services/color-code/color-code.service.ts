import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorCodeService {

  public colorsArray$: string[] = [
    '#0c5a9e', '#003b69', '#83d0f5', '#ff6600', '#FF944D', '#fbfbfb', '#ed677a', '#BA5060', '#caf583', '#a1d75a', '#f5d583', '#FAC643',
  ];

  get colorArray(): string[] {
    return this.colorsArray$;
  }

  constructor() { }

  generateRandomColor(t: number = 1): string {
    return `rgba(${this.generateIntInRange(0, 255)}, ${this.generateIntInRange(0, 255)}, ${this.generateIntInRange(0, 255)}, ${t})`;
  }

  pickColorFromArray(colorsArray: string[] = this.colorsArray$): string {
    return colorsArray[Math.round(Math.random() * (colorsArray.length - 1))];
  }

  generateIntInRange(max: number, min: number = 0): number {
    return Math.round((Math.random() * (max - min)) + min);
  }
}

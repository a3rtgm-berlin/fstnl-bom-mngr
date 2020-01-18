import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorCodeService {

  public colorsArray$: string[] = [
    '#0c5a9e', '#003b69', '#0591B5', '#0535B5', '#427CAE', '#093D6B', '#0F3252', '#032D52', '#1B1B38', '#0B4C85', '#08365E', '#0E61AB',
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

  createColorMapping(array: any[], key: string): object {
    let arr = typeof array[0] !== 'object' ? array : array.map(item => item[key]);
    const colorMapping = {};

    arr = arr.reduce((unqiues, item) => {
      return unqiues.includes(item) ? unqiues : [...unqiues, item];
    }, []);

    arr.forEach(item => {
      let color = this.pickColorFromArray();
      let unique = false;

      while (!unique) {
        if (Object.values(colorMapping).length >= (this.colorArray.length - 1) ||
          !Object.values(colorMapping).includes(color)) {
            colorMapping[item] = color;
            unique = true;
        } else {
          color = this.pickColorFromArray();
        }
      }
    });

    return colorMapping;
  }
}

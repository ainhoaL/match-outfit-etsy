import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

let nearestColor = require('nearest-color');

export interface Palette {
    colours: string[]
}

@Injectable()
export class ColourService {
    baseUrl: string = "https://www.colourlovers.com/api/palettes?format=json&jsonCallback=JSONP_CALLBACK";
    palettes: string[][];
    availableColours: string[];
    closestMatchingColour: (string) => string;

    constructor(private http: Http) {

    }

    getPalette(colour: string): Palette {
        if (this.palettes) {
            let closestColour = this.closestMatchingColour(colour);

            for (let i = 0; i < this.palettes.length; i++) {
                let palette = this.palettes[i];
                if (palette.indexOf(closestColour) !== -1) {
                    return {
                        colours: palette
                    }
                }
            }

            return { colours: [] };
        } else {
            return { colours: [] };
        }
        
    }

    getAvailableColours(): Observable<string[]> {
        return this.http.get('./assets/100colours.json')
            .map((response: any) => {
                this.palettes = JSON.parse(response._body);
                let colours = [].concat.apply([], this.palettes);

                this.availableColours = [];
                for(let i = 0; i < colours.length; i++) {
                    if(this.availableColours.indexOf(colours[i]) === -1) {
                        this.availableColours.push(colours[i]);
                    }
                }

                this.closestMatchingColour = nearestColor.from(this.availableColours);

                return this.availableColours;
            });
    }
}

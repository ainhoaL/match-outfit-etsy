import { Injectable } from '@angular/core';
import { Jsonp, Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

let nearestColor = require('nearest-color');

export interface Palette {
    colours: string[]
}

@Injectable()
export class ColourService {
    baseUrl: string = "https://www.colourlovers.com/api/palettes?format=json&jsonCallback=JSONP_CALLBACK";
    palettes: string[][];
    availableColours: string[];
    closestMatchingColour: (string) => any;

    constructor(private jsonp: Jsonp, private http: Http) {

    }

    getPalette(colour: string): Palette {
        // let queryUrl = this.baseUrl + "&hex=" + colours.toString();

        // return this.jsonp.get(queryUrl).map((response: any) => {
        //     let paletteResponse = response._body[0];
        //     return {
        //             id: paletteResponse ? paletteResponse.id : 0,
        //             name: paletteResponse ? paletteResponse.title : "",
        //             colours: paletteResponse ? paletteResponse.colors : []
        //         };
        // });

        let closestColour = this.closestMatchingColour(colour);
        
        for(let i = 0; i < this.palettes.length; i++) {
            let palette = this.palettes[i];
            if(palette.includes(closestColour)) {
                return {
                    colours: palette
                }
            }
        }

        return { colours: [] };
    }

    getAvailableColours(): Observable<string[]> {
        return this.http.get('../node_modules/nice-color-palettes/100.json')
            .map((response: any) => {
                this.palettes = JSON.parse(response._body);
                console.log(this.palettes);
                let colours = [].concat.apply([], this.palettes);

                this.availableColours = [];
                for(let i = 0; i < colours.length; i++) {
                    if(!this.availableColours.includes(colours[i])) {
                        this.availableColours.push(colours[i]);
                    }
                }

                this.closestMatchingColour = nearestColor.from(this.availableColours);

                return this.availableColours;
            });
    }
}

import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

export interface Palette {
    id: number,
    name: string,
    colours: string[]
} 

@Injectable()
export class ColourService {
    baseUrl: string = "http://www.colourlovers.com/api/palettes?format=json&jsonCallback=JSONP_CALLBACK";
    constructor(private jsonp: Jsonp) {

    }

    getPalette(colours: string[]): Observable<Palette> {
        let queryUrl = this.baseUrl + "&hex=" + colours.toString();
       
        return this.jsonp.get(queryUrl).map((response: any) => {
            let paletteResponse = response._body[0];
            return {
                    id: paletteResponse.id,
                    name: paletteResponse.title,
                    colours: paletteResponse.colors
                };
        });
    }
}
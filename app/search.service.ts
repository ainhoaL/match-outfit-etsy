import { Injectable } from '@angular/core';
import { Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// To run this get an etsy API key
var key = "kd6o1003r5c74jr6uikpe7j4";

@Injectable()
export class SearchService {
    baseUrl: string = "https://openapi.etsy.com/v2/listings/active.js?callback=JSONP_CALLBACK&api_key=" + key;
    constructor(private jsonp: Jsonp) {

    }

    getListings(type: string, colour: string, page: number): Observable<any> {
        let listingsByColour = this.baseUrl + "&color=" + colour + "&color_accuracy=20&includes=MainImage&tags=" + type + "&page=" + page;
        return this.jsonp.get(listingsByColour).map((response: Response) => {
            return response.json();
        });
    }
}
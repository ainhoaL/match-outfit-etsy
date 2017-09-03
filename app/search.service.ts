import { Injectable } from '@angular/core';
import { Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// To run this get an etsy API key
var key;

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
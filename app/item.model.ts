import { ColourService, Palette } from './Colour.service';
import { SearchService } from './Search.service';
import { Observable } from 'rxjs';

export let itemTypes = ["Earrings", "Necklace", "Dress", "Shoes", "Handbag"];

export class Item {
    listings: any;
    resultCount: number = 0;
    page: number = 1;

    constructor(public searchService: SearchService, private name: string, private type: string, public colour?: string) {
    }

    getListings(): Observable<any> {
        return this.searchService.getListings(this.type, this.colour, this.page).map((result) => {
            this.listings = result;
            this.resultCount = result.count;
            return this.listings;
        });
    }
}

import { ColourService, Palette } from './Colour.service';
import { SearchService } from './Search.service';
import { Observable } from 'rxjs';

export let itemTypes = ["Earrings", "Necklace", "Dress", "Shoes", "Handbag"];

const itemsPerPage = 25;

export class Item {
    listings: any = [];
    resultCount: number = 0;
    searchCompleted: boolean = true;
    nextPage: number = 1;

    constructor(public searchService: SearchService, private name: string, private type: string, public colour?: string) {
    }

    getListings(): Observable<any> {
        // Do not try to fetch next page if there is no next page (end of list) or
        // if we are already fetching a page - avoid fetching same page multiple times
        if (this.nextPage && this.searchCompleted) {
            this.searchCompleted = false;
            return this.searchService.getListings(this.type, this.colour, this.nextPage).map((result) => {
                this.searchCompleted = true;
                let nonSupplies = [];
                let results = result.results;

                for(let i=0; i < results.length; i++) {
                    // TODO: How to filter off things like shipping upgrades?
                    if(results[i].is_supply !== "true") {
                        nonSupplies.push(results[i]);
                    }
                }

                this.listings = this.listings.concat(nonSupplies);
                this.nextPage = result.pagination.next_page;
                this.resultCount = result.count;

                // Do we have enough items to fill a whole page?
                if (this.listings.length < itemsPerPage && this.nextPage) {
                    this.getListings().subscribe(() => {}); //Retry to get more
                } else {
                    return this.listings;
                }
            });       
            // TODO: handle error case
        }
    }
}
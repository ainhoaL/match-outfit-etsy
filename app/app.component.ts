import { Component } from '@angular/core';
import { ColourService, Palette } from './colour.service';
import { SearchService } from './search.service';
import { Item, itemTypes } from './item.model';

@Component({
  selector: 'my-app',
  providers: [ColourService, SearchService],
  template: `
  <h1>Etsy outfit browser by colour palette</h1>
  <input [(ngModel)]="colourToMatch" placeholder="name">
  <button (click)="getItems()">Get items</button>
  <div class="itemRow" *ngFor="let item of items">
    <span>
        <div style="display: inline-block; width: 20px; height: 20px" [ngStyle]="{'background-color': item.colour}"></div> 
        {{item.name}}
        <span *ngIf="item.listings"> - {{item.resultCount}} found</span>
    </span>
    <div *ngIf="!item.listings">Loading...</div>
    <div *ngIf="item.listings" class="listingsRow">
        <span *ngFor="let listing of item.listings.results">
            <a href="{{listing.url}}">
                <img style="display: inline" src={{listing.MainImage.url_75x75}} title={{listing.title}}/>
            </a>
        </span>
    </div>
  </div>
  `
})
export class AppComponent { 
    palette: Palette = null;
    items: Item[] = [];
    colourToMatch: string = "00FF33";

    constructor(private colourService: ColourService, private searchService: SearchService) {
    }

    getItems() {
        this.colourService.getPalette([this.colourToMatch])
        .subscribe(
            (palette: Palette) => {
                this.palette = palette;

                itemTypes.forEach((type) => {
                    let item = new Item(this.searchService, type, type);
                    this.items.push(item);
                });

                let i = 0;
                this.palette.colours.forEach(colour => {
                    this.items[i].colour = colour;
                    this.items[i].getListings().subscribe((results) => {
                        // TODO: do we need to do anything here? 
                    });
                    i++;
                });
            },
            (error) => {
                console.error(error); // TODO: show an error?
            }
        );
    }
}

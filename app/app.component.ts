import { Component } from '@angular/core';
import { ColourService, Palette } from './colour.service';
import { SearchService } from './search.service';
import { Item, ItemFactory, itemTypes } from './item.model';

let leftArrow = require('../images/left-arrow.png');
let rightArrow = require('../images/right-arrow.png');

const itemsPerPage = 25;

@Component({
  selector: 'my-app',
  providers: [ColourService, SearchService, ItemFactory],
  template: `
  <h3>Browse Etsy items by colour palette - <i>Match your outfit by palette</i></h3>

  <div>
  Enter a colour in your palette: <input [(ngModel)]="colourToMatch" placeholder="name" (keyup.enter)="getItems()" />
  <input [(colorPicker)]="colourToMatch" [style.background]="colourToMatch" [value]="colourToMatch" [cpPresetColors]="availableColours" />
  <button (click)="getItems()">Get items</button>
  </div>
  <div class="itemRow" *ngFor="let item of items">
    <span>
        <div style="display: inline-block; width: 20px; height: 20px" [ngStyle]="{'background-color': item.colour}"></div>
        {{item.name}}
        <span *ngIf="!item.searchCompleted"> - Loading...</span>
        <span *ngIf="item.searchCompleted && item.listings.length === 0"> - No items found</span>
    </span>
    <div class="listingsRow">
        <button *ngIf="canScroll(item)" (click)="scrollDiv('left', item.name)" class="arrowButton leftButton"><img src="${leftArrow}" /></button>
        <div id="{{item.name}}" class="listings"
                infinite-scroll
                [infiniteScrollDistance]="2"
                [infiniteScrollThrottle]="300"
                [scrollWindow]="false"
                [horizontal]="true"
                (scrolled)="nextPage(item)">
                <span *ngFor="let listing of item.listings">
                    <a href="{{listing.url}}" target="blank" class="itemIcon"><img src={{listing.MainImage.url_75x75}} title={{listing.title}}/></a>
                </span>
            </div>
        <button *ngIf="canScroll(item)" (click)="scrollDiv('right', item.name)" class="arrowButton rightButton"><img src="${rightArrow}" /></button>
    </div>
  </div>
  `
})
export class AppComponent {
    palette: Palette = null;
    items: Item[] = []
    colourToMatch: string = "#00FF33";
    color: string = '#00FF33';
    availableColours: string[];

    constructor(private colourService: ColourService, private searchService: SearchService, private itemFactory: ItemFactory) {
        this.colourService.getAvailableColours().subscribe((colours: string[]) => {
            this.availableColours = colours.slice(0, 24);
        });
    }

    getItems() {
        this.items = [];
        let palette = this.colourService.getPalette(this.colourToMatch);
        console.log(" PALETTE ", palette);
        if (palette.colours.length > 0) {
            this.palette = palette;

            let i = 0;
            this.palette.colours.forEach(colour => {
                
                colour = colour.replace('#','');
                console.log(colour);
                let item = this.itemFactory.create(this.searchService, itemTypes[i], itemTypes[i], colour, itemsPerPage);

                this.items.push(item);
                this.getListingsForItem(this.items[i]);
                i++;
            });
        } else {
            console.log("no palette found"); // TODO: show message
        }
    }

    nextPage(item: Item) {
        this.getListingsForItem(item);
    }

    scrollDiv(direction: string, id: string) {
        let div = document.getElementById(id);

        let scrollingLength = 75 * 3; // 75 pixels is the image width
        if (direction === "left" && div.scrollLeft > 0) {
            div.scrollLeft -= scrollingLength;
        }
        if (direction === "right") {
            div.scrollLeft += scrollingLength;
        }
    }

    getListingsForItem(item: Item) {
        item.getListings();
    }

    canScroll(item:Item): boolean {
        // TODO: calculate if it fits on screen instead
        if (item.listings.length > itemsPerPage) {
            return true;
        } else {
            return false;
        }
    }
}

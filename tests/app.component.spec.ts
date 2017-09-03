var chai = require('chai');
var expect = chai.expect;

import { TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppComponent } from '../app/app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs';

import { ColourService, Palette } from '../app/colour.service';
import { SearchService } from '../app/search.service';
import { itemTypes, ItemFactory } from '../app/item.model';

export const ButtonClickEvents = {
   left:  { button: 0 },
   right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

let paletteResponse: Palette = {
		colours: ["#336666", "#003333", "#339966", "#33CC66", "#00FF33"]
	};
let availableColoursResponse = ["#336666", "#003333", "#339966"];

let colourServiceStub, searchServiceStub, colourService, searchService, itemFactory, itemModelStub;
let getPaletteSpy, createItemSpy, getListingsSpies, getAvailableColoursSpy;
let listingsResponse, listingsObservable;

function createListings(numberOfListings: number) {
	listingsResponse = [];

	for(let i = 0; i < numberOfListings; i++) {
		listingsResponse.push({
			url: "fakeurl" + i,
			title: "fakeListing" + i,
			MainImage: {
				url_75x75: "img/fakeimageurl" + i + ".png"
			}
		});
	}
}

class ItemModelStub {
	public listings;

	constructor(service, public name, public type, public colour) {
	}

	getListings() {
		this.listings = listingsResponse;
		return Observable.of(listingsResponse);
	}
}

describe('App', () => {
	let fixture;
	let element, de, component;

	beforeEach(() => {
		getListingsSpies = [];

		colourServiceStub = {
			getPalette() {
				return Observable.of(paletteResponse);
			}
		};
		searchServiceStub = {
			getListings() {
				return Observable.of([]);
			}
		};

		itemModelStub = {

		}

		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [ FormsModule, JsonpModule, HttpModule ],
			providers: [ColourService, SearchService, ItemFactory],
			schemas: [ NO_ERRORS_SCHEMA ]
			// Why doesn't this work? It would be nice to stub them out, then maybe we don't need to import Http and Jsonp modules
			/* providers: [
				{provide: ColourService, useValue: colourServiceStub },
				{provide: SearchService, useValue: searchServiceStub }
			] */
		});

		fixture = TestBed.createComponent(AppComponent);

		colourService = fixture.debugElement.injector.get(ColourService);
		searchService = fixture.debugElement.injector.get(SearchService);
		itemFactory = fixture.debugElement.injector.get(ItemFactory)

		getPaletteSpy = spyOn(colourService, 'getPalette').and.returnValue(paletteResponse);
		getAvailableColoursSpy = spyOn(colourService, 'getAvailableColours').and.returnValue(Observable.of(availableColoursResponse));
		createItemSpy = spyOn(itemFactory, 'create').and.callFake(function(service, name, type, colour?, itemsPerPage?) {
			let itemStub = new ItemModelStub(service, name, type, colour);
			getListingsSpies.push(spyOn(itemStub, 'getListings').and.callThrough());
			return itemStub;
		});

		component = fixture.componentInstance;
	});

	it('creates the component', () => {
		expect(component instanceof AppComponent).to.equal(true, 'should create AppComponent');
	});

	describe('before search', () => {
		it('has no items displayed', () => {
			element = fixture.debugElement.nativeElement;
    		expect(element.querySelectorAll('.itemRow').length).to.equal(0, 'there should be no items');
		});
	});

	describe('search', () => {
		let testColour: string = '00FFAA';
		createListings(2);

		beforeEach(() => {
			fixture.detectChanges();

			element = fixture.debugElement.nativeElement;

			let colourInput = element.querySelector('input');
			colourInput.value = testColour;
			colourInput.dispatchEvent(new Event('input'));

			let searchButton = element.querySelector('button');
			searchButton.click();
			fixture.detectChanges();
		});
		it('sends right colour to colour service', () => {
			let callArgs = getPaletteSpy.calls.first().args[0];
			expect(callArgs).to.equal(testColour);
		});
		it('gets items to the component', () => {
			expect(component.items.length).to.equal(itemTypes.length);
		});
		it('displays the item types', () => {
			let itemDivs = element.querySelectorAll('.itemRow');
    		expect(itemDivs.length).to.equal(itemTypes.length, 'there should be 5 items');
		});
		it('gets listings once per item type', () => {
			expect(getListingsSpies.length).to.equal(itemTypes.length);
			expect(getListingsSpies[0].calls.count()).to.equal(1);
		});
		it('displays the listings per item type', () => {
			let listingsDiv = element.querySelectorAll('.listingsRow');
			expect(listingsDiv.length).to.equal(itemTypes.length, 'there should be listings for 5 items');

      for(let i = 0; i < listingsDiv.length; i++) {
        let elements = listingsDiv[i].querySelectorAll('span');
        expect(elements.length).to.equal(listingsResponse.length, 'there should be 2 listings');
      }
		});
		it('displays listings with correct image and link', () => {
			let listingsDiv = element.querySelector('.listings');
			let listingLink = listingsDiv.querySelector('.itemIcon');

			expect(listingLink.getAttribute("href")).to.equal("fakeurl0");

			let img = listingsDiv.querySelector('img');
			expect(img.getAttribute("src")).to.equal("img/fakeimageurl0.png");
			expect(img.getAttribute("title")).to.equal("fakeListing0");
		});
	});

	describe('paging', () => {
		let testColour: string = '00FFAA';

		createListings(50);

		beforeEach(() => {
			fixture.detectChanges();

			element = fixture.debugElement.nativeElement;

			let colourInput = element.querySelector('input');
			colourInput.value = testColour;
			colourInput.dispatchEvent(new Event('input'));

			let searchButton = element.querySelector('button');
			searchButton.click();
			fixture.detectChanges();

			getListingsSpies[0].calls.reset();

			component.nextPage(component.items[0]);
		});

		it('gets next set of listings when requesting next page', () => {
			expect(getListingsSpies[0].calls.count()).to.equal(1); // the initial calls + the next page call
		});

	});

	describe('scrolling', () => {
		let testColour: string = '00FFAA';
		let scollingSpy;

		beforeEach(() => {
			scollingSpy = spyOn(component, 'scrollDiv').and.callThrough();
		});

		describe('when there are enough listings to scroll', () => {
			let rightArrow, leftArrow;

			beforeEach(() => {
				createListings(30);

				fixture.detectChanges();

				element = fixture.debugElement.nativeElement;

				let colourInput = element.querySelector('input');
				colourInput.value = testColour;
				colourInput.dispatchEvent(new Event('input'));

				let searchButton = element.querySelector('button');
				searchButton.click();
				fixture.detectChanges();

				let listingsDiv = element.querySelectorAll('.listingsRow');
				let parentDiv = listingsDiv[0];

				rightArrow = parentDiv.querySelector('.rightButton');
				leftArrow = parentDiv.querySelector('.leftButton');

			});

			it('scrolling is enabled', () => {
				expect(component.canScroll(component.items[0])).to.be.true;
			});

			it('scrolls right when clicking right arrow', () => {

				rightArrow.click();
				fixture.detectChanges();

				expect(scollingSpy.calls.first().args).to.deep.equal(["right", itemTypes[0]]);
			});

			it('scrolls left when clicking left arrow', () => {

				leftArrow.click();
				fixture.detectChanges();

				expect(scollingSpy.calls.first().args).to.deep.equal(["left", itemTypes[0]]);
			});
		});

		describe('when there are not enough listings to scroll', () => {

			beforeEach(() => {
				createListings(2);

				fixture.detectChanges();

				element = fixture.debugElement.nativeElement;

				let colourInput = element.querySelector('input');
				colourInput.value = testColour;
				colourInput.dispatchEvent(new Event('input'));

				let searchButton = element.querySelector('button');
				searchButton.click();
				fixture.detectChanges();
			});

			it('scrolling is disabled', () => {
				expect(component.canScroll(component.items[0])).to.be.false;
			});
		});
	});

});

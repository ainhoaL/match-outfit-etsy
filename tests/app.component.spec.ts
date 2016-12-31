var chai = require('chai');
var expect = chai.expect;

import { TestBed } from '@angular/core/testing';
import { DebugElement }    from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppComponent } from '../app/app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs';

import { ColourService, Palette } from '../app/colour.service';
import { SearchService } from '../app/search.service';
import { itemTypes } from '../app/item.model';

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
		colours: ["336666", "003333", "339966", "33CC66", "00FF33"],
		id: 1,
		name: "seaside margaritas."};

let listingsResponse = {
	count: 2,
	results: [{
		url: "fakeurl",
		title: "fakeListing",
		MainImage: {
			url_75x75: "fakeimageurl"
		}
	}, {
		url: "fakeurl2",
		title: "fakeListing2",
		MainImage: {
			url_75x75: "fakeimageurl2"
		}
	}]
};

let colourServiceStub, searchServiceStub, colourService, searchService;
let getPaletteSpy, getListingsSpy;

describe('App', () => {
	let fixture;
	let element, de, component;

	beforeEach(() => {

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

		TestBed.configureTestingModule({ 
			declarations: [AppComponent], 
			imports: [ FormsModule, JsonpModule ],
			providers: [ColourService, SearchService]
			// Why doesn't this work? It would be nice to stub them out, then maybe we don't need to import Http and Jsonp modules
			/* providers: [
				{provide: ColourService, useValue: colourServiceStub },
				{provide: SearchService, useValue: searchServiceStub }
			] */
		});

		fixture = TestBed.createComponent(AppComponent);

		colourService = fixture.debugElement.injector.get(ColourService);
		searchService = fixture.debugElement.injector.get(SearchService);

		getPaletteSpy = spyOn(colourService, 'getPalette').and.returnValue(Observable.of(paletteResponse));
		getListingsSpy = spyOn(searchService, 'getListings').and.returnValue(Observable.of(listingsResponse));

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
			expect(callArgs).to.deep.equal([testColour]);
		});
		it('gets items to the component', () => {
			expect(component.items.length).to.equal(itemTypes.length);
		});
		it('displays the item types', () => {
			let itemDivs = element.querySelectorAll('.itemRow');
    		expect(itemDivs.length).to.equal(itemTypes.length, 'there should be 5 items');
		});
		it('gets listings once per item type', () => {
			expect(getListingsSpy.calls.count()).to.equal(itemTypes.length);
		});
		it('displays the listings per item type', () => {
			let listingsDiv = element.querySelectorAll('.listingsRow');
			expect(listingsDiv.length).to.equal(itemTypes.length, 'there should be listings for 5 items');

			listingsDiv.forEach((div) => {
				let elements = div.querySelectorAll('span');
				expect(elements.length).to.equal(listingsResponse.results.length, 'there should be 2 listings');
			});
		});
		it('displays listings with correct image and link', () => {
			let listingsDiv = element.querySelector('.listingsRow');
			let listingLink = listingsDiv.querySelector('a');
			
			expect(listingLink.getAttribute("href")).to.equal("fakeurl");

			let img = listingsDiv.querySelector('img');
			expect(img.getAttribute("src")).to.equal("fakeimageurl");
			expect(img.getAttribute("title")).to.equal("fakeListing");
		});
	});
	
});

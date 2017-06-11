var chai = require('chai');
var expect = chai.expect;

import { TestBed } from '@angular/core/testing';
import { Item, ItemFactory } from '../app/item.model';
import { Observable } from 'rxjs';
import { SearchService } from '../app/search.service';

describe('Item Model', () => {
    let itemFactory: ItemFactory;
    let item: Item;
    let getListingsSpy;

    let searchResponse = {
        pagination: {
            next_page: 2
        },
        results: [{
            url: "fakeurl",
            title: "fakeListing",
            is_supply: "true",
            MainImage: {
                url_75x75: "fakeimageurl"
            }
        }, {
            url: "fakeurl2",
            title: "fakeListing2",
            is_supply: "false",
            MainImage: {
                url_75x75: "fakeimageurl2"
            }
        }, {
            url: "fakeurl3",
            title: "fakeListing3",
            is_supply: "false"
        }]
    }

    let fakeSearchService: SearchService = <any> {
        getListings: () => {
            return Observable.of(searchResponse);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({providers: [ItemFactory]});

        itemFactory = TestBed.get(ItemFactory);

        getListingsSpy = spyOn(fakeSearchService, 'getListings').and.callThrough();
	});

    describe('when creating an item using the item factory', () => {

        it('is a valid item model', () => {
            item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033');

            expect(item.name).to.equal('name1');
            expect(item.type).to.equal('type1');
            expect(item.colour).to.equal('FF0033');
            expect(item.itemsPerPage).to.equal(25);

        });
    });

    describe('#getListings', () => {

        describe('when there is a page to fetch', () => {
            beforeEach(() => {
                item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033', 1);
                expect(item.itemsPerPage).to.equal(1);

                item.getListings();
            });

            it('gets page from search service', () => {
                expect(getListingsSpy.calls.first().args).to.deep.equal(['type1', 'FF0033', 1]);
            });

            it('sets correct next page', () => {
                expect(item.nextPage).to.equal(2);
            });

            it('returns correct listings (not supplies)', () => {
                expect(item.listings.length).to.equal(1);
                expect(item.listings[0].title).to.equal("fakeListing2");
            });

            it('marks search as completed', () => {
                expect(item.searchCompleted).to.equal(true);
            });
        });

        describe('#retry - after processing there are not enough listings to fill a view page', () => {

            describe('there are no more results, this is the last page', () => {
                beforeEach(() => {
                    item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033', 2); // Need 2 listings per page but these results only have 1 non supply
                    expect(item.itemsPerPage).to.equal(2);

                    searchResponse.pagination.next_page = null;

                    item.getListings();
                });

                it('does not fetch a page from the search service', () => {
                    expect(getListingsSpy.calls.count()).to.equal(1); // 1st call - no retries

                    expect(item.listings.length).to.equal(1); // Still only have 1 listing
                });
            });

            describe('there are more pages', () => {
                beforeEach(() => {
                    item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033', 2); // Need 2 listings per page but these results only have 1 non supply
                    expect(item.itemsPerPage).to.equal(2);

                    searchResponse.pagination.next_page = 2;

                    item.getListings();
                });

                it('fetches next page from the search service', () => {
                    expect(getListingsSpy.calls.count()).to.equal(2); // 1st call + retry

                    expect(item.listings.length).to.equal(2);
                    expect(item.listings[0].title).to.equal("fakeListing2");
                    expect(item.listings[1].title).to.equal("fakeListing2");
                });
            });
        });

        describe('when there is no page to fetch', () => {
            beforeEach(() => {
                item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033', 1);
                expect(item.itemsPerPage).to.equal(1);

                item.nextPage = null;

                item.getListings();
            });

            it('does notfetch a page from the search service', () => {
                expect(getListingsSpy.calls.count()).to.equal(0);
                expect(item.listings.length).to.equal(0);
            });
        });

        describe('when there is a search in process', () => {
            beforeEach(() => {
                item = itemFactory.create(fakeSearchService, 'name1', 'type1', 'FF0033', 1);
                expect(item.itemsPerPage).to.equal(1);

                item.searchCompleted = false;

                item.getListings();
            });

            it('does notfetch a page from the search service', () => {
                expect(getListingsSpy.calls.count()).to.equal(0);
                expect(item.listings.length).to.equal(0);
            });
        });
    });

});

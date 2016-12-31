var chai = require('chai');
var expect = chai.expect;

import {
    JsonpModule,
    Jsonp,
    BaseRequestOptions,
    Response,
    ResponseOptions
} from "@angular/http";
import { TestBed } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import { SearchService } from '../app/search.service';

let fakeResponse = {
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

describe('Colour Service', () => {
    let backend: MockBackend;
    let service: SearchService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [JsonpModule],
            providers: [
                SearchService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Jsonp,
                    useFactory: (backend, options) => new Jsonp(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });

        backend = TestBed.get(MockBackend); 

        service = TestBed.get(SearchService);
        service.baseUrl = "fakeUrl";

	});

    describe("search one colour and type", () => {    
        let colour = "336666";
        let type = "earrings";
        describe("success", () => {
            it("returns one palette correctly formatted", () => {
                backend.connections.subscribe(connection => {
                    expect(connection.request.url).to.equal("fakeUrl&color=" + colour + "&color_accuracy=30&includes=MainImage&tags=" + type);
                    connection.mockRespond(new Response(<any>{
                        body: fakeResponse
                    }));
                });

                service.getListings(type, colour, 1).subscribe(results => {
                    // For now we are not transforming results
                    expect(results).to.deep.equal(fakeResponse);
                });
            });
        });

        // TODO: test error handling
        xdescribe("error", () => {
            it("sends errors", () => {
                backend.connections.subscribe(connection => {
                    connection.mockError(new Response(<any>{body: "error!"}));
                });
            });
        });
    });
});
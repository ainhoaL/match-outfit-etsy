var chai = require('chai');
var expect = chai.expect;

import {
    JsonpModule,
    Jsonp,
    BaseRequestOptions,
    Response
} from "@angular/http";
import { TestBed } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import { ColourService, Palette } from '../app/colour.service';

let fakeResponse = [{
        colors: ["336666", "003333", "339966", "33CC66", "00FF33"],
        id: 1,
        title: "fake palette name"
    }, {
        colors: ["332266", "00FF55", "77AA88", "118899", "776622"],
        id: 2,
        title: "second palette"
    }];

let expectedPalette: Palette = {
		colours: ["336666", "003333", "339966", "33CC66", "00FF33"],
		id: 1,
		name: "fake palette name"};

describe('Colour Service', () => {
    let backend: MockBackend;
    let service: ColourService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [JsonpModule],
            providers: [
                ColourService,
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

        service = TestBed.get(ColourService);
        service.baseUrl = "fakeUrl";

	});

    describe("search one colour", () => {    
        describe("success", () => {
            it("returns one palette correctly formatted", () => {
                backend.connections.subscribe(connection => {
                    expect(connection.request.url).to.equal("fakeUrl&hex=336666");
                    connection.mockRespond(new Response(<any>{
                        body: fakeResponse
                    }));
                });

                service.getPalette(["336666"]).subscribe((palette: Palette) => {
                    expect(palette).to.deep.equal(expectedPalette);
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

    describe("search multiple colours", () => {    
            it("returns one palette correctly formatted", () => {
                backend.connections.subscribe(connection => {
                    expect(connection.request.url).to.equal("fakeUrl&hex=336666,003333,00FF33");
                    connection.mockRespond(new Response(<any>{
                        body: fakeResponse
                    }));
                });

                service.getPalette(["336666", "003333", "00FF33"]).subscribe((palette: Palette) => {
                    expect(palette).to.deep.equal(expectedPalette);
                });
            });
    });
});
var chai = require('chai');
var expect = chai.expect;

import {
    HttpModule,
    Http,
    BaseRequestOptions,
    Response
} from "@angular/http";
import { TestBed } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import { ColourService, Palette } from '../app/colour.service';

let nearestColor = require('nearest-color');

let fakeResponse = '[["#889977", "#003333", "#339966", "#33CC66", "#00FF33"], ["#339966", "#00FF55", "#77AA88", "#118899", "#776622"]]';

let expectedPalette: Palette = {
		colours: ["#889977", "#003333", "#339966", "#33CC66", "#00FF33"]
    };

let fakePalettes: string[][] = [
    ["#889977", "#003333", "#339966", "#33CC66", "#00FF33"],
    ["#332266", "#00FF55", "#77AA88", "#118899", "#776622"]
]
let fakeMatchingColour = "#889977";
let fakeMatchingFunction = (colour: string): string => {
    return fakeMatchingColour;
}

let expectedAvailableColours = ["#889977", "#003333", "#339966", "#33CC66", "#00FF33", "#00FF55", "#77AA88", "#118899", "#776622"];

describe('Colour Service', () => {
    let backend: MockBackend;
    let service: ColourService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ColourService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });

        backend = TestBed.get(MockBackend); 

        service = TestBed.get(ColourService);
        service.baseUrl = "fakeUrl";
        service.closestMatchingColour = fakeMatchingFunction;
	});

    describe("#getPalette", () => {
        beforeEach(() => {
            service.palettes = fakePalettes;
        });

        describe("success", () => {

            describe('when the closest matching color exists in the palette', () => {
                beforeEach(() => {
                    fakeMatchingColour = "#889977";
                });

                it("returns one palette correctly formatted", () => {
                    backend.connections.subscribe(connection => {
                        expect(connection.request.url).to.equal("nice-color-palettes/100.json");
                        connection.mockRespond(new Response(<any>{
                            _body: fakeResponse
                        }));
                    });

                    let palette = service.getPalette("#336666");

                    expect(palette).to.deep.equal(expectedPalette);
                });
            });

            describe('when the closest matching color does not exist in the palette', () => {
                beforeEach(() => {
                    fakeMatchingColour = "#AAFF99";
                });

                it("returns an empty palette object", () => {
                    let palette = service.getPalette("#336666");

                    expect(palette).to.deep.equal({colours: []});
                });
            });

            describe('when there is no palette', () => {
                beforeEach(() => {
                    fakeMatchingColour = "#889977";
                    service.palettes = null;
                });

                it("returns an empty palette object", () => {
                    let palette = service.getPalette("#336666");

                    expect(palette).to.deep.equal({colours: []});
                });
            });
            
        });
    });

    describe('#getAvailableColours', () => {
        beforeEach(() => {
            spyOn(nearestColor, 'from').and.returnValue(() => {});
        });

        describe("success", () => {

            describe('loads palette from json file', () => {
                beforeEach(() => {
                    fakeMatchingColour = "#889977";
                });

                it("loads palette from json file", () => {
                    backend.connections.subscribe(connection => {
                        expect(connection.request.url).to.equal("./assets/100colours.json");
                        connection.mockRespond(new Response(<any>{
                            body: fakeResponse
                        }));
                    });

                    service.getAvailableColours().subscribe((colours) => {
                       expect(colours).to.deep.equal(expectedAvailableColours); 
                    });
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
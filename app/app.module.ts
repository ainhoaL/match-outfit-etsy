import { NgModule }      from '@angular/core';
import { JsonpModule, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { FormsModule }   from '@angular/forms';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ColorPickerModule } from 'ngx-color-picker';

import './app.less';

@NgModule({
  imports:      [ BrowserModule, JsonpModule, HttpModule, FormsModule, InfiniteScrollModule, ColorPickerModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

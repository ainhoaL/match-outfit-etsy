import { NgModule }      from '@angular/core';
import { JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { FormsModule }   from '@angular/forms';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import './app.less';

@NgModule({
  imports:      [ BrowserModule, JsonpModule, FormsModule, InfiniteScrollModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
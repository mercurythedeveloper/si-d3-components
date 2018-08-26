import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SlTreeComponent } from './sl-tree/sl-tree.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatSidenavModule, MatListModule } from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,
    SlTreeComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

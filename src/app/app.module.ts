import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { MainScreenComponent } from './components/partials/main-screen/main-screen.component';
import { HomeComponent } from './components/pages/home/home.component';
//-------------
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './components/partials/ecu-dialog/ecu-dialog.component';
import { BusDialogComponent } from './components/partials/bus-dialog/bus-dialog.component';
import { ServiceComponent } from './components/partials/service/service.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MainScreenComponent,
    HomeComponent,
    DialogComponent,
    BusDialogComponent,
    ServiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    //----------
    FormsModule,
    //---------
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

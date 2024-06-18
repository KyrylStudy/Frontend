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
import { CreateHardwareDialogComponent } from './components/partials/create-hardware-dialog/create-hardware-dialog.component';
import { CreateServiceInfrastructureDialogComponent } from './components/partials/create-service-infrastructure-dialog/create-service-infrastructure-dialog.component';
import { ServiceDialogComponent } from './components/partials/service-dialog/service-dialog.component';
import { DataStreamDialogComponent } from './components/partials/data-stream-dialog/data-stream-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MainScreenComponent,
    HomeComponent,
    DialogComponent,
    BusDialogComponent,
    ServiceComponent,
    CreateHardwareDialogComponent,
    CreateServiceInfrastructureDialogComponent,
    ServiceDialogComponent,
    DataStreamDialogComponent,
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

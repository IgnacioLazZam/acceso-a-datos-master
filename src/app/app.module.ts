import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './core/interfaces/data-service';
import { DataInMemoryService } from './core/services/data-in-memory.service';
import { FirebaseDataService } from './core/services/Firebase.service';
import { DataInStorageService } from './core/services/data-in-storage.service';


export function DataServiceFactory(backend:string){
    switch(backend){
      case 'InMemory':
        return new DataInMemoryService();
      case 'Storage':
        return new DataInStorageService();
      default:
        throw new Error("Not implemented");
    }
} 

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: 'InMemory',
      useValue:'InMemory'
    },
    {
      provide: 'Storage',
      useValue:'Storage'
    },
    {
      provide: DataService,
      deps: ['InMemory'],
      useFactory: DataServiceFactory,  
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

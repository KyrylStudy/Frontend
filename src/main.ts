//import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { provideHttpClient } from '@nguniversal/common/http';
//import { HttpClient } from '@angular/common/http';
import { AppModule } from './app/app.module';
//import { environment } from './environments/environment';

/*if (environment.production) {
  enableProdMode();
}*/

platformBrowserDynamic()
  .bootstrapModule(AppModule/*, {
    providers: [
      provideHttpClient().withFetch() // Add withFetch() to enable fetch
    ]
  }*/)
  .catch(err => console.error(err));





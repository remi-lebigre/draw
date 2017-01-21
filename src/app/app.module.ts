import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home.page';
import { DrawPage } from './pages/draw.page';

@NgModule({
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  declarations: [
    AppComponent,
    HomePage,
    DrawPage
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    DrawPage
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home.page';
import { DrawPage } from './pages/draw.page';
import { ColorPage } from './pages/color.page';

@NgModule({
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  declarations: [
    AppComponent,
    HomePage,
    DrawPage,
    ColorPage
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    DrawPage,
    ColorPage
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }

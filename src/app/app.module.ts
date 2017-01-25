import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AppComponent} from './app.component';
import {HomePage} from './pages/home.page';
import {DrawPage} from './pages/draw.page';
import {AuthPage} from './pages/auth.page';
import {ColorPage} from './pages/color.page';
import {SizePage} from './pages/size.page';
import {HomeCategoryModal} from './pages/modals/home.category';
import {Utilities} from './services/utilities.service';

@NgModule({
    imports: [
        IonicModule.forRoot(AppComponent)
    ],
    declarations: [
        AppComponent,
        AuthPage,
        HomePage,
        DrawPage,
        ColorPage,
        SizePage,
        HomeCategoryModal
    ],
    entryComponents: [
        AppComponent,
        AuthPage,
        HomePage,
        DrawPage,
        ColorPage,
        SizePage,
        HomeCategoryModal
    ],
    bootstrap: [IonicApp],
    providers: [Utilities]
})
export class AppModule {
}

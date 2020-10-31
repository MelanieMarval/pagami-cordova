import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { IonicStorageModule } from '@ionic/storage';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { PipesModule } from './pipes/pipes.module';
import { firebaseConfig } from '../environments/environment';
import { IonicSelectableModule } from 'ionic-selectable';
import { BackgroundEmptyModule } from './shared/background-empty/background-empty.module';
// Components
import { AppComponent } from './app.component';
import { ModalSelectableComponent } from './components/modal-selectable/modal-selectable.component';
// Providers
import { UserIntentProvider } from './providers/user-intent.provider';
import { ToastProvider } from './providers/toast.provider';
import { AdminIntentProvider } from './providers/admin-intent.provider';
import { BrowserProvider } from './providers/browser.provider';
import { CompressImageProvider } from './providers/compress-image.provider';
import { NotificationsProvider } from './providers/notifications.provider';

// importar locales para cambiar a espanol el pipe date
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@NgModule({
    declarations: [AppComponent, ModalSelectableComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        IonicStorageModule.forRoot(),
        CoreModule,
        PipesModule,
        IonicSelectableModule,
        BackgroundEmptyModule,
    ],
    providers: [
        ToastProvider,
        UserIntentProvider,
        AdminIntentProvider,
        BrowserProvider,
        NotificationsProvider,
        CompressImageProvider,
        {provide: LOCALE_ID, useValue: 'es'},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        AndroidPermissions,
        AppMinimize,
        BrowserTab,
        Camera,
        Clipboard,
        GooglePlus,
        GoogleMaps,
        LocationAccuracy,
        Sim,
        SplashScreen,
        StatusBar,
        OpenNativeSettings
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}

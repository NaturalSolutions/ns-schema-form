import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { ITranslationService, I18NEXT_SERVICE, I18NextModule } from 'angular-i18next';

import * as _ from 'lodash';

import { environment } from '../environments/environment';
import translations from '../translations';

export function appInit(i18next: ITranslationService) {
  return () => i18next.init({
    /* whitelist: ['fr', 'en'],
    fallbackLng: 'fr',
    debug: true,
    returnEmptyString: false,
    ns: [
      'translations',
      'validation',
      'error'
    ], */
    debug: !environment.production,
    lng: 'en',
    resources: {
      en: {
        translation: _.cloneDeep(translations.en)
      },
      fr: {
        translation: _.cloneDeep(translations.fr)
      }
    }
  });
}

export function localeIdFactory(i18next: ITranslationService) {
  return i18next.language;
}

export const I18N_PROVIDERS = [{
  provide: APP_INITIALIZER,
  useFactory: appInit,
  deps: [I18NEXT_SERVICE],
  multi: true
},
{
  provide: LOCALE_ID,
  deps: [I18NEXT_SERVICE],
  useFactory: localeIdFactory
}];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    I18NextModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    I18N_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

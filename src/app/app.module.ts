import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { SearchBoxComponent } from './search-box/search-box.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptorService } from './services/app-interceptor.service'

import { FormsModule } from '@angular/forms'
import { MainComponent } from './main/main.component'

import { Routes, RouterModule } from '@angular/router'
import { MatchDataResolver } from './services/match-data-resolver.service'
import { AlertComponent } from './alert/alert.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatchListComponent } from './match-list/match-list.component'
import { MatchListItemComponent } from './match-list-item/match-list-item.component'

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: MainComponent, resolve: { matches: MatchDataResolver } }
]

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    MainComponent,
    AlertComponent,
    MatchListComponent,
    MatchListItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

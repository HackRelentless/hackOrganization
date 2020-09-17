import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// 3rd Party imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { UiSwitchModule } from 'ngx-ui-switch';
import {AutosizeModule} from 'ngx-autosize';

// Components
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { InteractiveLogoComponent } from './interactive-logo/interactive-logo.component';
import { ChapterMapComponent } from './chapter-map/chapter-map.component';
import { HttpClientModule } from '@angular/common/http';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { AccountService } from './account.service';
import { DocumentPageComponent } from './document-page/document-page.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatConsoleComponent } from './chat-console/chat-console.component';
import { BaseChatComponent } from './base-chat/base-chat.component';
import { ChatInterfaceComponent } from './chat-interface/chat-interface.component';
import { MatrixService } from './matrix.service';
import { MarkedPipe } from './marked.pipe';

Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DashboardPageComponent,
    InteractiveLogoComponent,
    ChapterMapComponent,
    AccountSettingsComponent,
    DocumentPageComponent,
    LoginComponent,
    ChatConsoleComponent,
    BaseChatComponent,
    ChatInterfaceComponent,
    MarkedPipe,
  ],
  imports: [
    AmplifyUIAngularModule,
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    AutosizeModule,
    UiSwitchModule
  ],
  providers: [AccountService, MatrixService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fab);
    library.add(fas);
  }
}

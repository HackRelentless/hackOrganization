import { Component, ChangeDetectorRef } from '@angular/core';
import { AccountService } from './account.service';
import { MatrixService } from './matrix.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hackOrganization';
  isSignedIn = false;
  isMenuCollapsed = true;

  constructor(public matrixService: MatrixService, public accountService: AccountService, public cdr: ChangeDetectorRef) {
    this.accountService.loadUserEvent.subscribe(isLoaded => {
      if(isLoaded) {
        this.isSignedIn = true;
        this.cdr.detectChanges();
      } else {
        this.isSignedIn = false;
        this.cdr.detectChanges();
      }
    });
  }
}

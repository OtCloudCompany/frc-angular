import { Component } from '@angular/core';

import { PrivacyComponent as BaseComponent } from '../../../../../app/info/privacy/privacy.component';
// import { PrivacyContentComponent } from '../../../../../app/info/privacy/privacy-content/privacy-content.component';
import { PrivacyContentComponent } from './privacy-content/privacy-content.component';

@Component({
  selector: 'ds-themed-privacy',
  styleUrls: ['../../../../../app/info/privacy/privacy.component.scss'],
  templateUrl: './privacy.component.html',
  imports: [
    PrivacyContentComponent,
  ],
})
export class PrivacyComponent extends BaseComponent {
}

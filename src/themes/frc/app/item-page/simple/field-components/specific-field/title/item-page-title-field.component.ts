import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ItemPageTitleFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { getLocalizedMetadata } from '../../../../../shared/frc-metadata-utils';

@Component({
  selector: 'ds-themed-item-page-title-field',
  templateUrl: './item-page-title-field.component.html',
  imports: [
    TranslateModule
  ],
})
export class ItemPageTitleFieldComponent extends BaseComponent {
  protected translate = inject(TranslateService);

  getLocalizedTitle(): string {
    return getLocalizedMetadata(this.item, 'dc.title', this.translate)
      || this.dsoNameService.getName(this.item);
  }
}

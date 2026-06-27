import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericItemPageFieldComponent } from '../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { MetadataValue } from '../../../../../app/core/shared/metadata.models';
import { MetadataValuesComponent } from '../../../../../app/item-page/field-components/metadata-values/metadata-values.component';
import { getLocalizedMetadataList } from '../../shared/frc-metadata-utils';

@Component({
  selector: 'ds-frc-generic-item-page-field',
  templateUrl: './frc-generic-item-page-field.component.html',
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
export class FrcGenericItemPageFieldComponent extends GenericItemPageFieldComponent {
  protected translate = inject(TranslateService);

  getLocalizedMetadataValues(): MetadataValue[] {
    return getLocalizedMetadataList(this.item, this.fields, this.translate);
  }
}

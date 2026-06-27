import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';
import { ItemPageAbstractFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { Item } from 'src/app/core/shared/item.model';
import { getLocalizedMetadata } from '../../shared/frc-metadata-utils';

@Component({
  selector: 'ds-frc-abstract-field',
  imports: [CommonModule,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
  templateUrl: './frc-abstract-field.component.html',
  styleUrl: './frc-abstract-field.component.scss',
})
export class FrcAbstractFieldComponent extends ItemPageAbstractFieldComponent {
  @Input() object: Item;
  protected translate = inject(TranslateService);

  getLocalizedAbstract(): string {
    return getLocalizedMetadata(this.object, 'dc.description.abstract', this.translate);
  }
}

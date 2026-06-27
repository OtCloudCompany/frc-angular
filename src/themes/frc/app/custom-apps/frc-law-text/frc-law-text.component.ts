import { Component, Input, inject } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { getLocalizedMetadata } from '../../shared/frc-metadata-utils';

@Component({
  selector: 'ds-frc-law-text',
  imports: [TruncatableComponent, TruncatablePartComponent, TranslateModule],
  templateUrl: './frc-law-text.component.html',
  styleUrl: './frc-law-text.component.scss',
})
export class FrcLawTextComponent {
  @Input() object: Item;
  protected translate = inject(TranslateService);

  getLocalizedLawText(): string {
    return getLocalizedMetadata(this.object, 'dc.description.lawtext', this.translate);
  }
}

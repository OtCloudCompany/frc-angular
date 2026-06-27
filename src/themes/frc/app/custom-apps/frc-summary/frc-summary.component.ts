import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';
import { Item } from 'src/app/core/shared/item.model';
import { getLocalizedMetadata } from '../../shared/frc-metadata-utils';

@Component({
  selector: 'ds-frc-summary',
  imports: [
    CommonModule,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
  templateUrl: './frc-summary.component.html',
  styleUrl: './frc-summary.component.scss',
})
export class FrcSummaryComponent {
  @Input() object: Item;
  protected translate = inject(TranslateService);

  getLocalizedSummary(): string {
    return getLocalizedMetadata(this.object, 'dc.description.summary', this.translate);
  }
}

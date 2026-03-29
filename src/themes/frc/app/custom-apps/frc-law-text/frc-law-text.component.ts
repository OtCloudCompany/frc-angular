import { Component, Input } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-frc-law-text',
  imports: [TruncatableComponent, TruncatablePartComponent, TranslateModule],
  templateUrl: './frc-law-text.component.html',
  styleUrl: './frc-law-text.component.scss',
})
export class FrcLawTextComponent {
  @Input() object: Item;

}

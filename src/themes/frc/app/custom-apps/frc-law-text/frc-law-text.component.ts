import { Component, Input } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { StripLineBreaksPipe } from '../strip-line-breaks.pipe';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';

@Component({
  selector: 'ds-frc-law-text',
  imports: [StripLineBreaksPipe, TruncatableComponent, TruncatablePartComponent],
  templateUrl: './frc-law-text.component.html',
  styleUrl: './frc-law-text.component.scss',
})
export class FrcLawTextComponent {
  @Input() object: Item;

}

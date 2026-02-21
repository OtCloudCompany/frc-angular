import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatableComponent } from 'src/app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from 'src/app/shared/truncatable/truncatable-part/truncatable-part.component';
import { StripLineBreaksPipe } from '../strip-line-breaks.pipe';
import { ItemPageAbstractFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-frc-abstract-field',
  imports: [CommonModule,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
    StripLineBreaksPipe
  ],
  templateUrl: './frc-abstract-field.component.html',
  styleUrl: './frc-abstract-field.component.scss',
})
export class FrcAbstractFieldComponent extends ItemPageAbstractFieldComponent {
  @Input() object: Item;

}

import { Component, OnInit, Input, inject } from '@angular/core';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { getLocalizedMetadata } from '../../shared/frc-metadata-utils';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-item-page-navbar',
  imports: [TranslateModule],
  templateUrl: './item-page-navbar.component.html',
  styleUrl: './item-page-navbar.component.scss',
})
export class ItemPageNavbarComponent implements OnInit {
  @Input() item: DSpaceObject;
  handle: string;
  title: string;
  protected translate = inject(TranslateService);

  ngOnInit() {
    if (this.item.hasMetadata(['dc.identifier.uri'])) {
      this.handle = this.item.firstMetadataValue('dc.identifier.uri') || '';
    }
    if (this.item.hasMetadata(['dc.title'])) {
      this.title = getLocalizedMetadata(this.item as Item, 'dc.title', this.translate);
    }
  }

}

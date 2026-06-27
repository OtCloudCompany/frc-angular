import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Context } from '../../../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../../../app/core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemSearchResult } from '../../../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../../../app/thumbnail/themed-thumbnail.component';
import { getLocalizedMetadata, getLocalizedMetadataList } from '../../../../../frc-metadata-utils';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Any, 'frc')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.Any, 'frc')
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemSearchResultListElementComponent extends BaseComponent {
  protected translate = inject(TranslateService);

  getDsoTitle(): string {
    return getLocalizedMetadata(this.dso, 'dc.title', this.translate) || this.dsoTitle || '';
  }

  firstMetadataValue(keyOrKeys: string | string[], escapeHTML = true): string {
    if (typeof keyOrKeys === 'string') {
      return getLocalizedMetadata(this.dso, keyOrKeys, this.translate) || super.firstMetadataValue(keyOrKeys, escapeHTML);
    }
    return super.firstMetadataValue(keyOrKeys, escapeHTML);
  }

  allMetadataValues(keyOrKeys: string | string[], escapeHTML = true): string[] {
    const localized = getLocalizedMetadataList(this.dso, keyOrKeys, this.translate);
    if (localized.length > 0) {
      return localized.map(val => val.value);
    }
    return super.allMetadataValues(keyOrKeys, escapeHTML);
  }
}

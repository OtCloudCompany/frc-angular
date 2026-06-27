import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Collection } from '../../../../../../app/core/shared/collection.model';
import { Context } from '../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { CollectionListElementComponent as BaseComponent } from '../../../../../../app/shared/object-list/collection-list-element/collection-list-element.component';
import { getLocalizedMetadata as getLocalizedMetadataUtil } from '../../frc-metadata-utils';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['../../../../../../app/shared/object-list/collection-list-element/collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html',
  imports: [
    RouterLink,
  ],
})
@listableObjectComponent(Collection, ViewMode.ListElement, Context.Any, 'frc')
export class CollectionListElementComponent extends BaseComponent {
  protected translate = inject(TranslateService);

  getLocalizedMetadata(dso: DSpaceObject, field: string): string {
    return getLocalizedMetadataUtil(dso, field, this.translate);
  }
}

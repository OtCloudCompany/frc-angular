import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Community } from '../../../../../../app/core/shared/community.model';
import { Context } from '../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunityListElementComponent as BaseComponent } from '../../../../../../app/shared/object-list/community-list-element/community-list-element.component';
import { getLocalizedMetadata as getLocalizedMetadataUtil } from '../../frc-metadata-utils';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['../../../../../../app/shared/object-list/community-list-element/community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html',
  imports: [
    RouterLink,
  ],
})
@listableObjectComponent(Community, ViewMode.ListElement, Context.Any, 'frc')
export class CommunityListElementComponent extends BaseComponent {
  protected translate = inject(TranslateService);

  getLocalizedMetadata(dso: DSpaceObject, field: string): string {
    return getLocalizedMetadataUtil(dso, field, this.translate);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComColI18nMetadataComponent } from './comcol-i18n-metadata.component';
import { Community } from 'src/app/core/shared/community.model';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

@Component({
  selector: 'ds-community-i18n',
  templateUrl: './comcol-i18n-metadata.component.html',
  styleUrls: ['./comcol-i18n-metadata.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class CommunityI18nComponent extends ComColI18nMetadataComponent<Community> {
  constructor(
    protected communityDataService: CommunityDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
    super(communityDataService, router, route, notificationsService, translate);
  }
}

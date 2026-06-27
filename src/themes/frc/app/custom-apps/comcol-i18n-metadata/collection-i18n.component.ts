import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComColI18nMetadataComponent } from './comcol-i18n-metadata.component';
import { Collection } from 'src/app/core/shared/collection.model';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

@Component({
  selector: 'ds-collection-i18n',
  templateUrl: './comcol-i18n-metadata.component.html',
  styleUrls: ['./comcol-i18n-metadata.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class CollectionI18nComponent extends ComColI18nMetadataComponent<Collection> {
  constructor(
    protected collectionDataService: CollectionDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
    super(collectionDataService, router, route, notificationsService, translate);
  }
}

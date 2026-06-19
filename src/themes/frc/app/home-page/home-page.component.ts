import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeCoarComponent } from '../../../../app/home-page/home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from '../../../../app/home-page/home-news/themed-home-news.component';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { RecentItemListComponent } from '../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../app/search-page/themed-configuration-search-page.component';
import { HomePageSidebarComponent } from '../custom-apps/home-page-sidebar/home-page-sidebar.component';

@Component({
  selector: 'ds-themed-home-page',
  styleUrls: ['../../../../app/home-page/home-page.component.scss'],
  templateUrl: './home-page.component.html',
  imports: [
    HomeCoarComponent,
    NgTemplateOutlet,
    RecentItemListComponent,
    ThemedConfigurationSearchPageComponent,
    ThemedHomeNewsComponent,
    HomePageSidebarComponent,
    TranslateModule,
  ],
})
export class HomePageComponent extends BaseComponent {
}

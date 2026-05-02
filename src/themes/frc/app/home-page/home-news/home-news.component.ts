import { Component, OnInit } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { ThemedSearchFormComponent } from 'src/app/shared/search-form/themed-search-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HostWindowService } from 'src/app/shared/host-window.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    ThemedSearchFormComponent, TranslateModule, AsyncPipe
  ],
})
export class HomeNewsComponent extends BaseComponent implements OnInit {
  isMobile$: Observable<boolean>;
  constructor(private windowService: HostWindowService) {
    super();
  }
  ngOnInit(): void {
    // isXsOrSm() or isMobile() will return true for mobile devices
    this.isMobile$ = this.windowService.isMobile();
  }

}

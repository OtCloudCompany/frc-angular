import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
} from '@angular/common';
import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedUserMenuComponent } from 'src/app/shared/auth-nav-menu/user-menu/themed-user-menu.component';

import { AppState } from '../../../../app/app.reducer';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { BrowseService } from '../../../../app/core/browse/browse.service';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { MenuID } from 'src/app/shared/menu/menu-id.model';
import { MenuService } from 'src/app/shared/menu/menu.service';
import { ThemeService } from '../../../../app/shared/theme-support/theme.service';
import { MenuItemType } from 'src/app/shared/menu/menu-item-type.model';

@Component({
  selector: 'ds-themed-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav],
  imports: [
    AsyncPipe,
    NgbDropdownModule,
    NgClass,
    NgComponentOutlet,
    ThemedUserMenuComponent,
    TranslateModule,
  ],
})
export class NavbarComponent extends BaseComponent {
  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    public windowService: HostWindowService,
    public browseService: BrowseService,
    public authorizationService: AuthorizationDataService,
    public route: ActivatedRoute,
    protected themeService: ThemeService,
    store: Store<AppState>,
  ) {
    super(menuService, injector, windowService, browseService, authorizationService, route, themeService, store);
  }

  ngOnInit() {
    super.ngOnInit();

    const historicalLawsMenuItem = {
      id: 'historical_laws',
      visible: true,
      active: true,
      model: {
        type: MenuItemType.LINK,
        disabled: false,
        text: 'menu.section.exploreCollections',
        link: '/communities/9864e1c5-8193-4cda-90dc-152701a3c7b2/subcoms-cols'
      },
      index: 0.5,
      shouldPersistOnRouteChange: true,
      alwaysRenderExpandable: false,
    };
    this.menuService.addSection(MenuID.PUBLIC, historicalLawsMenuItem);

    // Reactively hide the Communities & Collections section whenever it gets (re-)added as visible
    this.subs.push(
      this.menuService.isSectionVisible(MenuID.PUBLIC, 'public_0_0').subscribe((visible) => {
        if (visible) {
          this.menuService.hideMenuSection(MenuID.PUBLIC, 'public_0_0');
        }
      }),
    );
  }
}

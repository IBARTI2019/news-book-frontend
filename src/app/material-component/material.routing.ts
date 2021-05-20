import { Routes } from '@angular/router';

import { ButtonsComponent } from './buttons/buttons.component';
import { GridComponent } from './grid/grid.component';
import { ListsComponent } from './lists/lists.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import { DialogComponent } from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';

export const MaterialRoutes: Routes = [
  {
    path: 'button',
    data: { skipPermission: true },
    component: ButtonsComponent
  },
  {
    path: 'grid',
    data: { skipPermission: true },
    component: GridComponent
  },
  {
    path: 'lists',
    data: { skipPermission: true },
    component: ListsComponent
  },
  {
    path: 'menu',
    data: { skipPermission: true },
    component: MenuComponent
  },
  {
    path: 'tabs',
    data: { skipPermission: true },
    component: TabsComponent
  },
  {
    path: 'stepper',
    data: { skipPermission: true },
    component: StepperComponent
  },
  {
    path: 'expansion',
    data: { skipPermission: true },
    component: ExpansionComponent
  },
  {
    path: 'chips',
    data: { skipPermission: true },
    component: ChipsComponent
  },
  {
    path: 'toolbar',
    data: { skipPermission: true },
    component: ToolbarComponent
  },
  {
    path: 'progress-snipper',
    data: { skipPermission: true },
    component: ProgressSnipperComponent
  },
  {
    path: 'progress',
    data: { skipPermission: true },
    component: ProgressComponent
  },
  {
    path: 'dialog',
    data: { skipPermission: true },
    component: DialogComponent
  },
  {
    path: 'tooltip',
    data: { skipPermission: true },
    component: TooltipComponent
  },
  {
    path: 'snackbar',
    data: { skipPermission: true },
    component: SnackbarComponent
  },
  {
    path: 'slider',
    data: { skipPermission: true },
    component: SliderComponent
  },
  {
    path: 'slide-toggle',
    data: { skipPermission: true },
    component: SlideToggleComponent
  }
];

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
    data: { omitirPermiso: true },
    component: ButtonsComponent
  },
  {
    path: 'grid',
    data: { omitirPermiso: true },
    component: GridComponent
  },
  {
    path: 'lists',
    data: { omitirPermiso: true },
    component: ListsComponent
  },
  {
    path: 'menu',
    data: { omitirPermiso: true },
    component: MenuComponent
  },
  {
    path: 'tabs',
    data: { omitirPermiso: true },
    component: TabsComponent
  },
  {
    path: 'stepper',
    data: { omitirPermiso: true },
    component: StepperComponent
  },
  {
    path: 'expansion',
    data: { omitirPermiso: true },
    component: ExpansionComponent
  },
  {
    path: 'chips',
    data: { omitirPermiso: true },
    component: ChipsComponent
  },
  {
    path: 'toolbar',
    data: { omitirPermiso: true },
    component: ToolbarComponent
  },
  {
    path: 'progress-snipper',
    data: { omitirPermiso: true },
    component: ProgressSnipperComponent
  },
  {
    path: 'progress',
    data: { omitirPermiso: true },
    component: ProgressComponent
  },
  {
    path: 'dialog',
    data: { omitirPermiso: true },
    component: DialogComponent
  },
  {
    path: 'tooltip',
    data: { omitirPermiso: true },
    component: TooltipComponent
  },
  {
    path: 'snackbar',
    data: { omitirPermiso: true },
    component: SnackbarComponent
  },
  {
    path: 'slider',
    data: { omitirPermiso: true },
    component: SliderComponent
  },
  {
    path: 'slide-toggle',
    data: { omitirPermiso: true },
    component: SlideToggleComponent
  }
];

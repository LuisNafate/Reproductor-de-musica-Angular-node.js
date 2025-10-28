import { Routes } from '@angular/router';
import { MainViewComponent } from './views/main-view/main-view.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

export const routes: Routes = [
  {
    path: '',
    component: MainViewComponent
  },
  {
    path: 'search',
    component: SearchResultsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

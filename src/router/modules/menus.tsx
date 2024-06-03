import { lazy, LazyExoticComponent, NamedExoticComponent } from 'react';
import LazyLoad from '@/components/LazyLoad/LazyLoad';

const Menus: LazyExoticComponent<NamedExoticComponent<any>> = lazy(() => import('@/views/Menus/Menus'));

export default {
  path: '/menus',
  element: LazyLoad(Menus)
};

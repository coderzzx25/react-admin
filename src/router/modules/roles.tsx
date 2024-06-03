import { lazy, LazyExoticComponent, NamedExoticComponent } from 'react';
import LazyLoad from '@/components/LazyLoad/LazyLoad';

const Roles: LazyExoticComponent<NamedExoticComponent<any>> = lazy(() => import('@/views/Roles/Roles'));

export default {
  path: '/roles',
  element: LazyLoad(Roles)
};

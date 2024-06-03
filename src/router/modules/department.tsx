import { lazy, LazyExoticComponent, NamedExoticComponent } from 'react';
import LazyLoad from '@/components/LazyLoad/LazyLoad';

const Departments: LazyExoticComponent<NamedExoticComponent<any>> = lazy(
  () => import('@/views/Departments/Departments')
);

export default {
  path: '/departments',
  element: LazyLoad(Departments)
};

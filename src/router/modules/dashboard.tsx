import { lazy, LazyExoticComponent, NamedExoticComponent } from 'react';
import LazyLoad from '@/components/LazyLoad/LazyLoad';

const Dashboard: LazyExoticComponent<NamedExoticComponent<any>> = lazy(() => import('@/views/Dashboard/Dashboard'));

export default {
  path: '/dashboard',
  element: LazyLoad(Dashboard)
};

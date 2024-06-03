import { RouteObject, Navigate, useRoutes } from 'react-router-dom';

import Login from '@/views/Login/Login';
import Welcome from '@/views/Welcome/Welcome';
import Layouts from '../views/Layouts/Layouts';
import Notfound from '@/views/Notfound/Notfound';

import { loadLocalRouter } from '@/utils/router-handle';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/welcome" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    id: 'layouts',
    element: <Layouts />,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      ...loadLocalRouter()
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  },
  {
    path: '/404',
    element: <Notfound />
  }
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;

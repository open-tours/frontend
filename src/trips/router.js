import Login from './views/Login';
import Logout from './views/Logout';
import Profile from './views/Profile';

export default [
  {
    path: '/login',
    name: 'userLogin',
    component: Login,
  },
  {
    path: '/logout',
    name: 'userLogout',
    component: Logout,
  },
  {
    path: '/profile',
    name: 'userProfile',
    component: Profile,
  },
];

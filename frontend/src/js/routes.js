import HomePage from '../pages/home.jsx'
import LoginPage from "../pages/login.jsx"
import DialogPage from "../pages/dialog.jsx"
import ProfilePage from "../pages/profile.jsx"

import {f7} from 'framework7-react';

let checkAuth = () => {
  console.log(1)
}

let checkPermission = () => {
  console.log(222)
}

// export const useRoutes = isAuthenticated => {
//   if (isAuthenticated){
//     return [
//       {
//         path: '/',
//         name: "home",
//         component: HomePage,
//       }
//     ]
//   } else {
//     return [
//       {
//         path: '/',
//         name: "login",
//         alias: "/login",
//         component: LoginPage,
//       }
//     ]
//   }
// }

let routes = [
  {
    path: '/',
    name: "home",
    component: HomePage,
  },
  {
    path: '/login',
    name: "login",
    component: LoginPage,
  },
  {
    path: '/dialog',
    name: "/dialog",
    component: DialogPage,
  },
  {
    path: '/profile',
    name: "/profile",
    component: ProfilePage,
  }
]


export default routes;

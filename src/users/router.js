import Signup from "./views/Signup";
import Login from "./views/Login";
import Logout from "./views/Logout";
import Profile from "./views/Profile";

export default [
  {
    path: "/signup",
    name: "usersSignup",
    component: Signup
  },
  {
    path: "/login",
    name: "usersLogin",
    component: Login
  },
  {
    path: "/logout",
    name: "usersLogout",
    component: Logout
  },
  {
    path: "/my/profile",
    name: "usersMyProfile",
    component: Profile
  }
];

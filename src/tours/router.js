import MyTours from "./views/MyTours";
import MyTourEdit from "./views/MyTourEdit";

export default [
  {
    path: "/my/tours",
    name: "toursMyTours",
    component: MyTours
  },
  {
    path: "/my/tour/:id",
    name: "toursMyTour",
    component: MyTourEdit
  }
];

import MyTours from "./views/MyStages";
import MyTourEdit from "./views/MyTourEdit";
import MyStages from "./views/MyStages";
import MyStageEdit from "./views/MyStageEdit";

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
  },
  {
    path: "/my/stages",
    name: "toursMyStages",
    component: MyStages
  },
  {
    path: "/my/stage/:id",
    name: "toursMyStage",
    component: MyStageEdit
  }
];

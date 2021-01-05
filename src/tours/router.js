import MyTours from "./views/MyTracks";
import MyTourEdit from "./views/MyTourEdit";
import MyTracks from "./views/MyTracks";
import MyTrackEdit from "./views/MyTrackEdit";

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
    path: "/my/tracks",
    name: "toursMyTracks",
    component: MyTracks
  },
  {
    path: "/my/track/add/",
    name: "toursMyTrackAdd",
    component: MyTrackEdit
  },
  {
    path: "/my/track/:id",
    name: "toursMyTrack",
    component: MyTrackEdit
  }
];

import MyTours from "./views/MyTracks";
import Track from "./views/Track";
import MyTracks from "./views/MyTracks";
import MyTrackEdit from "./views/MyTrackEdit";

export default [
  {
    path: "/my/tours",
    name: "toursMyTours",
    component: MyTours
  },
  {
    path: "/track/:id",
    name: "toursTrack",
    component: Track
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

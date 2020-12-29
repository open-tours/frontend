import MyTrips from './views/MyTrips';
import MyTripEdit from './views/MyTripEdit';

export default [
  {
    path: '/my/trips',
    name: 'tripsMyTrips',
    component: MyTrips,
  },
  {
    path: '/my/trip/:id',
    name: 'tripsMyTrip',
    component: MyTripEdit,
  },
];

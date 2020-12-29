import moment from 'moment';

export function formatDateTime(datetime) {
  return moment(String(datetime)).format('MM/DD/YYYY hh:mm');
}

export function formatDate(date) {
  return moment(String(date)).format('MM/DD/YYYY');
}

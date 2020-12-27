import moment from 'moment';

export function formatDate(date) {
  return moment(String(date)).format('MM/DD/YYYY hh:mm');
}

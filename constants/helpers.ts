export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const unScreamingSnakeCase = (str: string, join = ' ') =>
  str.split('_').map(capitalize).join(join);

const intervals = [
  { seconds: 31536000, name: 'years' },
  { seconds: 2592000, name: 'months' },
  { seconds: 86400, name: 'days' },
  { seconds: 3600, name: 'hours' },
  { seconds: 60, name: 'minutes' },
  { seconds: 1, name: 'seconds' },
];

export const timeSince = (date: Date | string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const interval = intervals.find(({ seconds: s }) => seconds >= s);
  if (!interval) return 'Just now';
  return `${Math.floor(seconds / interval.seconds)} ${interval.name} ago`;
};

export const AllZeroUUID = '00000000-0000-0000-0000-000000000000';

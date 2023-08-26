export const topics = [
  {
    image: require('../assets/images/topics/Relationship.png'),
    name: 'Relationship',
  },
  { image: require('../assets/images/topics/Family.png'), name: 'Family' },
  {
    image: require('../assets/images/topics/Friendship.png'),
    name: 'Friendship',
  },
  { image: require('../assets/images/topics/Peer.png'), name: 'Peer' },
  {
    image: require('../assets/images/topics/Marriage.png'),
    name: 'Marriage',
  },
  {
    image: require('../assets/images/topics/Self-Relationship.png'),
    name: 'Self-Relationship',
  },
  {
    image: require('../assets/images/topics/Spirituality.png'),
    name: 'Spirituality',
  },
];

export const topicsConvertToEnum: {
  [key: string]: string;
} = {
  Relationship: 'RELATIONSHIP',
  Family: 'FAMILY',
  Friendship: 'FRIENDSHIP',
  Peer: 'PEER',
  Marriage: 'MARRIAGE',
  'Self-Relationship': 'SELF_RELATIONSHIP',
  Spirituality: 'SPIRITUALITY',
};

export const EnumConvertToTopics: {
  [key: string]: string;
} = {
  RELATIONSHIP: 'Relationship',
  FAMILY: 'Family',
  FRIENDSHIP: 'Friendship',
  PEER: 'Peer',
  MARRIAGE: 'Marriage',
  SELF_RELATIONSHIP: 'Self-Relationship',
  SPIRITUALITY: 'Spirituality',
};

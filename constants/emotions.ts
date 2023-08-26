import { ImageSourcePropType } from 'react-native';

export const emotions: {
  HAPPY: ImageSourcePropType;
  CONTENT: ImageSourcePropType;
  GRATEFUL: ImageSourcePropType;
  EXCITED: ImageSourcePropType;
  ANGRY: ImageSourcePropType;
  STRESSED: ImageSourcePropType;
  ANXIOUS: ImageSourcePropType;
  SAD: ImageSourcePropType;
} = {
  HAPPY: require('../assets/images/emoji/Happy.png'),
  CONTENT: require('../assets/images/emoji/Content.png'),
  GRATEFUL: require('../assets/images/emoji/Grateful.png'),
  EXCITED: require('../assets/images/emoji/Excited.png'),
  ANGRY: require('../assets/images/emoji/Angry.png'),
  STRESSED: require('../assets/images/emoji/Stressed.png'),
  ANXIOUS: require('../assets/images/emoji/Anxious.png'),
  SAD: require('../assets/images/emoji/Sad.png'),
};

export const emotionColors: {
  HAPPY: string[];
  CONTENT: string[];
  GRATEFUL: string[];
  EXCITED: string[];
  ANGRY: string[];
  STRESSED: string[];
  ANXIOUS: string[];
  SAD: string[];
} = {
  HAPPY: ['#FFDB92', '#FFC95B'],
  CONTENT: ['#E3F2FD', '#74B3CE'],
  GRATEFUL: ['#FFACB4', '#E5D9F2'],
  EXCITED: ['#F38D68', '#FFDB92'],
  ANGRY: ['#FFB69C', '#DB5461'],
  STRESSED: ['#BDF0BF', '#41B89C'],
  ANXIOUS: ['#FFDB92', '#DB5461'],
  SAD: ['#E5E5E5', '#686963'],
};

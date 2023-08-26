import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { FeedbackService } from '../../services/feedback';
import { UserStackScreenProps } from '../../types';
import LoadingStatusContext from '../../components/LoadingStatus';

export default function Feedback({
  navigation,
}: UserStackScreenProps<'Feedback'>) {
  const { user } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const [feedback, setFeedback] = React.useState<string>('');

  const handleFeedback = async () => {
    if (!feedback) return Alert.alert('Oops!', 'Please enter your feedback.');
    setLoadingStatus({ isLoading: true });
    const result = await FeedbackService.postFeedback({
      content: feedback,
    });
    if (result) {
      Alert.alert('Veor', 'Thank you for your feedback!');
      setFeedback('');
    } else {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
    }
    setLoadingStatus({ isLoading: false });
    // navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='p-5 mt-3 rounded-xl'>
            <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
              Give Us Feedback
            </Text>
            <Text className='text-storm text-[17px] '>
              Please do not hesitate to share your thoughts and suggestions with
              us. Together, we can help millions of people.
            </Text>
          </View>
          <TextInput
            className='mt-4 p-4 mb-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            onChangeText={(text) => setFeedback(text)}
            value={feedback}
            placeholder='Enter your feedback here...'
            textAlignVertical='top'
          />
          <View
            className='w-full my-3'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='items-center justify-center h-12 rounded-lg bg-jade'>
              <Pressable
                onPress={() => {
                  handleFeedback();
                }}
              >
                <Text className='text-lg font-bold text-white'>Done</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

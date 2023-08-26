import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import Checkbox from '../../components/CheckBox';
import { Feather } from '@expo/vector-icons';
import { ProgramService } from '../../services/programs';
import UserContext from '../../components/User';
import Button from '../../components/Button';
type props = {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  questions: { question: string; additionalInfo: string | null }[];
  programType: 'LISTENER' | 'FACILITATOR';
};
export default function StepThree({
  programType,
  setCurrentStep,
  questions,
}: props) {
  const { user, setUser } = useContext(UserContext);
  const [answers, setAnswers] = useState<string[]>(new Array(5).fill(''));
  const [is18, setIs18] = useState<boolean | null>(null);
  const handleSubmit = async () => {
    if (!is18) {
      alert('Please confirm that you have met our age restriction');
      return;
    }
    if (answers.includes('')) {
      alert('Please answer all questions');
      return;
    }
    const { data: respond } = await ProgramService.createProgram({
      userId: user.id,
      answers,
      type: programType,
    });
    if (!respond) return;
    setCurrentStep(4);
  };
  useEffect(() => {
    setAnswers([user.firstName, user.email, '', '', '']);
  }, [user]);
  return (
    <View style={{ backgroundColor: 'transparent' }} className='mb-4'>
      <View className='p-4 mb-4 rounded-xl'>
        <View className='relative'>
          <View className='w-full h-2 rounded-full bg-neutral-grey-200 opacity-30'></View>
          <View className='absolute w-full h-2 rounded-full bg-jade'></View>
        </View>

        <Text className='mt-2 mb-1 font-semibold text-storm'>Part 3/3</Text>
        <Text className='mb-2 text-xl font-semibold text-midnight-mosaic'>
          Final Step
        </Text>
        <Text className=' text-md text-storm'>
          You are almost there! Please complete the last part of the training,
          and the reviewing process will begin.
        </Text>
      </View>
      <View className='p-3 rounded-lg'>
        <TextInput
          value={answers[0]}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[0] = e.nativeEvent.text;
            setAnswers(newAnswers);
          }}
          className='h-6 text-storm text-[17px]'
          placeholder='Your Full Name (First Name, Last Name)'
        />
      </View>
      <View className='p-3 mt-4 rounded-lg'>
        <TextInput
          value={answers[1]}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[1] = e.nativeEvent.text;
            setAnswers(newAnswers);
          }}
          className='h-6 text-storm text-[17px]'
          placeholder='Your Email Address'
          keyboardType='email-address'
        />
      </View>
      <View className='p-4 my-4 rounded-xl'>
        <Text className='mb-2 text-lg font-semibold text-midnight-mosaic'>
          The Veor app user must be 18 years of age or older. Please confirm
          that you have met our age restriction.
        </Text>

        <View
          style={{ backgroundColor: 'transparent' }}
          className='flex flex-row items-center pr-5 mt-2'
        >
          <Checkbox
            value={is18 === true}
            onPress={() => setIs18(true)}
            checkedColor='jade'
            uncheckedColor='neutral-grey'
            style='rounded-full h-6 w-6 mr-2 p-1 flex flex-row items-center justify-center'
            icon={<Feather name='check' size={18} color='white' />}
          />
          <Text className='text-lg whitespace-pre-wrap text-storm'>
            Yes, I am 18 years of age or older.
          </Text>
        </View>
      </View>
      {questions.map((question, index) => (
        <View className='p-4 mb-4 rounded-xl' key={index}>
          <Text className='mt-2 mb-1 font-semibold text-storm'>
            Question {index + 1}
          </Text>
          <Text className='mb-2 text-lg font-semibold text-midnight-mosaic'>
            {question.question}
          </Text>
          {question.additionalInfo && (
            <Text className='mt-2 text-lg text-storm'>
              {question.additionalInfo}
            </Text>
          )}

          <TextInput
            value={answers[index + 2]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index + 2] = e.nativeEvent.text;
              setAnswers(newAnswers);
            }}
            className='p-4 mt-4 bg-neutral-grey-100 rounded-lg min-h-[200px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            placeholder={'Type your answer here...'}
            textAlignVertical='top'
          />
        </View>
      ))}
      <Button
        onPress={() => {
          handleSubmit();
        }}
        text='SUBMIT ANSWERS'
        textColor='text-white'
        backgroundColor='bg-jade'
      />
    </View>
  );
}

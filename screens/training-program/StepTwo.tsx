import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, TextInput, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Checkbox from '../../components/CheckBox';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../../components/User';

type props = {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  questions: { question: string; choices: string[]; correctAnswer: string }[];
  setRealQuestions: React.Dispatch<
    React.SetStateAction<
      {
        question: string;
        choices: string[];
        correctAnswer: string;
      }[]
    >
  >;
  reOderQuestions: (
    arr: {
      question: string;
      choices: string[];
      correctAnswer: string;
    }[]
  ) => {
    question: string;
    choices: string[];
    correctAnswer: string;
  }[];
  goToTop: () => void;
  programType: 'LISTENER' | 'FACILITATOR';
};
export default function StepTwo({
  setCurrentStep,
  questions,
  setRealQuestions,
  reOderQuestions,
  goToTop,
  programType,
}: props) {
  const { user } = useContext(UserContext);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    new Array(questions.length).fill('')
  );
  const [mode, setMode] = useState<'RESULT' | 'TEST'>('TEST');
  const [score, setScore] = useState(0);
  const [showingQuestion, setShowingQuestion] = useState<
    {
      question: string;
      choices: string[];
      correctAnswer: string;
    }[]
  >(questions);

  const handleSubmit = () => {
    if (selectedAnswers.includes('')) {
      alert('Please answer all questions');
      return;
    }
    goToTop();

    let correctAnswers = 0;
    const storeArr: {
      question: string;
      choices: string[];
      correctAnswer: string;
      selectedAnswer: string;
    }[] = [];
    questions.forEach((question, index) => {
      storeArr.push({ ...question, selectedAnswer: selectedAnswers[index] });
      if (question.correctAnswer === selectedAnswers[index]) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers * 10);
    AsyncStorage.setItem(
      `${programType}_${user.id}_MC`,
      JSON.stringify(storeArr)
    );
    setMode('RESULT');
  };

  const handleTryAgain = () => {
    if (score >= 70) {
      setCurrentStep(3);
    } else {
      setMode('TEST');
      setSelectedAnswers(new Array(questions.length).fill(''));
      const newQuestions = reOderQuestions(questions);
      setRealQuestions([...newQuestions]);
      setShowingQuestion([...newQuestions]);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem(`${programType}_${user.id}_MC`).then((value) => {
      const arr = JSON.parse(value || '[]');
      if (arr.length > 0) {
        setMode('RESULT');
        let correctAnswers = 0;
        const selectedAnswers: string[] = [];
        const questionArr: {
          question: string;
          choices: string[];
          correctAnswer: string;
        }[] = [];
        arr.forEach(
          (
            question: {
              question: string;
              choices: string[];
              correctAnswer: string;
              selectedAnswer: string;
            },
            index: number
          ) => {
            selectedAnswers.push(question.selectedAnswer);
            questionArr.push({
              question: question.question,
              choices: question.choices,
              correctAnswer: question.correctAnswer,
            });
            if (question.correctAnswer === selectedAnswers[index]) {
              correctAnswers++;
            }
            setScore(correctAnswers * 10);
            setShowingQuestion(questionArr);
            setSelectedAnswers(selectedAnswers);
          }
        );
      }
    });
  }, []);

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <View className='p-4 mb-4 rounded-xl'>
        <View className='relative'>
          <View className='w-full h-2 rounded-full bg-neutral-grey-200 opacity-30'></View>
          <View className='absolute w-2/3 h-2 rounded-full  bg-jade'></View>
        </View>

        <Text className='mt-2 mb-1 font-semibold text-storm'>Part 2/3</Text>
        <Text className='mb-2 text-xl font-semibold  text-midnight-mosaic'>
          Milestone Questions
        </Text>
        <Text className='mb-4  text-md text-storm'>
          Please complete the training video and take notes as needed.
        </Text>
      </View>
      {mode == 'TEST' &&
        showingQuestion.map((question, index) => (
          <View className='p-4 mb-4 rounded-xl' key={index}>
            <Text className='mt-2 mb-1 font-semibold text-storm'>
              Question {index + 1}
            </Text>
            <Text className='mb-2 text-lg font-semibold  text-midnight-mosaic'>
              {question.question}
            </Text>
            {question.choices.map((choice, idx) => (
              <View
                style={{ backgroundColor: 'transparent' }}
                className='flex flex-row items-start pr-5 mt-2'
                key={idx}
              >
                <Checkbox
                  value={selectedAnswers[index] == choice}
                  onPress={() => {
                    const newAnswers = [...selectedAnswers];
                    newAnswers[index] = choice;
                    setSelectedAnswers([...newAnswers]);
                  }}
                  checkedColor='jade'
                  uncheckedColor='neutral-grey'
                  style='rounded-full h-6 w-6 mr-2 p-1 flex flex-row items-center justify-center'
                  icon={<Feather name='check' size={18} color='white' />}
                />
                <Text className='text-lg whitespace-pre-wrap  text-storm'>
                  {choice}
                </Text>
              </View>
            ))}
          </View>
        ))}
      {mode == 'RESULT' && (
        <View style={{ backgroundColor: 'transparent' }}>
          <View className='p-4 mb-4 rounded-lg '>
            <Text className=' text-storm'>
              You will need 70 points to pass.{' '}
            </Text>
            <View className='flex flex-row items-end'>
              <Text
                className={
                  'text-2xl align-baseline font-semibold relative top-1 ' +
                  (score >= 70 ? 'text-jade' : 'text-cranberry')
                }
              >
                {score}
              </Text>
              <Text className='font-semibold  text-storm'>/100 points</Text>
            </View>
            <Pressable
              onPress={() => {
                handleTryAgain();
              }}
              className='items-center justify-center h-8 mt-4 rounded-full bg-jade w-20'
            >
              <Text className='font-bold text-white text-md'>
                {score >= 70 ? 'Next' : 'Try Again'}
              </Text>
            </Pressable>
          </View>
          {showingQuestion.map((question, index) => (
            <View className='p-4 mb-4 rounded-xl' key={index}>
              <Text className='mt-2 mb-1 font-semibold text-storm'>
                Question {index + 1}
              </Text>
              <Text className='mb-2 text-lg font-semibold  text-midnight-mosaic'>
                {question.question}
              </Text>
              {question.choices.map((choice, idx) => (
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='flex flex-row items-start pr-5 mt-2'
                  key={idx}
                >
                  <Checkbox
                    value={selectedAnswers[index] == choice}
                    onPress={() => {}}
                    checkedColor='neutral-grey-200'
                    uncheckedColor='neutral-grey'
                    style='rounded-full h-6 w-6 mr-2 p-1 flex flex-row items-center justify-center'
                    icon={<Feather name='check' size={18} color='white' />}
                  />
                  <Text
                    className={
                      'text-lg whitespace-pre-wrap ' +
                      (selectedAnswers[index] == choice
                        ? selectedAnswers[index] == question.correctAnswer
                          ? 'text-jade'
                          : 'text-cranberry'
                        : 'text-storm')
                    }
                  >
                    {choice}
                  </Text>
                </View>
              ))}
              {selectedAnswers[index] == question.correctAnswer ? (
                <View className='flex flex-row items-center mt-4'>
                  <Feather name='check' size={24} color='#41B89C' />
                  <Text className='ml-2 text-jade'>Correct</Text>
                </View>
              ) : (
                <View className='flex flex-row items-center mt-4'>
                  <Feather name='x' size={24} color='#DB5461' />
                  <Text className='ml-2 text-cranberry'>Incorrect</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      <View style={{ backgroundColor: 'transparent' }} className='h-16 my-4 '>
        <Button
          onPress={() => {
            if (mode == 'TEST') {
              handleSubmit();
            } else {
              setCurrentStep(3);
            }
          }}
          disable={mode == 'RESULT' && score < 70}
          text={mode == 'TEST' ? 'SUBMIT ANSWERS' : 'NEXT'}
          backgroundColor='bg-jade'
          textColor='text-white'
        />
      </View>
    </View>
  );
}

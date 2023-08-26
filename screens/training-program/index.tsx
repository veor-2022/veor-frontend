import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from '../../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  TextInput,
  Pressable,
  Image,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  HomeStackScreenProps,
  GroupStackScreenProps,
  UserStackScreenProps,
} from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { emotions } from '../../constants/emotions';
import Button from '../../components/Button';
import a from '../../services/axios';
import UserContext from '../../components/User';
import { Emotion, Topic } from 'prisma-enum';
import { capitalize, unScreamingSnakeCase } from '../../constants/helpers';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { ProgramService } from '../../services/programs';
import { Program } from '@prisma/client';

export default function TrainingProgram({
  navigation,
  route,
}:
  | HomeStackScreenProps<'ListenerTrainingProgram'>
  | GroupStackScreenProps<'FacilitatorTrainingProgram'>
  | UserStackScreenProps<'TrainingProgram'>) {
  const programType = route.params.type;
  const { user, setUser } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const ListenerMC = [
    {
      question: 'Which of the following is a core value of Active Listening?',
      choices: [
        'To find problems.',
        'To offer solutions.',
        'To share your story.',
        'To provide emotional support.',
      ],
      correctAnswer: 'To provide emotional support.',
    },
    {
      question:
        '"The goal of active listening is for the other person to be heard, validated, and inspired to solve their problem." Is this statement correct?',
      choices: ['Yes', 'No'],
      correctAnswer: 'Yes',
    },
    {
      question:
        'Which of the following best describes the benefits of Active Listening?',
      choices: [
        'Build open and trusting relationships.',
        'Create a safe and non-judgmental space to share.',
        'Empower the Listener to offer support and empathy.',
        'All of the above.',
      ],
      correctAnswer: 'All of the above.',
    },
    {
      question:
        'Which of the following is NOT a technique in Active Listening?',
      choices: [
        'Listen with full attention.',
        'Respond quickly.',
        'Ask open-ended questions.',
        'Withhold judgment.',
      ],
      correctAnswer: 'Respond quickly.',
    },
    {
      question: 'What is the purpose of reflecting on what you heard?',
      choices: [
        'To check if you understood the messages accurately. ',
        'To help the person feel validated and understood.',
        'Both A and B.',
        'None of the above.',
      ],
      correctAnswer: 'Both A and B.',
    },
    {
      question:
        'When the person you are listening to says, "My cousin came living with me last week. Since then, I have had to do extra chores. I\'m so pissed." What is an example of responding by mirroring?',
      choices: [
        '"You have had to do extra chores since your cousin arrived. You must be frustrated."',
        '"Please tell me more about what happened."',
        '"Pissed. Wow, that\'s awful."',
        '"I am so sorry to hear that.”',
      ],
      correctAnswer: '"Pissed. Wow, that\'s awful."',
    },
    {
      question:
        '"Withholding judgment means agreeing to the other person\'s point of view." Is this statement correct?',
      choices: ['Yes', 'No'],
      correctAnswer: 'No',
    },
    {
      question:
        'What should you do if the person you are listening to continues to share their story without giving you a chance to respond?',
      choices: [
        'Politely interrupt them and share your thoughts.',
        'Listen patiently without interrupting the person.',
        'Summarize what you have heard while the person is sharing',
        "Shift the person's focus by indicating you have similar experiences.",
      ],
      correctAnswer: 'Listen patiently without interrupting the person.',
    },
    {
      question:
        'Which of the following is NOT appropriate if the person you are listening to asks for your advice?',
      choices: [
        'Politely let the person know Listeners are not allowed to give advice.',
        'Share your personal experience as ideas and suggestions.',
        'Offer thoughtful advice with actionable steps.',
        'Encourage the person to find their solution.',
      ],
      correctAnswer: 'Offer thoughtful advice with actionable steps.',
    },
    {
      question:
        'In the chat example, which of the following did the Listener NOT do when she shared her experience?',
      choices: [
        'Show empathy.',
        'Focus on self-reflection.',
        'Present actionable ideas.',
        'Blame.',
      ],
      correctAnswer: 'Blame.',
    },
  ];
  const FacilitatorMC = [
    {
      question:
        'Which of the following about peer support groups is INCORRECT?',
      choices: [
        'They offer a channel to share personal experiences and feelings.',
        'They are facilitated by professionals.',
        'They encourage a sense of community.',
        'They are a source of empathetic understanding.',
      ],
      correctAnswer: 'They are facilitated by professionals.',
    },
    {
      question: 'What is the role of a facilitator?',
      choices: [
        'To ensure a safe and supportive group environment.',
        'To model effective communication and foster group discussions.',
        'To encourage progress both individually and as a group.',
        'All of the above.',
      ],
      correctAnswer: 'All of the above.',
    },
    {
      question:
        'Which of the following is NOT an example of ensuring a safe and supportive group environment?',
      choices: [
        'Invite new members to participate in group discussions.',
        'Remove disruptive members if they are unresponsive to feedback and corrections.',
        'Use group boundaries as barriers to protect your leadership.',
        'Apply group boundaries with understanding and compassion.',
      ],
      correctAnswer:
        'Use group boundaries as barriers to protect your leadership.',
    },
    {
      question:
        "Which of the following should be a facilitator's top priority?",
      choices: [
        'Self-Care',
        'Problem Solving',
        'Effective Listening',
        'Managing Disruptive Members',
      ],
      correctAnswer: 'Self-Care',
    },
    {
      question:
        'Which of the following is NOT a part of self-awareness and emotion regulation?',
      choices: [
        'Recognize you are having emotional responses when they occur.',
        'Accept your emotional responses.',
        'Justify your emotional responses.',
        'Manage the intensities of your emotional responses.',
      ],
      correctAnswer: 'Justify your emotional responses.',
    },
    {
      question:
        '"Active Listening is about listening to understand." Is this statement correct?',
      choices: ['Yes', 'No'],
      correctAnswer: 'Yes',
    },
    {
      question:
        '"Problem-solving enables you to explore issues and find possible solutions." Is this statement correct?',
      choices: ['Yes', 'No'],
      correctAnswer: 'Yes',
    },
    {
      question:
        'What is the purpose of using I-messages in a conflict situation?',
      choices: [
        'To pinpoint the cause of the conflict.',
        'To address accountability.',
        'To express emotions without blaming.',
        'To provide possible solutions to the conflict.',
      ],
      correctAnswer: 'To express emotions without blaming.',
    },
    {
      question:
        'Which of the following is a way to improve facilitator skills?',
      choices: [
        'Be open to feedback and suggestions.',
        'Embrace your mistakes.',
        'Learn from other facilitators.',
        'All of the above.',
      ],
      correctAnswer: 'All of the above.',
    },
    {
      question:
        'Which of the following benefits of co-facilitation is particular to the facilitators?',
      choices: [
        'Capitalize on diversity.',
        'Create stability.',
        'Accommodate more group members.',
        'Reduce facilitating stresses.',
      ],
      correctAnswer: 'Reduce facilitating stresses.',
    },
  ];
  const ListenerSA = [
    {
      question:
        'Please use reflection and open-ended questions in response to this message:',
      additionalInfo:
        '"My partner checked my phone yesterday without even asking. It really hurts my feeling."',
    },
    {
      question: 'Please provide an appropriate response to this message:',
      additionalInfo:
        '"My partner and I have been in a toxic relationship lately, and our communication never went smoothly. Can you give me some advice?"',
    },
    {
      question:
        'Please tell us what motivates you to become a Listener on the Veor platform.',
      additionalInfo: null,
    },
  ];
  const FacilitatorSA = [
    {
      question:
        'Please name three items you would include in the list of group guidelines.',
      additionalInfo: null,
    },
    {
      question:
        'Please provide an appropriate response to the message from this group member.',
      additionalInfo:
        ' "I know you are good people, and I don\'t want to hurt any of you. But please forget about me."',
    },
    {
      question:
        'Please tell us what motivates you to become a facilitator on the Veor platform.',
      additionalInfo: null,
    },
  ];
  const scrollRef = useRef<ScrollView>(null);

  const reOderQuestions = (
    arr: { question: string; choices: string[]; correctAnswer: string }[]
  ) => {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  };
  const [realQuestions, setRealQuestions] = useState(
    reOderQuestions(programType == 'LISTENER' ? ListenerMC : FacilitatorMC)
  );

  const goToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    scrollRef.current;
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }, [currentStep]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const { data: program } = await ProgramService.getUserPrograms({
        userId: user.id,
      });
      if (program.length > 0) {
        const currentProgram = program.find(
          (p: Program) => p.type === programType
        );
        if (currentProgram) {
          setCurrentStep(4);
        }
      }
      setLoading(false);
    };
    fetchProgram();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: 'transparent',
      }}
      enabled={Platform.OS === 'ios'}
      behavior='position'
      keyboardVerticalOffset={0}
    >
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='pt-0'
      >
        {loading ? null : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='px-5'
            scrollsToTop
            ref={scrollRef}
          >
            {currentStep === 1 && (
              <StepOne
                userId={user.id}
                programType={programType}
                setCurrentStep={setCurrentStep}
                loading={loading}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                setCurrentStep={setCurrentStep}
                questions={realQuestions}
                setRealQuestions={setRealQuestions}
                reOderQuestions={reOderQuestions}
                goToTop={goToTop}
                programType={programType}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                programType={programType}
                setCurrentStep={setCurrentStep}
                questions={
                  programType == 'LISTENER' ? ListenerSA : FacilitatorSA
                }
              />
            )}
            {currentStep === 4 && (
              <View
                style={{ backgroundColor: 'transparent' }}
                className='h-screen'
              >
                <Image
                  className='mt-10 mx-auto'
                  source={require('../../assets/images/complete_training.png')}
                />
                <Text className='mt-8 text-midnight-mosaic font-semibold text-2xl'>
                  Thank you for completing the training!
                </Text>
                <Text className='mt-2 text-storm mb-8'>
                  What's next? Our team will begin the reviewing process, and we
                  will reach out to you within 48 hours with the final decision
                  and feedback. Please check your Spam if you do not see our
                  email.{' '}
                </Text>
                <Button
                  text='DONE'
                  onPress={() => {
                    navigation.goBack();
                  }}
                  textColor='text-white'
                  backgroundColor='bg-jade'
                />
              </View>
            )}
          </ScrollView>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

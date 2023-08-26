import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import Button from '../components/Button';
import { Text, View } from '../components/Themed';
import { groupImageArr } from '../constants/categoryImages';
import { GroupStackScreenProps } from '../types';

export default function GroupsScreen({
  navigation,
}: GroupStackScreenProps<'GroupsHome'>) {
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative px-6 overflow-visible mt-8'
        style={{ backgroundColor: 'transparent' }}
      >
        <View style={{ backgroundColor: 'transparent' }} className='mb-6'>
          <Button
            leftIconBackgroundColor='bg-white'
            backgroundColor='bg-jade'
            textColor='text-white'
            leftIconColor='#41B89C'
            text='Create a Group'
            leftIcon='add'
            rightIcon='chevron-forward-outline'
            rightIconColor='white'
            onPress={() => navigation.navigate('CreateGroup', {})}
          />
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <Button
            onPress={() => {
              navigation.navigate('FacilitatorTrainingProgram', {
                type: 'FACILITATOR',
              });
            }}
            leftIconBackgroundColor='bg-jade'
            text='Become a Facilitator'
            leftIcon='ribbon-outline'
            rightIcon='chevron-forward-outline'
          />
        </View>
        <Text className='my-8 text-2xl font-semibold text-midnight-mosaic'>
          Browse by Category
        </Text>
        <View
          style={{ backgroundColor: 'transparent' }}
          className='flex-row flex-wrap justify-between pt-8 gap-y-12 pb-4'
        >
          {groupImageArr.map((group, index) => (
            <Pressable
              onPress={() =>
                navigation.navigate('GroupCategoryList', {
                  category: group.name,
                })
              }
              key={index}
              className='bg-white h-[100px] mx-1 w-[45%] relative flex-row justify-center rounded-2xl mb-8'
            >
              <View
                className='absolute bottom-2'
                style={{ backgroundColor: 'transparent' }}
              >
                <Image source={group.image} className=' w-32 h-32' />
                <Text className=' text-storm font-semibold text-md text-center mt-2 mb-1'>
                  {group.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import { Topic } from 'prisma-enum';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Panel from '../../components/Panel';
import { Text, View } from '../../components/Themed';
import { groupImageArr } from '../../constants/categoryImages';
import { UserStackScreenProps } from '../../types';
import { topics } from '../../constants/topics';
import GroupService from '../../services/group';
import LoadingStatusContext from '../../components/LoadingStatus';

export default function GroupCategoryScreen({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupCategory'>) {
  const { setLoadingStatus } = React.useContext(LoadingStatusContext);
  const handleEditGroup = async (newTopic: Topic) => {
    setLoadingStatus({ isLoading: true });
    const { data } = await GroupService.editGroupInfo({
      groupId: params.id,
      data: { ...params, topic: newTopic },
    });
    if (!data) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
    setLoadingStatus({ isLoading: false });
    navigation.goBack();
    navigation.replace('EditGroup', {
      ...params,
      topic: newTopic,
    });
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4 rounded-lg'>
          <Panel
            title='Category'
            description='Select a category that best describes your group.'
          />
        </View>
        <View className='pb-10' style={{ backgroundColor: 'transparent' }}>
          {groupImageArr.map((item, index) => (
            <TouchableOpacity
              key={index}
              className='w-full mb-4 bg-white rounded-lg'
              onPress={() => {
                handleEditGroup(item.name.toUpperCase() as Topic);
              }}
            >
              <View className='flex-row items-center p-2 rounded-lg'>
                <View className='w-10 h-10 rounded-lg'>
                  <Image
                    source={topics.find((_) => _.name === item.name)?.image}
                    style={{ height: 40, width: 40 }}
                  />
                </View>
                <Text className='ml-4 text-lg text-midnight-mosaic'>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

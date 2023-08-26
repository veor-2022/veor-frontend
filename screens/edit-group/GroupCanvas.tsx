import classNames from 'classnames';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, Alert } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import GroupService from '../../services/group';
import { View } from '../../components/Themed';
import { canvasImages } from '../../constants/canvasImages';
import { UserStackScreenProps } from '../../types';

export default function GroupCanvas({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupCanvas'>) {
  const [selectedImage, setSelectedImage] = useState(params.canvas || 0);
  const handleEditGroup = async () => {
    if (!selectedImage) {
      return Alert.alert('Please select an image');
    }
    const { data } = await GroupService.editGroupInfo({
      groupId: params.id,
      data: { ...params, canvas: selectedImage },
    });
    if (!data) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
    navigation.goBack();
    navigation.replace('EditGroup', {
      ...params,
      canvas: selectedImage,
    });
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <View
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4 rounded-lg'>
          <Panel title='Canvas' description='Select an image for your group.'>
            <FlatList
              scrollEnabled={false}
              data={canvasImages}
              renderItem={({ index, item }) => (
                <Pressable
                  onPress={() => setSelectedImage(index)}
                  key={index}
                  className={classNames(
                    'm-1 flex-1 aspect-square rounded-2xl',
                    index === selectedImage ? 'border-4 border-jade' : 'p-1'
                  )}
                >
                  <Image source={item} className='w-full h-full rounded-xl' />
                </Pressable>
              )}
              numColumns={3}
              className='-m-2'
            />
          </Panel>
        </View>
        <View className='mt-4 rounded-lg bg-jade'>
          <Button
            text='Done'
            onPress={() => {
              handleEditGroup();
            }}
            textColor='text-white'
            backgroundColor='bg-jade'
          />
        </View>
      </View>
    </LinearGradient>
  );
}

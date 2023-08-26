import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import UserAvatar from '../../components/UserAvatar';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserStackScreenProps } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import _a from '../../services/axios';
import axios from 'axios';
import { FileService } from '../../services/file';
import { UserService } from '../../services/user';
import LoadingStatusContext from '../../components/LoadingStatus';
import { decode } from 'base64-arraybuffer';

export default function EditAvatar({
  navigation,
}: UserStackScreenProps<'EditAvatar'>) {
  const [image, setImage] = useState('');
  const { user, setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const pickImage = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      // No permissions request is necessary for launching the image library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw 'Please grant camera roll permissions to upload a photo.';
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.cancelled && result.base64) {
        const fileType =
          result.uri.split('.')[result.uri.split('.').length - 1];
        const { data: response } = await FileService.createAvatarLink(
          user.id + '_avatar' + '.' + fileType
        );
        const arrayBuffer = decode(result.base64);

        await axios.put(response.uploadURL, arrayBuffer, {
          headers: {
            'Content-Type': 'image/' + fileType,
            'x-amz-acl': 'public-read',
          },
        });
        const { data } = await UserService.updateUserInfo({
          userId: user.id,
          data: { profilePicture: response.publicURL },
        });
        if (!data) {
          throw 'Error while updating profile picture';
        }
        setUser({ ...user, profilePicture: response.publicURL });
      }
      setLoadingStatus({ isLoading: false });
    } catch (err) {
      setLoadingStatus({ isLoading: false });
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='p-5 mt-3 rounded-xl'>
          <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
            Upload a Picture
          </Text>
          <Text className='text-storm text-[17px] '>
            A friendly picture of you helps anyone you want to support knows
            they are talking to a real person.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            pickImage();
          }}
          style={{ backgroundColor: 'transparent' }}
          className='relative w-32 h-32 m-auto mt-8'
        >
          <View className='absolute bottom-0 right-0 z-50 flex flex-row items-center justify-center w-8 h-8 rounded-full bg-jade'>
            <AntDesign name='camerao' size={20} color='white' />
          </View>
          <View className='m-auto' style={{ backgroundColor: 'transparent' }}>
            <UserAvatar
              size={60}
              name={user.nickname || user.firstName}
              url={user.profilePicture}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

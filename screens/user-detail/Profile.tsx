import React, { useEffect, useContext, useState } from 'react';
import { Alert, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import UserAvatar from '../../components/UserAvatar';
import dayjs from 'dayjs';
import { EnumConvertToTopics } from '../../constants/topics';
import { tagToColor } from '../../constants/tags';
import { UserService } from '../../services/user';
import { Review } from '@prisma/client';
import StarRating from 'react-native-star-rating';

export default function UserDetailListenerProfile() {
  const { user, setUser } = useContext(UserContext);
  const [star, setStar] = useState(5);
  const initBadgeStatus = {
    isListener: false,
    isFacilitator: false,
    isHost: false,
  };
  const [badgeStatus, setBadgeStatus] = useState<{
    isListener: boolean;
    isFacilitator: boolean;
    isHost: boolean;
  }>(initBadgeStatus);

  const fetchUserById = async () => {
    const { data: response } = await UserService.fetchUserById(user.id);
    if (!response) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.)');
    }
    if (
      response.listenerProfile.reviews &&
      response.listenerProfile.reviews.length > 0
    ) {
      const total = response.listenerProfile.reviews.reduce(
        (acc: number, cur: Review) => acc + cur.rating,
        0
      );
      setStar(total / response.listenerProfile.reviews.length);
    }
    setUser(response);
  };
  const fetchUserBadgeStatus = async () => {
    const { data: response } = await UserService.checkUserBadge(user.id);
    setBadgeStatus(response);
  };
  useEffect(() => {
    fetchUserById();
    fetchUserBadgeStatus();
  }, []);

  return (
    user.listenerProfile && (
      <View
        className='px-4 pb-14 mt-4'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='flex flex-col items-center rounded-lg'>
          <View className='my-4 mb-8 '>
            <UserAvatar
              size={60}
              url={user.profilePicture}
              name={user.nickname || user.firstName}
            />
          </View>

          <View className='relative -top-[20px] flex flex-col items-center'>
            <Text className='text-2xl font-semibold text-midnight-mosaic'>
              {user.nickname || user.firstName}
            </Text>
            <Text>Joined on {dayjs(user.joinDate).format('MMM D, YYYY')}</Text>
            <View className='flex flex-row items-center py-2'>
              {badgeStatus.isListener && (
                <Image
                  className='w-5 h-5 rounded-md'
                  source={require('../../assets/images/adaptive-icon.png')}
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
              {badgeStatus.isFacilitator && (
                <Image
                  className='w-5 h-5 ml-3'
                  source={require('../../assets/images/temp_badge1.png')}
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
              {badgeStatus.isHost && (
                <Image
                  className='w-5 h-5 ml-3'
                  source={require('../../assets/images/temp_badge2.png')}
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
            </View>

            <View className='flex flex-row items-center justify-center'>
              <StarRating
                emptyStarColor='#DADADA'
                fullStarColor='#FFD700'
                starSize={20}
                disabled={true}
                maxStars={5}
                rating={star}
              />
            </View>
          </View>
        </View>
        {user.listenerProfile?.topics.length > 0 && (
          <View className='p-4 mt-6 rounded-lg'>
            <Text className='mb-3 text-xl font-semibold text-midnight-mosaic'>
              Topics
            </Text>
            <View className='flex flex-row flex-wrap'>
              {user.listenerProfile?.topics.map((item, index) => (
                <View
                  key={'topic' + index}
                  className='flex flex-row items-center mb-2 mr-2'
                >
                  <View
                    className={'h-7 w-7 rounded-md ' + tagToColor[item]}
                  ></View>
                  <Text className='ml-2 text-lg font-semibold text-midnight-mosaic'>
                    {EnumConvertToTopics[item]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.listenerProfile?.about && (
          <View className='p-4 mt-6 rounded-lg'>
            <Text className='mb-3 text-xl font-semibold text-midnight-mosaic'>
              About
            </Text>
            <Text className='text-lg text-midnight-mosaic'>
              {user.listenerProfile?.about}
            </Text>
          </View>
        )}
        {user.listenerProfile.reviews &&
          user.listenerProfile.reviews.length > 0 && (
            <View className='p-4 mt-6 mb-10 rounded-lg'>
              <View className='flex flex-row items-center justify-between mb-3'>
                <Text className='text-xl font-semibold text-midnight-mosaic'>
                  Reviews
                </Text>
                <View className='flex flex-row items-center justify-center gap-2'>
                  <StarRating
                    emptyStarColor='#DADADA'
                    fullStarColor='#FFDB92'
                    starSize={20}
                    disabled={true}
                    maxStars={5}
                    rating={star}
                    containerStyle={{ marginTop: 9 }}
                  />
                  <Text className='ml-1 text-storm'>
                    ({user.listenerProfile.reviews.length || 0})
                  </Text>
                </View>
              </View>
              {user.listenerProfile.reviews &&
              user.listenerProfile.reviews.length
                ? user.listenerProfile.reviews.map((item, index) => (
                    <View
                      key={'review' + index}
                      className='pt-4 mb-4 border border-b-0 border-l-0 border-r-0 border-t-neutral-grey'
                    >
                      <View className='flex flex-row justify-between'>
                        <View className='flex flex-row'>
                          <UserAvatar
                            name={item.user.nickname || item.user.firstName}
                            size={20}
                            url={item.user.profilePicture}
                          />
                          <View className='ml-2'>
                            <Text className='text-lg font-semibold leading-5 text-midnight-mosaic'>
                              {item.user.nickname || item.user.firstName}
                            </Text>
                            <View style={{ backgroundColor: 'transparent' }}>
                              <StarRating
                                emptyStarColor='#DADADA'
                                fullStarColor='#FFDB92'
                                starSize={15}
                                disabled={true}
                                maxStars={5}
                                rating={item.rating}
                                containerStyle={{
                                  marginTop: 4,
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                }}
                              />
                            </View>
                          </View>
                        </View>
                        <Text className=' text-storm'>
                          {dayjs(item.createAt).format('MM-DD-YYYY')}
                        </Text>
                      </View>
                      <Text className=' text-midnight-mosaic mt-3 text-[15px]'>
                        {`“${item.content}”`}
                      </Text>
                    </View>
                  ))
                : null}
            </View>
          )}
      </View>
    )
  );
}

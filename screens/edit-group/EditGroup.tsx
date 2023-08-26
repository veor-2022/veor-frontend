import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import Button from '../../components/Button';
import { View } from '../../components/Themed';
import { fields } from '../../constants/editGroupFields';
import { UserStackScreenProps } from '../../types';
import UserContext from '../../components/User';
import GroupService from '../../services/group';
import { ProgramService } from '../../services/programs';
import { Program } from '@prisma/client';
import { User } from '@prisma/client';

export default function EditGroup({
  navigation,
  route: { params },
}: UserStackScreenProps<'EditGroup'>) {
  const { user } = useContext(UserContext);
  const [hasPassFacilitator, setHasPassFacilitator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupData, setGroupData] = useState(params);
  const [coFacilitators, setCoFacilitators] = useState<User[]>([]);
  const getUserPrograms = async () => {
    const { data } = await ProgramService.getUserPrograms({ userId: user.id });
    const _isFacilitator =
      data.find(
        (program: Program) =>
          program.type === 'FACILITATOR' && program.status == 'ACCEPTED'
      ) !== undefined;
    if (!_isFacilitator) {
      params = { ...params, public: false };
      setGroupData(params);
    }
    setHasPassFacilitator(_isFacilitator);
  };
  const getGroupMembers = async () => {
    const { data: res } = await GroupService.getGroupInfoById({
      groupId: params.id,
    });
    res.members.forEach((member: any) => {
      if (member.user.id === user.id && member.status === 'FACILITATOR') {
        setIsAdmin(true);
      }
      if (member.status === 'CO_FACILITATOR') {
        setCoFacilitators((prev) => [...prev, member.user.id]);
      }
    });
  };
  useEffect(() => {
    getGroupMembers();
    getUserPrograms();
  }, [user]);

  const displayFields: {
    [key: string]: string;
  } = {
    Title: 'Name',
    Topic: 'Category',
    Canvas: 'Canvas',
    Public: 'Visibility',
    Description: 'Description',
    Guidelines: 'Guidelines',
    Members: 'Members',
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        {fields.map((field, index) => {
          if (field.name === 'Public' && !(isAdmin && hasPassFacilitator)) {
            return null;
          }
          return (
            <View
              style={{ backgroundColor: 'transparent' }}
              className='mb-3'
              key={index}
            >
              <Button
                type='SECTION'
                leftIconBackgroundColor={
                  groupData[field.name.toLowerCase() as keyof typeof params] ===
                  undefined
                    ? 'bg-neutral-grey-200'
                    : 'bg-jade'
                }
                text={displayFields[field.name]}
                leftIcon={
                  groupData[field.name.toLowerCase() as keyof typeof params] ===
                  undefined
                    ? 'close-outline'
                    : 'checkmark-outline'
                }
                rightIcon='chevron-forward-outline'
                // @ts-ignore
                onPress={() => navigation.navigate(field.route, params)}
              />
            </View>
          );
        })}
        <View style={{ backgroundColor: 'transparent' }} className='mb-16'>
          {isAdmin && (
            <Button
              type='SECTION'
              leftIconBackgroundColor={'bg-jade'}
              text={'Co-Facilitator'}
              leftIcon={'checkmark-outline'}
              rightIcon='chevron-forward-outline'
              onPress={() =>
                navigation.navigate('GroupFacilitators', { groupId: params.id })
              }
            />
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

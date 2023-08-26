import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from './Themed';

export interface LoaderProps {
  loading: boolean;
}

export default function Loader({ loading }: LoaderProps) {
  return (
    <>
      {loading ? (
        <View
          className='h-screen absolute w-full opacity-30'
          style={{ zIndex: 100 }}
        >
          <View
            className=' bg-neutral-grey h-full w-full absolute'
            style={{ zIndex: 100 }}
          ></View>
        </View>
      ) : null}
      {loading ? (
        <View
          className='absolute w-full h-screen flex justify-center items-center'
          style={{ backgroundColor: 'transparent', zIndex: 999 }}
        >
          <ActivityIndicator
            size='large'
            color='#41bb9c'
            className='p-4 rounded-md bg-wizard-white opacity-80'
            style={{ zIndex: 1000 }}
          />
        </View>
      ) : null}
    </>
  );
}

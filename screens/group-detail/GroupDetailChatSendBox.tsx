import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Modal,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { View } from '../../components/Themed';

export default function GroupDetailChatSendBox({
  setAndroidKeyboardOffset,
}: {
  setAndroidKeyboardOffset: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [input, setInput] = useState('');
  const [inputPressed, setInputPressed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSendMessage = () => {
    if (!input) return;
    setInput('');
    DeviceEventEmitter.emit('groupChat.sendMsg', input);
  };
  return (
    <View
      className='absolute bg-neutral-grey-100 h-24 w-full pt-4 px-4'
      style={{
        bottom: Platform.OS === 'ios' ? 0 : 0,
      }}
    >
      <TextInput
        onFocus={() => {
          setAndroidKeyboardOffset(45);
        }}
        onBlur={() => {
          setAndroidKeyboardOffset(0);
        }}
        multiline
        className='bg-white text-xl p-3 border-2 h-14 border-white rounded-xl text-midnight-mosaic pr-12'
        placeholder='Type your message here...'
        value={input}
        onChange={(e) => setInput(e.nativeEvent.text)}
      />
      <Pressable
        className=' absolute top-6 right-6 bg-jade p-2 rounded-xl w-10'
        disabled={!input}
        onPress={() => {
          handleSendMessage();
        }}
      >
        <Ionicons name='arrow-up-sharp' size={24} color='white' />
      </Pressable>
    </View>
  );
}

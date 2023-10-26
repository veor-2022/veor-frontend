import { LinearGradient } from "expo-linear-gradient";
import { Emotion, Topic } from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import Button from "../components/Button";
import { Text, View } from "../components/Themed";
import UserContext from "../components/User";
import a from "../services/axios";
import { emotions, emotionColors } from "../constants/emotions";
import { capitalize, unScreamingSnakeCase } from "../constants/helpers";
import { HomeStackScreenProps, UserStackScreenProps } from "../types";

export default function CreateEmotionScreen({
  navigation,
  route,
}:
  | HomeStackScreenProps<"CreateEmotion">
  | UserStackScreenProps<"CreateEmotion">) {
  const currentEmotion = route.params.emotion;
  const [selectTags, setSelectTags] = useState<Topic[]>([]);
  const [notes, setNotes] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Object(emotionColors)[currentEmotion.toUpperCase()][0],
      },
    });
  }, []);

  const addTag = (tag: Topic) => {
    const idx = selectTags.indexOf(tag);
    const temp = selectTags;
    if (idx == -1) {
      temp.push(tag);
    } else {
      temp.splice(idx, 1);
    }
    setSelectTags([...temp]);
  };

  const handleSubmit = async () => {
    const { data: response } = await a.post("/checkIns", {
      notes,
      tags: selectTags,
      emotion: currentEmotion,
      user: user.id,
    });
    if (!response) return;
    setUser({ ...user, checkIns: [...user.checkIns, response] });
    navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={[
        Object(emotionColors)[currentEmotion.toUpperCase()][0],
        Object(emotionColors)[currentEmotion.toUpperCase()][1],
      ]}
      className="h-full pt-0"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled={Platform.OS === "ios"}
        keyboardVerticalOffset={100}
      >
        <ScrollView className="px-5">
          <View
            className="flex flex-row items-center justify-center w-full mb-6"
            style={{ backgroundColor: "transparent" }}
          >
            <View className="h-28 w-28 rounded-[16px] justify-center items-center bg-white">
              <Image
                className="relative left-1 w-18"
                source={emotions[currentEmotion as Emotion]}
              />
              <Text className="text-storm font-bold text-[17px]">
                {capitalize(currentEmotion)}
              </Text>
            </View>
          </View>
          <Text className="mb-4 text-xl font-bold text-midnight-mosaic">
            Add Tags
          </Text>
          <View
            className="flex flex-row flex-wrap mb-6"
            style={{ backgroundColor: "transparent" }}
          >
            {Object.keys(Topic).map((tag, idx) => (
              <Pressable
                onPress={() => addTag(tag as Topic)}
                key={idx}
                className={
                  selectTags.includes(tag as Topic)
                    ? "rounded-full px-5 py-2 mr-1 mb-2 bg-jade "
                    : "rounded-full px-5 py-2 mr-1 mb-2 border-neutral-grey border bg-white"
                }
              >
                <Text
                  className={
                    selectTags.includes(tag as Topic)
                      ? "text-white text-[14px] "
                      : "text-midnight-mosaic text-[14px] font-[500]"
                  }
                >
                  {unScreamingSnakeCase(tag, "-")}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-2 text-xl font-bold text-midnight-mosaic">
            Add a Note
          </Text>
          <TextInput
            className="p-4 mb-8 bg-white rounded-lg min-h-[100px] text-midnight-mosaic"
            multiline
            numberOfLines={10}
            placeholder="What's on your mind?"
            onChangeText={setNotes}
            textAlignVertical="top"
          />
          <View className="mb-10 rounded-lg bg-jade">
            <Button
              text="Done"
              textColor="text-white"
              backgroundColor="bg-jade"
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

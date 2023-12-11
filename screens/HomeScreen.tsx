import { Ionicons } from "@expo/vector-icons";
import { ChatRequest, CheckIn, Program } from "@prisma/client";
import { StackActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Emotion } from "prisma-enum";
import React, { useContext, useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ChatStatusContext from "../components/ChatStatus";
import CheckInPill from "../components/CheckInPill";
import { Text, View } from "../components/Themed";
import UserContext from "../components/User";
import { groupImageArr } from "../constants/categoryImages";
import { emotions } from "../constants/emotions";
import { capitalize } from "../constants/helpers";
import { ChatService } from "../services/chat";
import { UserService } from "../services/user";
import { HomeStackScreenProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { ProgramService } from "../services/programs";
import LoadingStatusContext from "../components/LoadingStatus";

const todayDate = new Date();
todayDate.setHours(0);
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);
const today = todayDate.getTime();

export default function HomeScreen({
  navigation,
  route,
}: HomeStackScreenProps<"HomeScreen">) {
  const isFocused = useIsFocused();
  const { user, setUser } = useContext(UserContext);
  const chatStatusCtx = useContext(ChatStatusContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [todaysCheckIns, setTodayCheckIns] = React.useState<CheckIn[]>([]);
  const [notifications, setNotifications] = React.useState<{
    notifications: [];
    requestsReceived: [];
    requestsSent: [];
  } | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    await UserService.fetchUserById(user.id)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setUser(data);
        const _todaysCheckIns = data.checkIns.filter((checkIn: CheckIn) => {
          return new Date(checkIn.takenAt).getTime() >= today;
        });
        if (_todaysCheckIns.length > 0) {
          setTodayCheckIns([_todaysCheckIns[_todaysCheckIns.length - 1]]);
        }
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const fetchListenerRequest = async (
    tempStatus: "NONE" | "LISTENER" | "MATCHING" | "MATCHED" | "REQUESTS"
  ): Promise<"NONE" | "LISTENER" | "MATCHING" | "MATCHED" | "REQUESTS"> => {
    return ChatService.getOneOnOneChatRequest()
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return "NONE";
        }
        if (data.chatRoom.length <= 0) {
          chatStatusCtx.setPendingChatCount(data.chatRoom.length);
          return "NONE";
        }
        if (chatStatusCtx.acceptChat && user.listenerProfile !== null) {
          chatStatusCtx.setPendingChatCount(data.chatRoom.length);
          return "LISTENER";
        }
        return tempStatus;
      })
      .catch((err) => {
        return tempStatus;
      });
  };

  const fetchLatestChatStatus = async () => {
    let tempStatus = chatStatusCtx.chatStatus.status;
    UserService.fetchUserLatestChatRequest()
      .then((res) => res.data)
      .then(async (data: ChatRequest) => {
        if (!data) {
          if (user.listenerProfile !== null) {
            return (tempStatus = await fetchListenerRequest(tempStatus));
          }
          return "NONE";
        }
        if (data.chatId === null) {
          chatStatusCtx.setChatStatusId(data.id);
          return "MATCHING";
        } else {
          chatStatusCtx.setChatStatusId(data.id);
          chatStatusCtx.setHideNavBar(true);
          return "MATCHED";
        }
      })
      .then((tempStatus) => {
        if (tempStatus !== "MATCHED") {
          chatStatusCtx.setHideNavBar(false);
        }
        chatStatusCtx.setChatStatus({ status: tempStatus });
      })
      .catch((err) => {
        return;
      });
  };

  // fetch latest chat status every 5 seconds
  let interval: NodeJS.Timeout;
  useEffect(() => {
    interval = setInterval(() => {
      if (user.id !== "") {
        fetchLatestChatStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isFocused) {
        const res = await UserService.fetchNotifications(user.id);
        setNotifications(res.data);
      }
    };
    fetchNotifications();
  }, [isFocused]);

  const totalNotificationsNum = notifications
    ? notifications.notifications.length + notifications.requestsReceived.length
    : 0;
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={["rgba(227, 242, 253, 0.4)", "rgba(229, 217, 242, 0.4)"]}
      className="h-full"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={"relative " + (Platform.OS === "ios" ? "pt-8" : "pt-0")}
        style={{ backgroundColor: "transparent" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          className="flex flex-row justify-between pt-10"
          style={{ backgroundColor: "transparent" }}
        >
          <View
            className="w-[60px]"
            style={{ backgroundColor: "transparent" }}
          ></View>
          <View
            className="flex-row justify-center flex-1"
            style={{ backgroundColor: "transparent" }}
          >
            <Image
              className=""
              style={{ width: 70, height: 31 }}
              source={require("../assets/images/logo-transparent.png")}
            />
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate("Notifications");
            }}
            className="w-[40px] h-[40px] flex flex-row justify-center items-center rounded-md mr-7 bg-white"
            style={{
              overflow: "visible",
              zIndex: 10,
            }}
          >
            {totalNotificationsNum ? (
              <View className="absolute z-20 w-4 h-4 rounded-full -top-1 -right-1 bg-cranberry">
                <Text className="text-center text-white">
                  {totalNotificationsNum}
                </Text>
              </View>
            ) : undefined}
            <Ionicons size={24} name="notifications-outline" />
          </Pressable>
        </View>

        <View style={{ backgroundColor: "transparent" }} className="mt-8 ml-7">
          <Text className="text-[17px] text-storm font-semibold">
            Welcome, {user.nickname || user.firstName}!
          </Text>

          <Text className="mt-1 text-2xl font-semibold  text-midnight-mosaic">
            {todaysCheckIns.length
              ? "Latest Check-In"
              : "How are you feeling today?"}
          </Text>
        </View>

        {todaysCheckIns.length ? (
          <View style={{ backgroundColor: "transparent" }}>
            {todaysCheckIns.map((checkIn) => (
              <CheckInPill
                {...checkIn}
                key={checkIn.id}
                onPress={() => {
                  navigation.getParent()?.navigate("Root", {
                    screen: "User",
                    params: {
                      screen: "UserHome",
                      params: { isShowModal: true },
                    },
                  });
                }}
              />
            ))}
          </View>
        ) : (
          <View
            style={{ backgroundColor: "transparent" }}
            className="flex flex-row flex-wrap gap-4 px-5 pt-6"
          >
            <FlatList
              scrollEnabled={false}
              data={Object.keys(emotions)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreateEmotion", { emotion: item });
                  }}
                  key={item}
                  className="flex-1 h-28 m-2 rounded-[16px] justify-center items-center bg-white"
                >
                  <Image
                    className="relative left-1"
                    source={emotions[item as Emotion]}
                  />
                  <Text className="text-storm font-bold text-[15px]">
                    {capitalize(item)}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={4}
            />
          </View>
        )}
        <View style={{ backgroundColor: "transparent" }} className="mt-6 px-7">
          <Text className="text-2xl font-semibold  text-midnight-mosaic">
            One-on-One Chat
          </Text>
          <Pressable
            onPress={() => {
              navigation.dispatch(
                StackActions.replace("Root", { screen: "Chat" })
              );
            }}
            className="flex-row items-center justify-between h-16 px-4 mt-4 rounded-lg bg-jade"
          >
            <View
              style={{ backgroundColor: "transparent" }}
              className="flex-row items-center"
            >
              <View className="flex-row items-center justify-center w-8 h-8 bg-white rounded-md">
                <Ionicons name="ear-outline" size={24} color="#41B89C" />
              </View>
              <Text className="ml-4 text-lg font-bold text-white">
                Find a Listener
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </Pressable>

          {user.listenerProfile === null ? (
            <>
              <Pressable
                onPress={() => {
                  navigation.navigate("ListenerTrainingProgram", {
                    type: "LISTENER",
                  });
                }}
                className="flex-row items-center justify-between h-16 px-4 mt-4 bg-white rounded-lg"
              >
                <View
                  style={{ backgroundColor: "transparent" }}
                  className="flex-row items-center"
                >
                  <Image
                    source={require("../assets/images/favicon.png")}
                    className="w-8 h-8 rounded-md"
                  />
                  <Text className="ml-4 text-lg font-bold text-midnight-mosaic">
                    Become a Listener
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#3D5467" />
              </Pressable>
            </>
          ) : (
            <Pressable
              disabled={chatStatusCtx.chatStatus.status === "MATCHING"}
              onPress={() => {
                chatStatusCtx.setChatStatus({
                  status: "REQUESTS",
                });
                chatStatusCtx.setIsRequestsPanelOpen(true);
              }}
              className="flex-row items-center justify-between h-16 px-4 mt-4 bg-white rounded-lg"
            >
              <View
                style={{ backgroundColor: "transparent" }}
                className="flex-row items-center"
              >
                <Image
                  source={require("../assets/images/favicon.png")}
                  className="w-8 h-8 rounded-md"
                />
                <Text className="ml-4 text-lg font-bold text-midnight-mosaic">
                  Pending Chat Requests
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#3D5467" />
            </Pressable>
          )}
        </View>

        <View className="mt-8 px-7" style={{ backgroundColor: "transparent" }}>
          <Text className="text-2xl font-semibold  text-midnight-mosaic">
            Support Groups by Category
          </Text>

          <ScrollView
            style={{ backgroundColor: "transparent" }}
            className="mb-14"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{ backgroundColor: "transparent" }}
              className="flex-row gap-x-4"
            >
              {groupImageArr.map((group, index) => (
                <Pressable
                  onPress={() => {
                    navigation.navigate("GroupCategoryList", {
                      category: group.name,
                    });
                  }}
                  key={index}
                  className="bg-white h-[100px] w-[170px] mt-20 relative flex-row justify-center rounded-[16px]"
                >
                  <View
                    className="absolute bottom-2"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <Image source={group.image} className="w-32 h-32 " />
                    <Text className="mt-2 mb-1 font-semibold text-center text-storm text-md">
                      {group.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

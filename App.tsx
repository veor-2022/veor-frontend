import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

//======================DEMO USE ONLY==========================
import {
  Alert,
  AppState,
  DeviceEventEmitter,
  LogBox,
  Platform,
} from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
//=============================================================

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import React, { useEffect, useState, useRef, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import a, { setToken } from "./services/axios";
import UserContext, { initialUser } from "./components/User";
import ChatStatusContext, { initChatStatus } from "./components/ChatStatus";
import LoadingStatusContext, {
  initLoadingStatus,
} from "./components/LoadingStatus";
import decodeJWT from "jwt-decode";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Settings } from "react-native-fbsdk-next";
import { View } from "./components/Themed";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { UserService } from "./services/user";
import Loader from "./components/Loader";
import { ChatService } from "./services/chat";
GoogleSignin.configure({
  webClientId:
    "102038303607-ovegubglf2afs4fmjqjbqe199drc499h.apps.googleusercontent.com",
});
Settings.initializeSDK();

declare module "axios" {
  interface AxiosRequestConfig {
    errorHandler?: (error: AxiosError) => any;
  }
}

Notifications.setNotificationHandler(null);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loadingStatus, setLoadingStatus] = useState(initLoadingStatus);
  const [user, setUser] = useState(initialUser);

  const [chatStatus, setChatStatusBackend] = useState(initChatStatus);
  const [chatStatusId, setChatStatusId] = useState("");
  const [hideChatStatus, setHideChatStatus] = useState(false);
  const [hideNavBar, setHideNavBar] = useState(false);
  const [loadedUser, setLoadedUser] = useState(false);
  const [pendingChatCount, setPendingChatCount] = useState(0);
  const [prevChatStatus, setPrevChatStatus] = useState(initChatStatus);
  const [isRequestsPanelOpen, setIsRequestsPanelOpen] = useState(false);
  const [hideBottomBar, setHideBottomBar] = useState(false);
  const [acceptChat, setAcceptChat] = useState(true);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/)) {
        // app in background
        if (chatStatusId !== "") {
          ChatService.deleteOneOnOneChatRequest(chatStatusId);
          setChatStatusId("");
        }
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const setChatStatus = (IChatStatus: any) => {
    if (chatStatus !== IChatStatus) {
      if (IChatStatus.status !== "MATCHED") {
        setHideNavBar(false);
      }
      setChatStatusBackend({ ...IChatStatus });
    }
  };

  useEffect(() => {
    if (expoPushToken === "") return;
  }, [expoPushToken]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return setLoadedUser(true);
      setToken(token);
      const { id } = decodeJWT(token) as { id: string };
      const { data: userData } = await a.get(`/users/${id}`);
      if (!userData) {
        await AsyncStorage.removeItem("token");
        setToken("");
        setLoadedUser(true);
        return;
      }
      const acceptChatStatus = await AsyncStorage.getItem("acceptChatStatus");
      if (acceptChatStatus === "false") {
        setAcceptChat(false);
      } else {
        setAcceptChat(true);
      }
      setUser(userData);
      setLoadedUser(true);
    })();
  }, []);

  useEffect(() => {
    if (user.id === "") return;
    UserService.updateUserPushToken(expoPushToken);
  }, [user]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      // @ts-ignore
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    // @ts-ignore
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // @ts-ignore
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        // @ts-ignore
        notificationListener.current
      );
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isLoadingComplete || !loadedUser) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <LoadingStatusContext.Provider
          value={{ loadingStatus, setLoadingStatus }}
        >
          <ChatStatusContext.Provider
            value={{
              pendingChatCount,
              setPendingChatCount,
              chatStatus,
              setChatStatus,
              chatStatusId,
              setChatStatusId,
              hideChatStatus,
              setHideChatStatus,
              setPrevChatStatus,
              prevChatStatus,
              hideBottomBar,
              setHideBottomBar,
              acceptChat,
              setAcceptChat,
              hideNavBar,
              setHideNavBar,
              isRequestsPanelOpen,
              setIsRequestsPanelOpen,
            }}
          >
            <UserContext.Provider value={{ user, setUser }}>
              <Loader loading={loadingStatus.isLoading} />
              <Navigation colorScheme={colorScheme} />
              {/* <StatusBar /> */}
            </UserContext.Provider>
          </ChatStatusContext.Provider>
        </LoadingStatusContext.Provider>
      </SafeAreaProvider>
    );
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomStatusBar from "../StatusBar";
import { useContext } from "react";
import ChatStatusContext from "../../components/ChatStatus";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  isFocused: boolean;
}) {
  return (
    <Ionicons
      color={props.isFocused ? "#41bb9c" : "#686963"}
      size={30}
      style={{}}
      {...props}
    />
  );
}

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const { hideBottomBar, hideNavBar } = useContext(ChatStatusContext);
  const icons = {
    HomeTab: (
      <TabBarIcon
        name={
          navigation.getState().index == 0
            ? "ios-home-sharp"
            : "ios-home-outline"
        }
        isFocused={navigation.getState().index == 0}
      />
    ),
    Groups: ( 
      <TabBarIcon
        name={
          navigation.getState().index == 1 ? "people-sharp" : "people-outline"
        }
        isFocused={navigation.getState().index == 1}
      />
    ),
    Chat: (
      <TabBarIcon
        name={
          navigation.getState().index == 2
            ? "chatbubbles-sharp"
            : "chatbubbles-outline"
        }
        isFocused={navigation.getState().index == 2}
      />
    ),
    User: (
      <TabBarIcon
        name={navigation.getState().index == 3 ? "person" : "person-outline"}
        isFocused={navigation.getState().index == 3}
      />
    ),
  };
  return hideBottomBar ? null : (
    <View>
      <View className="z-50 w-full">
        <CustomStatusBar navigation={navigation} />
      </View>
      {!hideNavBar && (
        <View className="h-[70] flex flex-row justify-around w-full items-center bg-white">
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                className={
                  "h-full " + (Platform.OS === "ios" ? "pt-2.5" : "pt-4")
                }
              >
                {icons[route.name]}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

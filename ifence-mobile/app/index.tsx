import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].tint },
          headerTintColor: "#fff",
          drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
          drawerInactiveTintColor: "#555",
          drawerStyle: { backgroundColor: "#f8fafc", width: 240 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <IconSymbol size={size} name="house.fill" color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="AdicionarPulseiraScreen"
          options={{
            title: "Pulseiras",
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("@/assets/images/image.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="ListarCercas"
          options={{
            title: "Cercas",
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("@/assets/images/TablerFenceFilled.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="Alarme"
          options={{
            title: "Monitorar cercas",
            drawerIcon: ({ color, size }) => (
              <Image
                source={require("@/assets/images/MaterialSymbolsEyeTrackingOutline.png")}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

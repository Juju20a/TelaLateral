import { View, Text, StyleSheet, SafeAreaView, Platform, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { spacing, moderateScale } from "../utils/responsive";

const HeaderHomeUser = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        setUsername(currentUser);
      } else {
        setUsername("");
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    router.replace("/");
  };

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Pressable
          style={({ pressed }) => [
            pressed ? { opacity: 0.6 } : null,
          ]}
          onPress={() => router.push("/Screens/EditarUsuario")}
          accessibilityLabel="Editar credenciais do usuário"
        >
          <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerText}>Olá, {username}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.logoutBtn,
          pressed ? styles.logoutBtnPressed : null,
        ]}
        onPress={handleLogout}
      >
        <View style={styles.logoutContent}>
          <Ionicons name="log-out-outline" size={26} color="#FFFFFF" />
          <Text style={styles.logoutText}>Sair</Text>
        </View>
      </Pressable>
    </View>
  );
};



const styles = StyleSheet.create({
  logoutBtnPressed: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 8,
  },
  //   safeArea: {
  //     backgroundColor: "#FFFFFF",
  //   },
  header: {
    flexDirection: "row",
    // marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  padding: spacing(2),
    backgroundColor: "#003F88",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  padding: spacing(1),
  gap: spacing(1),
  },
  headerText: {
  fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoutContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#FFFFFF",
  fontSize: moderateScale(12),
  marginTop: spacing(0.25),
  },
  logoutBtnHover: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 8,
  },
});

export default HeaderHomeUser;

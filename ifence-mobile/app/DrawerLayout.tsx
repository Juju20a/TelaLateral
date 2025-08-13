import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "@/screens/Home";
import AdicionarPulseiraScreen from "@/screens/AdicionarPulseiraScreen";
import ListarCercas from "@/screens/ListarCercas";
import Alarme from "@/screens/Alarme";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Adicionar Pulseira" component={AdicionarPulseiraScreen} />
      <Drawer.Screen name="Listar Cercas" component={ListarCercas} />
      <Drawer.Screen name="Monitorar Cercas" component={Alarme} />
    </Drawer.Navigator>
  );
}


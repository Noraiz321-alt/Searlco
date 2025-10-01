import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashbord from '../screens/Dashbord'
import { useRoute } from '@react-navigation/native'; // 👈 zaroori
import CustomDrawerContent from './CustomDrawerContent';
import Sales from '../screens/Sales';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const route = useRoute();
  const userId = route?.params?.userId ?? null;   // 🔥
  const flag = route?.params?.flag ?? 0;          // 🔥

  return (
    <Drawer.Navigator
      initialRouteName="Sales"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,       // 👈 ye Drawer ko bilkul swipe se disable karega
        swipeEdgeWidth: 0,    
        drawerStyle: {
          backgroundColor: '#111',
          width: 220,
        },
        drawerActiveTintColor: '#FDC034',
        drawerInactiveTintColor: '#888',
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="Dashbord"
        component={Dashbord}
        initialParams={{ userId, flag }} // 👈 always pass both
        options={{
          drawerLabel: '📡 Communication',
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={Sales}
        initialParams={{ userId, flag }} // 👈 always pass both
        options={{
          swipeEnabled: false,       // 👈 ye Drawer ko bilkul swipe se disable karega
          // swipeEdgeWidth: 0,    
          drawerLabel: '📡 Sales',
        }}
      />
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;


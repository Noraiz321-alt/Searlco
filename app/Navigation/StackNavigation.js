import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import Dashbord from '../screens/Dashbord';
import Documentation from '../screens/Documentation';
import SplashScreen from "../screens/SplashScreen";

import DrawerNavigator from "./DrawerNavigator";


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (

      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Documentation" component={Documentation} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      </Stack.Navigator>
   
     
    
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});

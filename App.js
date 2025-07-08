
import React, { useRef } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./app/Navigation/StackNavigation";


const App = () => {
 

  return (

    <NavigationContainer>
    <StatusBar backgroundColor="#000000"  />
        <StackNavigation />
        </NavigationContainer>
   
    
  );
};

export default App;
  {/* <StatusBar backgroundColor="#000000"  /> */}

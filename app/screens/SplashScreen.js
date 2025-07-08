import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function SplashScreen({ navigation }) {

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const userId = await AsyncStorage.getItem("userdetails");

            console.log('userid xxxxxx',userId)
            navigation.replace("Login");
    
            if (userId) {
              console.log("✅ User found in AsyncStorage:", userId);
              navigation.replace("DrawerNavigator", { userId }); // Navigate to Dashboard
            } else {
              console.log("🔒 No user found, going to Login");
              navigation.replace("Login");
            }
          } catch (error) {
            console.log("❌ Error reading AsyncStorage:", error);
            navigation.replace("Login");
          }
        };
    
        setTimeout(checkLoginStatus, 2000); // Wait 2 seconds before checking
      }, []);

    return (
        <LinearGradient colors={["#000", "#1a1a1a", "#333"]} style={styles.container}>
            {/* Animated Logo */}
            <Animatable.Image
                animation="slideInDown"
                duration={2000}
                source={require("../images/serlogo.png")}
                style={styles.logo}
                resizeMode="contain"  // ✅ Fix for image cropping
            />

           
            {/* <Animatable.Text animation="fadeInUp" delay={500} style={styles.text}>
                Welcome!
            </Animatable.Text> */}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      logo: {
        width: scale(250),
        height: verticalScale(350),
        // marginBottom: verticalScale(20), // if you need margin
      },
      text: {
        color: "#fff",
        fontSize: moderateScale(22),
        fontWeight: "bold",
        marginTop: verticalScale(10),
      },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScaledSheet,scale, verticalScale, moderateScale } from "react-native-size-matters";
import DrawerNavigator from "../Navigation/DrawerNavigator";


// test@gmail.com
// Se@rlcO2020!?!?

const Login = ({ navigation }) => {

  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("Se@rlcO2020!?!?");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage("Please enter both email and password.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("accessToken", "@lead_added@");
    formData.append("action", "login");
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch(
        "https://searlco.xyz/email_filter/remoteAPIs/searlcoRemoteApi.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setLoading(false);
        await AsyncStorage.setItem("userdetails", data.user_id.toString());
        // navigation.dispatch(StackActions.replace("DrawerNavigator"));
        navigation.dispatch(StackActions.replace("DrawerNavigator", { userId: data.user_id }));
      } else {
        setModalMessage(data.message || "Invalid credentials");
        setIsSuccess(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setModalMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#000", "#1a1a1a", "#333"]} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Image source={require("../images/serlogo.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome Back!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FDC034"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#FDC034"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Image
                source={
                  showPassword
                    ? require("../images/icons8-eye-48.png")
                    : require("../images/icons8-hide-48.png")
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{isSuccess ? "Success" : "Error"}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                if (isSuccess) {
                  navigation.dispatch(StackActions.replace("Dashbord", { userId: email }));
                }
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};


const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "18@ms",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: "18@ms",
  },
  innerContainer: {
    alignItems: "center",
  },
  logo: {
    width: "150@s",
    height: "120@vs",
    resizeMode: "contain",
  },
  title: {
    fontSize: "24@ms",
    fontWeight: "bold",
    color: "#FDC034",
    marginBottom: "30@vs",
  },
  input: {
    width: "100%",
    height: "50@vs",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10@ms",
    paddingHorizontal: "15@ms",
    fontSize: "16@ms",
    color: "#FDC034",
    marginBottom: "15@vs",
  },
  passwordContainer: {
    width: "100%",
    height: "50@vs",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10@ms",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "15@ms",
    marginBottom: "15@vs",
  },
  passwordInput: {
    flex: 1,
    fontSize: "16@ms",
    color: "#FDC034",
  },
  eyeIcon: {
    padding: "10@ms",
  },
  eyeImage: {
    width: "24@s",
    height: "24@s",
    tintColor: "#FDC034",
  },
  button: {
    width: "100%",
    height: "50@vs",
    backgroundColor: "#FDC034",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10@ms",
    marginTop: "30@vs",
  },
  buttonText: {
    fontSize: "18@ms",
    fontWeight: "bold",
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "300@s",
    backgroundColor: "#222",
    padding: "20@ms",
    borderRadius: "10@ms",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "20@ms",
    fontWeight: "bold",
    color: "#FDC034",
    marginBottom: "10@vs",
  },
  modalMessage: {
    fontSize: "16@ms",
    color: "#ddd",
    marginBottom: "20@vs",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#FDC034",
    paddingHorizontal: "20@ms",
    paddingVertical: "10@ms",
    borderRadius: "5@ms",
  },
  modalButtonText: {
    fontSize: "16@ms",
    fontWeight: "bold",
    color: "#000",
  },
});



export default Login;

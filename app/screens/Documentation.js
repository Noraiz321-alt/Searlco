import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ScaledSheet, scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const Documentation = ({ navigation, route }) => {
  const { data, userId } = route.params;


  const adminId = data?.id;

  console.log('admin id',adminId)
  console.log('show userid ',userId)

  const [replyText, setReplyText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submitReply = async () => {
    if (!replyText.trim()) {
      setModalMessage("Please enter a reply before submitting.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append("client_id", userId);
    formData.append("admin_id", adminId);
    formData.append("note", replyText);

    
    console.log('bdjvbdf',formData)

    try {
      const response = await fetch("https://searlco.xyz/email_filter/remoteAPIs/add_note.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setModalMessage("Reply submitted successfully!");
        setIsSuccess(true);
        setModalVisible(true);
        setReplyText("");
      } else {
        setModalMessage("Failed to submit reply. Please try again.");
        setIsSuccess(false);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      setModalMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView
    contentContainerStyle={styles.keyboardAwareContainer}
    enableOnAndroid={true}
    keyboardShouldPersistTaps="handled"
    extraScrollHeight={20}
  >
      <LinearGradient colors={["#000", "#1a1a1a", "#333"]} style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require("../images/left-arrow.png")} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require("../images/serlogo.png")} style={styles.logo} />
          </View>

          <TouchableOpacity style={styles.backButton} disabled>
          {/* Empty space to balance the layout */}
          </TouchableOpacity>
        </View>
{/* android test 300 */}
        <View style={styles.content}>
          {data?.note?.split("\n").length > 5 ? (
            <ScrollView style={{ maxHeight: verticalScale(250) }}>
              <Text style={styles.docTitle}>{data?.admin}</Text>
              <Text style={styles.docDate}>{data?.date}</Text>
              <Text style={styles.docDescription}>{data?.note}</Text>
            </ScrollView>
          ) : (
            <>
              <Text style={styles.docTitle}>{data?.admin}</Text>
              <Text style={styles.docDate}>{data?.date}</Text>
              <Text style={styles.docDescription}>{data?.note}</Text>
            </>
          )}
        </View>

        <View style={styles.replyContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your reply here..."
            placeholderTextColor="#bbb"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitReply}>
            <Text style={styles.submitText}>Send Reply</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent
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
                    navigation.navigate("DrawerNavigator", {
                      screen: "Dashbord",
                      params: { userId, flag: 1 },
                    });
                    
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};


const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 20 : 0,
  },
  keyboardAwareContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "15@s",
  },
  logo: {
    width: "140@s",
    height: "80@vs",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "20@s",
    borderRadius: "10@s",
    width: "100%",
    marginBottom: "20@vs",
  },
  docTitle: {
    fontSize: "20@ms",
    fontWeight: "bold",
    color: "#FDC034",
    marginBottom: "10@vs",
    textAlign: "center",
  },
  docDate: {
    fontSize: "16@ms",
    color: "#FDC034",
    marginBottom: "5@vs",
    textAlign: "center",
  },
  docDescription: {
    fontSize: "16@ms",
    color: "#ddd",
    textAlign: "center",
  },
  replyContainer: {
    width: "100%",
    padding: "15@s",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10@s",
    marginBottom: "20@vs",
  },
  input: {
    height: "85@vs",
    borderColor: "#FDC034",
    borderWidth: 1,
    borderRadius: "8@s",
    padding: "10@s",
    color: "#fff",
    fontSize: "16@ms",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FDC034",
    paddingHorizontal: "15@s",
    paddingVertical: "15@vs",
    borderRadius: "8@s",
    marginTop: "10@vs",
    alignItems: "center",
  },
  submitText: {
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
    padding: "20@s",
    borderRadius: "10@s",
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
    paddingHorizontal: "20@s",
    paddingVertical: "10@vs",
    borderRadius: "5@s",
  },
  modalButtonText: {
    fontSize: "16@ms",
    fontWeight: "bold",
    color: "#000",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: "15@vs",
    paddingHorizontal: "10@s",
  },
  backButton: {
    width: "40@s",
  },
  backIcon: {
    width: "20@s",
    height: "23@vs",
    tintColor: "#FDC034",
  },
});


export default Documentation;

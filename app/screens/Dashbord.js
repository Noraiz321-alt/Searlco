import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, FlatList, Image, TouchableOpacity, SafeAreaView,
  ActivityIndicator, RefreshControl, StatusBar, Platform,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from 'react-native-animatable';

const Dashboard = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params || {};
  // const flagRef = useRef(flag);
  const flagRef = useRef(route.params?.flag || 0);

  

  // const flag = route.params?.flag || 0;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetchedFromFlag = useRef(false); // 📌 Ensure flag=1 triggers API only once

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://searlco.xyz/email_filter/remoteAPIs/notes.php?client_id=${userId}`);
      const json = await res.json();
      console.log("📥 Notes API Response:", json);
      if (json.status === "success" && Array.isArray(json.data)) {

        setNotes(json.data);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    // always run on first mount
    fetchNotes();
  }, []);
  
  useEffect(() => {
    if (route.params?.flag === 1) {
      hasFetchedFromFlag.current = false;
      flagRef.current = 1;
      console.log("🔁 Resetting flag logic - flag=1 received again");
    }
  }, [route.params?.flag]);
  
  useFocusEffect(
    useCallback(() => {
      console.log("🌀 useFocusEffect triggered");
      const flag = route.params?.flag;
  
      console.log('📦 use routeFlag:', flag);
      console.log('✅ use userId:', userId);
  
      if (flag === 1) {
        console.log("🚨 Flag is 1, calling fetchNotes...");
        fetchNotes().then(() => {
          console.log("🧹 Resetting flag in params...");
          navigation.setParams({ flag: 0 }); // 🟢 Ye line yahan likho
        });
      }
    }, [route.key, route.params?.flag])
  );
  



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#000", "#1a1a1a", "#333"]} style={styles.container}>
        
        {/* ✅ Static Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={openDrawer}>
            <Image source={require("../images/NavIcon.png")} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Communication</Text>
          <View style={styles.rightSpace} />
        </View>
  
        {/* ✅ Animated Content (everything except header) */}
        <Animatable.View animation="fadeInUp" duration={600} delay={200} style={{ flex: 1 }}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#FDC034" style={styles.loader} />
          ) : notes.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Available</Text>
            </View>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate("Documentation", { data: item, userId })}
                >
                  <Text style={styles.cardTitle}>{item.admin}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.note}
                  </Text>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#FDC034"]}
                  tintColor="#FDC034"
                />
              }
            />
          )}
        </Animatable.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 20 : 0,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: "15@ms",
    paddingTop: "20@vs",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20@vs",
    width: "100%",
    paddingBottom: "10@vs",
  },
  title: {
    fontSize: "22@ms",
    fontWeight: "bold",
    color: "#FDC034",
  },
  backIcon: {
    width: "25@s",
    height: "18@vs",
    tintColor: "#FDC034",
  },
  rightSpace: {
    width: "25@s",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: "18@ms",
    color: "#FDC034",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "15@ms",
    borderRadius: "10@ms",
    marginBottom: "10@vs",
  },
  cardTitle: {
    fontSize: "18@ms",
    fontWeight: "bold",
    color: "#FDC034",
  },
  cardDate: {
    fontSize: "14@ms",
    color: "#FDC034",
    marginTop: "5@vs",
  },
  cardDescription: {
    fontSize: "14@ms",
    color: "#ddd",
    marginTop: "5@vs",
  },
});

export default Dashboard;




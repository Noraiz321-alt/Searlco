import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { PieChart } from "react-native-chart-kit";
import { ScaledSheet } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import Chart from "../Component/Chart";
import BarChartt from "../Component/BarChartt";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth } = Dimensions.get("window");

const Sales = ({ navigation }) => {
    const [ordersData, setOrdersData] = useState(null);
    const [salesData, setSalesData] = useState(null);
    const [piesData, setPiesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // 🔹 Step 1: Sirf userId ko AsyncStorage se fetch karo
    useEffect(() => {
        const getUserId = async () => {
            try {
                const value = await AsyncStorage.getItem("userdetails");
                if (value) {
                    setUserId(value);
                    console.log("✅ User ID from storage:", value);
                }
            } catch (err) {
                console.error("❌ Error fetching userId:", err);
            }
        };
        getUserId();
    }, []);

    // 🔹 Step 2: Jab userId mil jaye tabhi API call karo
    useEffect(() => {
        if (!userId) return; // jab tak userId null hai, API call mat karo

        const fetchChartsData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `https://searlco.xyz/email_filter/remoteAPIs/chartsData.php?client_id=${userId}`
                );

                const text = await response.text();
                if (!text) throw new Error("Empty response from API");

                let result;
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    console.error("❌ JSON Parse Error:", parseError, "\nRaw Response:", text);
                    throw parseError;
                }

                console.log("✅ API Response:", result);

                if (result.success && result.data) {
                    setOrdersData(result.data.Monthly_Orders);
                    setSalesData(result.data.Sales_of_current_month_and_last_month);
                    setPiesData(result.data.pies);
                }
            } catch (err) {
                console.error("❌ API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartsData();
    }, [userId]); // 👈 ye ensure karega ke API call tabhi chale jab userId ready ho

    const openDrawer = () => navigation.openDrawer();

    const chartConfig = {
        backgroundGradientFrom: "#1F1F1F",
        backgroundGradientTo: "#1F1F1F",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(253, 192, 52, ${opacity})`,
        labelColor: () => "#fff",
    };

    // const formatValue = (value) => {
    //     if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    //     if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    //     return value.toString();
    // };

    const pieColors = ["#A46BF5", "#FDC034", "#FF6B6B", "#4ECDC4"];

    const getPieCharts = () => {
        if (!piesData) return [];
        return Object.entries(piesData).map(([key, obj], index) => {
            let title = key.replace(/_/g, " ");
            let data = [];

            if (typeof obj === "object" && !Array.isArray(obj)) {
                data = Object.entries(obj).map(([k, v], i) => ({
                    name: k.replace(/_/g, " "),
                    population: v,
                    color: pieColors[i % pieColors.length],
                    legendFontColor: "#CCCCCC",
                    legendFontSize: 12,
                }));
            }
            return { id: index.toString(), title, data, icon: pieColors[index % pieColors.length] };
        });
    };

    const ChartCard = ({ title, icon, data, delay = 0 }) => {
        const rotatedData = [...data].reverse().map((item, index) => {
            const oppositeColor = data[data.length - 1 - index].color;
            return { ...item, color: oppositeColor };
        });

        return (
            <Animatable.View animation="fadeInUp" duration={800} delay={delay} style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Icon name="pie-chart" size={25} color="#FFFFFF" />
                    <Text style={styles.chartTitle}>{title}</Text>
                </View>

                <PieChart
                    data={rotatedData}
                    width={screenWidth - 60}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="72"
                    center={[10, 10]}
                    hasLegend={false}
                />

                <View style={styles.percentageContainer}>
                    {rotatedData.map((item, index) => {
                        const total = rotatedData.reduce((sum, d) => sum + d.population, 0);
                        const percentage = total > 0 ? Math.round((item.population / total) * 100) : 0;
                        return (
                            <View key={index} style={styles.percentageRow}>
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                <Text style={styles.percentageText}>{percentage}%</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.statsContainer}>
                    {rotatedData.map((item, index) => (
                        <View key={index} style={styles.statRow}>
                            <View style={styles.statLeft}>
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                <Text style={styles.statLabel}>{item.name}</Text>
                            </View>
                            <Text style={styles.statValue}>{item.population}</Text>

                        </View>
                    ))}
                </View>
            </Animatable.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chartsContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={openDrawer}>
                        <Image source={require("../images/NavIcon.png")} style={styles.backIcon} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Dashboard</Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("DrawerNavigator", {
                                screen: "Dashbord",
                                params: { userId, flag: 1 },
                            })
                        }
                        disabled={!userId} // 👈 prevent crash if userId is null
                    >
                        <Icon name="comment" size={35} color="#FDC034" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#FDC034" />
                </View>
            ) : (

                <ScrollView>
                    <Animatable.View animation="fadeInUp" duration={600} delay={200}>
                        <BarChartt ordersData={ordersData} />
                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" duration={600} delay={200}>
                        <Chart sales={salesData} />
                    </Animatable.View>

                    <View style={styles.chartsContainer}>
                        <FlatList
                            data={getPieCharts()}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <Animatable.View
                                    animation="fadeInUp"
                                    duration={600}
                                    delay={200 + index * 200}
                                >
                                    <ChartCard
                                        title={item.title}
                                        icon={item.icon}
                                        data={item.data}
                                    />
                                </Animatable.View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = ScaledSheet.create({
    container: { flex: 1, backgroundColor: "#000000", },
    chartsContainer: { padding: "10@s" },
    chartCard: {
        backgroundColor: "#1F1F1F",
        borderRadius: "12@s",
        padding: "16@s",
        marginBottom: "16@vs",
        borderWidth: 1,
        borderColor: "#333333",
    },
    chartHeader: { flexDirection: "row", alignItems: "center", marginBottom: "16@vs", gap: 5 },
    chartTitle: { fontSize: "18@ms", fontWeight: "600", color: "#FFFFFF" },
    percentageContainer: { flexDirection: "row", justifyContent: "center", marginVertical: "10@vs" },
    percentageRow: { flexDirection: "row", alignItems: "center", marginHorizontal: "15@s" },
    percentageText: { fontSize: "14@ms", fontWeight: "600", color: "#FFFFFF", marginLeft: "5@s" },
    statsContainer: { marginTop: "16@vs" },
    statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: "8@vs" },
    statLeft: { flexDirection: "row", alignItems: "center" },
    colorDot: { width: "12@s", height: "12@s", borderRadius: "6@s", marginRight: "8@s" },
    statLabel: { fontSize: "14@ms", color: "#CCCCCC" },
    statValue: { fontSize: "12@ms", fontWeight: "600", color: "#FFFFFF" },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: "20@vs" },
    title: { fontSize: "22@ms", fontWeight: "bold", color: "#FDC034" },
    backIcon: { width: "25@s", height: "18@vs", tintColor: "#FDC034" },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000" },
});

export default Sales;

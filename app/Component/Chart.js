import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome";

const screenWidth = Dimensions.get("window").width;

const Chart = ({ sales }) => {
  const [tooltipPos, setTooltipPos] = useState({
    visible: false,
    value: 0,
    label: "",
    dataset: "",
  });

  // ✅ Clone Data Arrays
  let currentMonthData = [...(sales?.current?.values || [])];
  let currentDays = [...(sales?.current?.days || [])];

  let previousMonthData = [...(sales?.previous?.values || [])];
  let previousDays = [...(sales?.previous?.days || [])];

  // ✅ Line Chart Data
  const lineData = {
    labels: [],
    datasets: [
      {
        data: currentMonthData,
        color: () => "#FFFFFF",
        strokeWidth: 2,
      },
      {
        data: previousMonthData,
        color: () => "#FDC034",
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1F1F1F",
    backgroundGradientTo: "#1F1F1F",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(253, 192, 52, ${opacity})`,
    labelColor: () => "#fff",
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (tooltipPos.visible) {
          setTooltipPos({ ...tooltipPos, visible: false });
        }
      }}
    >
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          delay={300}
          style={styles.chartCard}
        >

          <View style={styles.headerFlex}>
            <Icon name="line-chart" size={25} color="#FFFFFF" />
            <Text style={styles.header}>
              Sales Of Current Month And Last Month
            </Text>
          </View>


          <LineChart
            data={lineData}
            width={screenWidth - 55}
            height={240}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 10 }}
            getDotColor={(value, index, datasetIndex) => {
              return datasetIndex === 0 ? "#FFFFFF" : "#FDC034";
            }}
            onDataPointClick={(point) => {
              const { index, dataset } = point;

              let datasetName = "";
              let labelDate = "";
              let actualValue = 0;

              if (dataset === lineData.datasets[0]) {
                datasetName = "Current Month";
                labelDate = currentDays[index] || `Day ${index + 1}`;
                actualValue = currentMonthData[index];
              } else {
                datasetName = "Previous Month";
                labelDate = previousDays[index] || `Day ${index + 1}`;
                actualValue = previousMonthData[index];
              }

              // ✅ Check if both values are equal
              const currentVal = currentMonthData[index];
              const previousVal = previousMonthData[index];

              if (currentVal === previousVal) {
                // Show both in tooltip
                setTooltipPos({
                  visible: true,
                  label: labelDate,
                  dataset: "Both Months",
                  value: `Current: ${currentVal} | Previous: ${previousVal}`,
                });
              } else {
                // Show clicked dataset only
                setTooltipPos({
                  visible: true,
                  value: actualValue,
                  label: labelDate,
                  dataset: datasetName,
                });
              }
            }}
          />

          {/* Tooltip */}
          {tooltipPos.visible && (
            <View
              style={{
                position: "absolute",
                top: 40,
                left: (screenWidth - 200) / 2,
                backgroundColor: "black",
                padding: 8,
                borderRadius: 6,
                minWidth: 160,
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                {tooltipPos.label}
              </Text>
              <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
                {tooltipPos.dataset}: {tooltipPos.value}
              </Text>
            </View>
          )}

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#FDC034" }]} />
              <Text style={styles.legendText}>Previous Month</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#FFFFFF" }]} />
              <Text style={styles.legendText}>Current Month</Text>
            </View>
          </View>
        </Animatable.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Chart;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: "10@s",
    paddingBottom: "10@s",
  },
  header: {
    fontSize: "16@ms",
    color: "#fff",
    fontWeight: "bold",
    alignItems: 'center',
    flexShrink: 1,         // ✅ Text ko shrink karne do agar jagah kam ho
  flex: 1,


  },
  chartCard: {
    backgroundColor: "#1F1F1F",
    borderRadius: "12@s",
    paddingVertical: "16@vs",
    paddingHorizontal: "10@vs",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: "2@vs" },
    shadowOpacity: 0.3,
    shadowRadius: "3.84@s",
    elevation: 5,
    borderWidth: "1@vs",
    borderColor: "#333333",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "10@s",
  },
  dot: {
    width: "12@s",
    height: "12@vs",
    borderRadius: "6@s",
    marginRight: "5@s",
  },
  legendText: {
    fontSize: "14@ms",
    color: "#fff",
  },
  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5@s',
    // padding: '16@s',
    paddingHorizontal: "6@s",
    marginBottom: "20@vs",
  },
});

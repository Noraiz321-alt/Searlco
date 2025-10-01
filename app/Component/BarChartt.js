import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ScaledSheet } from 'react-native-size-matters';
import * as Animatable from 'react-native-animatable';
import Icon from "react-native-vector-icons/FontAwesome";

const { width: screenWidth } = Dimensions.get('window');

const BarChartt = ({ ordersData }) => {
  console.log("📊 order data :", ordersData);

  if (!ordersData || !ordersData.labels || !ordersData.values) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
          Loading chart data...
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#1F1F1F',
    backgroundGradientTo: '#1F1F1F',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(253, 192, 52, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    barPercentage: 0.5,
  };

  const trimmedLabels = ordersData?.labels || [];
  const trimmedValues = ordersData?.values || [];

  const chartWidth = Math.max(screenWidth - 45, trimmedLabels.length * 45);

  const monthlyBarData = {
    labels: trimmedLabels.map(label => label.slice(0, 3)),
    datasets: [
      {
        data: trimmedValues, // ✅ Direct values, no animation
        color: (opacity = 1) => `rgba(253, 192, 52, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* ✅ Animation on full card */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={200}
        style={styles.chartCard}
      >
        <View style={styles.headerFlex}>
          <Icon name="gift" size={25} color="#FFFFFF" />
          <Text style={styles.header1}>Monthly Orders</Text>
        </View>

        {/* ❌ No animation on BarChart itself */}
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  nestedScrollEnabled={true} // ✅ Scroll gesture ko ScrollView tak limited karega
>
          <BarChart
            data={monthlyBarData}
            width={chartWidth}
            height={250}
            chartConfig={chartConfig}
            verticalLabelRotation={-40}
            showValuesOnTopOfBars
            fromZero
            withInnerLines={false}
          />
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default BarChartt;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  chartCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: '12@s',
    paddingVertical: '10@s',
    marginBottom: '20@s',
    marginHorizontal: '10@s',
    borderWidth: '1@s',
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: '2@vs' },
    shadowOpacity: 0.3,
    shadowRadius: '3.84@s',
    elevation: 5,
  },

  header1: {
    fontSize: '16@ms',
    color: '#FFF',
    fontWeight: 'bold',
  },

  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5@s',
    padding: '16@s',
  },
});

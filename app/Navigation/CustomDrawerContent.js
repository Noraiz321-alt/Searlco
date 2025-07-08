// navigation/CustomDrawerContent.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { ScaledSheet } from 'react-native-size-matters';

import LinearGradient from 'react-native-linear-gradient';

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userdetails');
      console.log('✅ Userdetails removed');
      props.navigation.replace('Login');
    } catch (err) {
      Alert.alert('Logout Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient
      colors={['#1A1A1A', '#111']} // 👈 gradient colors
      style={styles.drawerContainer}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../images/serlogo.png')}
            style={styles.logo}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Dashboard');
          }}
          style={styles.menuItem}
        >
          <View style={styles.menuRow}>
            <Image
              source={require('../images/Communication.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Communication</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <View style={styles.menuRow}>
              <Image
                source={require('../images/logout.png')}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

export default CustomDrawerContent;

const styles = ScaledSheet.create({
  drawerContainer: {
    flex: 1,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: '10@vs',
    paddingTop: '20@vs',
  },
  logo: {
    width: '140@s',
    height: '100@vs',
    resizeMode: 'contain',
  },
  menuItem: {
    paddingHorizontal: '10@s',
    paddingVertical: '15@vs',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: '25@s',
    height: '25@s',
    marginRight: '10@s',
    tintColor: '#FDC034',
    resizeMode: 'contain',
  },
  menuText: {
    color: '#FDC034',
    fontSize: '18@ms',
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: '30@vs',
  },
});


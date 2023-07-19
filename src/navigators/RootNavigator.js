import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "../screens/DetailsScreen";
import TabsNavigator from "./TabsNavigator";
import ProductsScreen from "../screens/ProductList/ProductListScreen";
import TrackingScreen from "../screens/Tracking/TrackingScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import CartScreen from "../screens/Cart/CartScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductsList from "../screens/ProductList/ProductListScreen";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    async function getToken() {
      const userData = await AsyncStorage.getItem("LOGIN_TOKEN");
      setToken(userData);
    }
    getToken();
  });

  console.log("Root: 1", token);

  return (
    <RootStack.Navigator
      initialRouteName="Login"
      screenOptions={{ unmountOnBlur: true }}
    >
      {/* {!token ? (
        <> */}
      <RootStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <RootStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* </>
      ) : (
        <> */}
      <RootStack.Screen
        name="TabsStack"
        component={TabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* </>
      )}  */}
    </RootStack.Navigator>
  );
};

export default RootNavigator;

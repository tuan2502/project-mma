import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "../screens/DetailsScreen";
import TabsNavigator from "./TabsNavigator";
import ProductsScreen from "../screens/ProductList/ProductListScreen";
import TrackingScreen from "../screens/Tracking/TrackingScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Login">
      <RootStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
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
          headerShown: false
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;

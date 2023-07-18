import { View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CustomBottomTabs from "../components/CustomBottomTabs";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ProductsScreen from "../screens/ProductList/ProductListScreen";

const TabsStack = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomBottomTabs {...props} />}
      initialRouteName="Home"
    >
      <TabsStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <TabsStack.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <TabsStack.Screen
        name="Notifications"
        component={Example}
        options={{
          headerShown: false,
        }}
      />
      <TabsStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </TabsStack.Navigator>
  );
};

export default TabsNavigator;

const Example = () => {
  return <View />;
};

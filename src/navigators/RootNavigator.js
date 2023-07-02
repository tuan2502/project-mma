import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DetailsScreen from "../screens/DetailsScreen"
import TabsNavigator from "./TabsNavigator"

const RootStack = createNativeStackNavigator()

const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="TabsStack"
        component={TabsNavigator}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerShown: false
        }}
      />
    </RootStack.Navigator>
  )
}

export default RootNavigator

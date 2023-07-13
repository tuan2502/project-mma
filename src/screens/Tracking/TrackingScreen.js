import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useEffect, useState, useCallback } from "react";
import { get, remove, post, put } from "../../utils/APICaller";

const TrackingScreen = ({
  navigation,
  route: {
    params: { statusInput },
  },
}) => {
  const [order, setOrder] = useState();
  const [status, setStatus] = useState([
    "pending",
    "packaging",
    "delivering",
    "success",
    "cancel",
  ]);

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      <ScrollView>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingTop: 16,
            paddingLeft: 16,
            paddingHorizontal: 16,
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="angle-left"
              size={17}
              style={{
                padding: 12,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            Order Details
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 30,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Tracking", {
                statusInput: "pending",
              });
            }}
          >
            <Text>Pending</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Tracking", {
                statusInput: "packaging",
              });
            }}
          >
            <Text>Packaging</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Tracking", {
                statusInput: "delivering",
              });
            }}
          >
            <Text>Delivering</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Tracking", {
                statusInput: "pending",
              });
            }}
          >
            <Text>Canceled</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackingScreen;

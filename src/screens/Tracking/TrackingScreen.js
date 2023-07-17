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

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "First Item",
    img: "https://images.unsplash.com/photo-1587052755556-89808205c097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    name: "Second Item",
    img: "https://images.unsplash.com/photo-1587052755556-89808205c097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    name: "Third Item",
    img: "https://images.unsplash.com/photo-1587052755556-89808205c097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

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

  useEffect(() => {
    get({ endpoint: `/order` })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const Item = ({ item }) => (
    <View style={{ flexDirection: "row" }}>
      <Image
        source={{ uri: item.img }}
        style={{ width: 50, height: 50, margin: 5 }}
      />
      <View style={{ width: "80%", margin: 5 }}>
        <Text>{item.name}</Text>
        <Text style={{ color: "#404040", textAlign: "right" }}> x 1</Text>
        <Text style={{ color: "#ed3c2f", textAlign: "right" }}> 10 $</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        position: "relative",
        backgroundColor: "white",
      }}
    >
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
          padding: 10,
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
      <ScrollView style={{ backgroundColor: "#e8e8e8" }}>
        <View
          style={{
            marginVertical: 10,
            backgroundColor: "white",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            Order: ở đây để id nè
          </Text>
          <FlatList
            data={DATA}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.id}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              paddingVertical: 5,
            }}
          >
            Total: ở đây để tổng bill
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "400", paddingVertical: 5 }}>
            Address: ở đây để địa chỉ nhận hàng
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackingScreen;

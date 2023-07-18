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
  ActivityIndicator,
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
  const [orders, setOrder] = useState([]);
  const [status, setStatus] = useState([
    "pending",
    "packaging",
    "delivering",
    "success",
    "cancel",
  ]);
  const [id, setId] = useState("4f639884-3ecb-470b-a785-788c73");
  const [selectedStatus, setSelectedStatus] = useState(statusInput);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    get({ endpoint: `/order/${id}` })
      .then((response) => {
        let data = response.data.data;
        data = data.filter(
          (item) => item.status !== "cart" && item.customerid === id
        );
        setOrder(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      const filteredData = orders.filter(
        (item) => item.status === selectedStatus
      );
      setFilteredOrders(filteredData);
    }
  }, [selectedStatus, orders]);

  const handleStatusItemClick = (statusItem) => {
    setSelectedStatus(statusItem);
  };

  if (orders.length > 0) {
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
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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
            Tracking Your Orders
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {status.map((statusItem) => (
            <Pressable
              key={statusItem}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: selectedStatus === statusItem ? "pink" : null,
                paddingVertical: 10,
              }}
              onPress={() => handleStatusItemClick(statusItem)}
            >
              <Text>
                {statusItem === "success"
                  ? "Delivered"
                  : statusItem === "pending"
                  ? "Pending"
                  : statusItem === "packaging"
                  ? "Packaging"
                  : statusItem === "delivering"
                  ? "Delivering"
                  : "Canceled"}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={{ backgroundColor: "#e8e8e8" }}>
          {filteredOrders?.map((order) => (
            <View
              style={{
                marginVertical: 10,
                backgroundColor: "white",
                padding: 10,
              }}
              key={order.orderid}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "500", paddingVertical: 5 }}
              >
                Order: {order.orderid}
              </Text>
              {order.OrderDetails?.map((detail, index) => (
                <View style={{ flexDirection: "row" }} key={index}>
                  <Image
                    source={{ uri: detail.Product.mainimg }}
                    style={{
                      width: 50,
                      height: 50,
                      margin: 5,
                      borderRadius: 5,
                    }}
                  />
                  <View style={{ width: "80%", margin: 5 }}>
                    <Text style={{ fontWeight: "400" }}>
                      {detail.Product.name}
                    </Text>
                    <Text style={{ color: "#404040", textAlign: "right" }}>
                      x {detail.quantity}
                    </Text>
                    <Text style={{ color: "#ed3c2f", textAlign: "right" }}>
                      {detail.Product.price} $
                    </Text>
                  </View>
                </View>
              ))}
              <Text
                style={{
                  paddingVertical: 5,
                  color: "#ed3c2f",
                }}
              >
                Status:{" "}
                {order.status === "success" ? "delivered" : order.status}
              </Text>
              <Text
                style={{
                  fontWeight: "500",
                  paddingVertical: 5,
                }}
              >
                Total bill: ${order.totalmoney}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  } else
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
};

export default TrackingScreen;

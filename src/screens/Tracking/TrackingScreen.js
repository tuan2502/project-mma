import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useEffect, useState, useCallback } from "react";
import { get } from "../../utils/APICaller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

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
  const [id, setId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statusInput);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getToken();
  }, []);

  useEffect(() => {
    if (id.length > 0) {
      fetchOrders();
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      const filteredData = orders.filter(
        (item) => item.status === selectedStatus
      );
      setFilteredOrders(filteredData);
      setLoading(false);
    }
  }, [selectedStatus, orders]);

  const handleStatusItemClick = (statusItem) => {
    setSelectedStatus(statusItem);
  };

  const fetchOrders = async () => {
    try {
      const response = await get({ endpoint: `/order/${id}` });
      let data = response.data.data;
      const checkLength = data.length;
      data = data.filter((item) => item.status !== "cart");
      setOrder(data);
      if (checkLength > 0 && orders.length === 0) {
        setLoading(false);
      } else {
        checkOrders;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const checkOrders = () => {
    if (orders.length > 0) {
      setLoading(false);
    } else {
      setTimeout(checkOrders, 100); // Chờ 100ms trước khi kiểm tra lại
    }
  };

  const getToken = async () => {
    try {
      const tokenString = await AsyncStorage.getItem("LOGIN_TOKEN");
      let token = JSON.parse(tokenString);
      token = jwtDecode(token);

      const checkId = () => {
        if (token.customerid !== undefined) {
          setId(token.customerid);
          if (id.length > 0) {
          }
        } else {
          setTimeout(checkId, 100);
        }
      };

      checkId();
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  if (!loading) {
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
        {filteredOrders.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No orders available for the selected status.</Text>
          </View>
        )}

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
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  paddingVertical: 5,
                }}
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

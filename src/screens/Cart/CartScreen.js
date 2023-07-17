import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLOURS, Items } from "../../database/Database";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { get, put, remove } from "../../utils/APICaller";
import { formatCurrency } from "../../components/Format";

import Dialog from "react-native-dialog";
import {Picker} from '@react-native-picker/picker';

const CartScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cartList, setCartList] = useState();
  const [isLoading, setLoading] = useState(true);
  const [callCount, setCallCount] = useState(0);

  const [total, setTotal] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrderList();
    });
    return unsubscribe;
  }, [navigation, cartList]);

  // lấy card order theo orderid
  const getOrderList = async () => {
    const customerid = "4f639884-3ecb-470b-a785-788c73";
    await get({
      endpoint: `/order/${customerid}`,
      params: { customerid: customerid },
    })
      .then(async (response) => {
        const data = response.data["data"];
        const orderid = await AsyncStorage.getItem("orderid");
        data.filter((item) => {
          if (item.orderid.toString() === orderid) {
            setProducts(item.OrderDetails);
            return setCartList(item);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return null;
      })
      .finally(() => setLoading(false));
  };

  //tăng giảm số lượng
  // const handleIncreaseQuantity = (e) => {
  //   const quantity = e.target.value;
  //   quantity++;
  //   e.target.value = quantity;
  // };

  // const handleDecreaseQuantity = (e) => {
  //   const quantity = e.target.value;
  //   if (quantity > 1) {
  //     quantity--;
  //     e.target.value = quantity;
  //   }
  // };

  //picker quantity
  const PickerQuantity = ({ quantity, orderid, orderdetailid }) => {
    const [country, setCountry] = useState(quantity);
    const [visible, setVisible] = useState(false);
    const [tempCountry, setTempCountry] = useState("Unknown");


    const PutQuantity = async (newQuantity) => {
      await put({
        endpoint: `/orderdetail/`,
        body: {
          quantity: newQuantity,
          orderdetailid: orderdetailid,
          orderid: orderid,
        },
      })
        .then((response) => {
          const data = response.data["data"];
          getOrderList();
          return data;
        })
        .catch((error) => {
          console.log("error", error);
          // return null;
        });
    };

    const onPressOK = () => {
      setCountry(tempCountry);
      setVisible(false);
      PutQuantity(tempCountry);
    };

    return (
      <View style={styles.screen}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Please select quantity</Dialog.Title>
          <Picker
            selectedValue={tempCountry}
            onValueChange={(value, index) => setTempCountry(value)}
            mode="dropdown" // Android only
            style={styles.picker}
          >
            {[...Array(20)].map((_, i) => {
              const value = i + 1;
              const label = `${value}`;
              return <Picker.Item key={i} label={label} value={value} />;
            })}
          </Picker>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setTempCountry(country);
              setVisible(false);
            }}
          />
          <Dialog.Button
            label="OK"
            onPress={() => {
              onPressOK();
            }}
          />
        </Dialog.Container>
        <Text
          style={styles.text}
          onPress={() => {
            setTempCountry(country);
            setVisible(true);
          }}
        >
          {country}
        </Text>
      </View>
    );
  };

  // remove data from Cart
  const removeItemFromCart = async (orderdetailid, orderid) => {

    await remove({
      endpoint: `/orderdetail/${orderdetailid}`,
      params: { orderdetailid: orderdetailid },
      body: { orderid: orderid },
    })
      .then(async (response) => {
        const data = response.data["data"];
        getOrderList();
        return data;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };
  
  // checkout
  const checkOut = async (orderid) => {
    const tracking = "pending";
    putStatus(orderid, tracking.toLowerCase());

    if (Platform.OS === "android") {
      ToastAndroid.show("Items will be Deliverd SOON!", ToastAndroid.SHORT);
    } else if (Platform.OS === "ios") {
      // Thông báo cho iOS
      Alert.alert("Items will be Deliverd SOON!");
    }
    navigation.navigate("Home");
  };

  const renderProduct = (data, index) => {
    return (
      <TouchableOpacity
        key={data.productid}
        onPress={() => {
          //   navigation.navigate('ProductInfo', { productID: data.id });
        }}
        style={{
          width: "100%",
          height: 100,
          marginVertical: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 120,
            padding: 14,
          }}
        >
          <Image
            source={{
              uri: data.Product.mainimg,
            }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLOURS.backgroundLight,
              marginRight: 22,
              borderRadius: 20,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-around",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                maxWidth: "100%",
                color: COLOURS.black,
                fontWeight: "600",
                letterSpacing: 1,
              }}
            >
              {data.Product.name}
            </Text>
            <View
              style={{
                marginTop: 4,
                flexDirection: "row",
                alignItems: "center",
                opacity: 0.6,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  maxWidth: "85%",
                  marginRight: 4,
                }}
              >
                ${data.Product.price}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* <View
                style={{
                  borderRadius: 100,
                  marginRight: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: COLOURS.backgroundMedium,
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="minus"
                  style={{
                    fontSize: 16,
                    color: COLOURS.backgroundDark,
                  }}
                />
              </View> */}
              <PickerQuantity
                quantity={data.quantity}
                orderid={data.orderid}
                orderdetailid={data.orderdetailid}
              />
              {/* <View
                style={{
                  borderRadius: 100,
                  marginLeft: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: COLOURS.backgroundMedium,
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  onPress={handleIncreaseQuantity}
                  style={{
                    fontSize: 16,
                    color: COLOURS.backgroundDark,
                  }}
                />
              </View> */}
            </View>
            <TouchableOpacity
              key={data.productid}
              onPress={() =>
                removeItemFromCart(data.orderdetailid, data.orderid)
              }
              style={{ borderRadius: 10, overflow: "hidden" }}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                style={{
                  fontSize: 16,

                  color: COLOURS.white,
                  backgroundColor: "#Ed4245",
                  padding: 8,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //thay đổi status
  const putStatus = async (orderid, tracking) => {
    await put({
      endpoint: `/order/status/${orderid}`,
      params: { orderid: orderid },
      body: {
        tracking: tracking,
      },
    })
      .then((response) => {
        const data = response.data["data"];
        return data;
      })
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <TouchableOpacity onPress={() => navigation.goBack()} >
              <MaterialCommunityIcons name='chevron-left' style={{
                fontSize: 18,
                color: COLOURS.backgroundDark,
                padding: 12,
                backgroundColor: COLOURS.backgroundLight,
                borderRadius: 12,
              }} />
            </TouchableOpacity> */}
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: "600",
                }}
              >
                Order Details
              </Text>
              <View></View>
            </View>
            <Text
              style={{
                fontSize: 20,
                color: COLOURS.black,
                fontWeight: "500",
                letterSpacing: 1,
                paddingTop: 20,
                paddingLeft: 16,
                marginBottom: 10,
              }}
            >
              My Cart
            </Text>
            <View style={{ paddingRight: 16 }}>
              {products
                ? products.map((data, index) => renderProduct(data, index))
                : null}
            </View>

            <View>
              <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: 40,
                  marginBottom: 80,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: COLOURS.black,
                    fontWeight: "500",
                    letterSpacing: 1,
                    marginBottom: 20,
                  }}
                >
                  Order Info
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Total</Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      color: COLOURS.black,
                    }}
                  >
                    {formatCurrency(cartList.totalmoney)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              height: "8%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                cartList.totalmoney != 0
                  ? checkOut(cartList.orderid)
                  : Alert.alert("Có hàng đi rồi thanh toán nhó!")
              }
              style={{
                width: "86%",
                height: "90%",
                backgroundColor: "#000",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  letterSpacing: 1,
                  color: COLOURS.white,
                  textTransform: "uppercase",
                }}
              >
                CHECKOUT ({formatCurrency(cartList.totalmoney)})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: 50,
    backgroundColor: '#e1ecf7',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  picker: {
    // backgroundColor: "white",
    marginVertical: 30,
    width: "100%",
    padding: 10,
  },
});

export default CartScreen;

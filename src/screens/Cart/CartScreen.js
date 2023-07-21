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
import { get, put, post, remove } from "../../utils/APICaller";
import { formatCurrency } from "../../components/Format";
import { Divider } from 'react-native-elements';

import Dialog from "react-native-dialog";
import { Picker } from "@react-native-picker/picker";
import { ToastMessage } from "../../components/CustomToastMessage";

const CartScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cartList, setCartList] = useState();
  const [isLoading, setLoading] = useState(true);
  const [information, setInformation] = useState(information);

  const [total, setTotal] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrderList();
      getInformation();
    });
    return unsubscribe;
  }, [navigation, cartList]);

  const getInformation = async () => {
    await get({ endpoint: "/customer/4f639884-3ecb-470b-a785-788c73" })
      .then((response) => {
        const data = response.data["data"];
        setInformation(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  //giới hạn số lượng
  const limitQuantity = () => {
    // productData.filter(item =>item.)
  };

  //picker quantity
  const PickerQuantity = ({
    quantity,
    orderid,
    orderdetailid,
    quantityProduct,
  }) => {
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
            // style={styles.picker}
          >
            {[...Array(quantityProduct)].map((_, i) => {
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
        <TouchableOpacity
          style={styles.touch}
          onPress={() => {
            setTempCountry(country);
            setVisible(true);
          }}
        >
          <Text style={styles.text}>{country}</Text>
        </TouchableOpacity>
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
        ToastMessage(
          "success",
          "Remove successful!",
          "Rảnh nhớ thêm zô lại nha thí chủ 😉"
        );
        return data;
      })
      .catch((error) => {
        ToastMessage("error", "Error!", error);
        return null;
      });
  };

  //dialog delete
  const RemoveDialog = ({ data }) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Remove Allert!</Dialog.Title>
          <Dialog.Description>
            Thí chủ đã chắc chắn xóa đi chưa? 😒
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setVisible(false);
            }}
          />
          <Dialog.Button
            label="Remove"
            onPress={() => {
              setVisible(false);
              removeItemFromCart(data.orderdetailid, data.orderid);
            }}
          />
        </Dialog.Container>
        <TouchableOpacity
          key={data.productid}
          onPress={() => {
            setVisible(true);
          }}
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
      </>
    );
  };

  //DialogCheckout
  const DialogCheckout = ({ cartList }) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Order Confirm</Dialog.Title>
          <Dialog.Description>
            Thiếu gì không? Mua nhá? Chốt nhá?👌
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setVisible(false);
            }}
          />
          <Dialog.Button
            label="Order"
            onPress={() => {
              setVisible(false);
              cartList.totalmoney != 0
                ? checkOut(cartList.orderid)
                : Alert.alert("Chưa có hàng kìa thí chủ");
            }}
          />
        </Dialog.Container>
        <TouchableOpacity
          onPress={() => setVisible(true)}
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
      </>
    );
  };

  // checkout
  const checkOut = async (orderid) => {
    const tracking = "pending";
    putStatus(orderid, tracking.toLowerCase());

    ToastMessage(
      "success",
      "Order successful!",
      "Cảm ơn thí chủ đã mua hàng, ghé lại sớm nha! 😍"
    );

    navigation.navigate("Tracking", {
      statusInput: "pending",
    });
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
                quantityProduct={data.Product.quantity}
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
            <RemoveDialog data={data} />
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
        createCart();
        return data;
      })
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  };

  const createCart = async () => {
    await post({
      endpoint: "/order/",
      body: { customerid: "4f639884-3ecb-470b-a785-788c73" },
    })
      .then((response) => {
        const data = response.data["data"];
        return data;
      })
      .catch((error) => {
        console.log("6", error);
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
              <TouchableOpacity
                style={{ left: "-280%" }}
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  style={{
                    fontSize: 22,
                    color: COLOURS.backgroundDark,
                    padding: 12,
                    borderRadius: 12,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: "600",
                }}
              >
                Order Details
              </Text>
            </View>
            {/* <Text
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
            </Text> */}
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
                  <Text>Orderer</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLOURS.black,
                    }}
                  >
                    {information.name}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Delivery address</Text>
                  <Text
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",

                      fontSize: 14,
                      fontWeight: "500",
                      color: COLOURS.black,
                      marginTop: 15,
                      marginLeft: 80,
                      // overflow: 'wrap',
                    }}
                    numberOfLines={2}
                  >
                    {information.address}
                  </Text>
                </View>
                <Divider style={{ marginVertical: 20 }} />
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
              bottom: 15,
              height: "8%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DialogCheckout cartList={cartList} />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 30,
    backgroundColor: "#e1ecf7",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  touch: {
    width: 70,
  },

  text: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default CartScreen;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLOURS, Items } from "../../database/Database";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "../../utils/APICaller";
import { formatCurrency } from "../../components/Format";

const CartScreen = ({ navigation }) => {
  const [product, setProduct] = useState();
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [callCount, setCallCount] = useState(0);


  const [total, setTotal] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {

    });
    return unsubscribe;
  }, [navigation]);


  const getProductFromDB = async () => {
    await get({ endpoint: "/product/" })
      .then((response) => {
        setProducts(response.data["data"]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };
  // console.log('products: ', products);

  const getCartItems = async () => {
    try {
      const items = await AsyncStorage.getItem("cartItems");
      if (items) {
        const listCart = JSON.parse(items);
        console.log(listCart);
        // console.log(products);
        let productData = [];
        if (listCart) {
          products.forEach((data) => {
            if (listCart.includes(data.productid)) {
              productData.push(data);
              // console.log(productData);
              return;
            }
          });
          setProduct(productData);
          // getTotal(productData);
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error retrieving cart items:", error);
      return [];
    }
  };

  // const getTotal = (productData) => {
  //   let total = 0;
  //   for (let index = 0; index < productData.length; index++) {
  //     let productPrice = productData[index].price;
  //     total = total + productPrice;
  //   }
  //   setTotal(total);
  //   console.log(total);
  // };

  // remove data from Cart
  const removeItemFromCart = async (id) => {
    let itemArray = await AsyncStorage.getItem("cartItems");
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index] == id) {
          array.splice(index, 1);
        }
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        getDataFromDB();
      }
    }
  };
  // checkout
  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem("cartItems");
    } catch (error) {
      return error;
    }
    ToastAndroid.show("Items will be Deliverd SOON!", ToastAndroid.SHORT);
    // navigation.navigate("Home");
  };

  const renderProduct = (data, index) => {
    // console.log('data', data);
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
              uri: data.mainimg,
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
              {data.name}
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
                {formatCurrency(data.price)}
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
              <View
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
              </View>
              <Text>1</Text>
              <View
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
                  style={{
                    fontSize: 16,
                    color: COLOURS.backgroundDark,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              key={data.productid}
              onPress={() => removeItemFromCart(data.productid)}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                style={{
                  fontSize: 16,
                  color: COLOURS.backgroundDark,
                  backgroundColor: COLOURS.backgroundLight,
                  padding: 8,
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
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
              {product
                ? product.map((data, index) => renderProduct(data, index))
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
                  <Text>Subtotal</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      maxWidth: "80%",
                      color: COLOURS.black,
                      opacity: 0.5,
                    }}
                  >
                    ${total}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Text>Shipping Tax</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      maxWidth: "80%",
                      color: COLOURS.black,
                      opacity: 0.5,
                    }}
                  >
                    ${total / 20}
                  </Text>
                </View>

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
                    ${total + total / 20}
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
              onPress={() => (total != 0 ? checkOut() : null)}
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
                CHECKOUT ({formatCurrency(total)})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default CartScreen;

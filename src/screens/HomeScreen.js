import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import MasonryList from "reanimated-masonry-list";
import { BlurView } from "expo-blur";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../components/CustomBackdrop";
import FilterView from "../components/FilterView";
import { get, post } from "../utils/APICaller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { ToastMessage } from "../components/CustomToastMessage";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [randomItems, setRandomItems] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrder();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    get({ endpoint: "/category/" })
      .then((response) => {
        setCategories(response.data["data"]);
      })
      .catch((error) => {
        console.log('2',error);

      });
  }, []);

  useEffect(() => {
    get({ endpoint: "/product/" })
      .then((response) => {
        const products = response.data["data"];
        setProductData(products);
        setFilteredProductData(products); 
        const randomIndexes = [];
        while (randomIndexes.length < 3) {
          const randomIndex = Math.floor(Math.random() * products.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
          }
        }
        const randomItems = randomIndexes.map((index) => products[index]);
        setRandomItems(randomItems);
      })
      .catch((error) => {
        console.log(error);
        console.log('3',error);
      })
      .finally(() => setLoading(false));
  }, []);

  // fetch Last Order
  const getOrder = async () => {
    const customerid = "4f639884-3ecb-470b-a785-788c73";
    await get({
      endpoint: `/order/${customerid}`,
      params: { customerid: customerid },
    })
      .then(async (response) => {
        const data = response.data["data"];

        if (data.length > 0) {
          const latestItem = data[0];
          if (latestItem.status === "cart") {
            try {
              await AsyncStorage.setItem(
                "orderid",
                latestItem.orderid.toString()
              );
            } catch (e) {
              console.log('4',error);
              return null;
            }
            return;
          } else {
            createCart();
          }
        } else if (data.length === 0) {
          createCart();
        }
      })
      .catch((error) => {
        console.log('5',error);
        return null;
      });
  };

  // tạo Cart
  const createCart = async () => {
    await post({
      endpoint: "/order/",
      body: { customerid: "4f639884-3ecb-470b-a785-788c73" },
    })
      .then((response) => {
        const data = response.data["data"];
        getOrder();
        return data;
      })
      .catch((error) => {
        console.log('6',error);
        return null;
      });
  };

  //post OrderDetail
  const postOrderDetail = async (productid) => {
    const orderid = await AsyncStorage.getItem("orderid");
    await post({
      endpoint: "/orderdetail/",
      body: {
        quantity: "1",
        orderid: orderid,
        productid: productid,
      },
    })
      .then((response) => {
        const data = response.data["data"];
        return data;
      })
      .catch((error) => {
        console.log('1',error);
        return null;
      });
  };

  //thêm sản phẩm vào Cart
  const addToCart = async (orderid) => {
    try {
      ToastMessage('success', 'Add successful', 'Mua đê mua đê, mại zô mại zô!!! 😘');
      await postOrderDetail(orderid);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = useCallback(() => {
    const filteredData = productData.filter((item) => {
      const categoryMatch =
        selectedCategory === null ||
        selectedCategory === "" ||
        item.Category.catename === selectedCategory;
      const nameMatch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return categoryMatch && nameMatch;
    });

    setFilteredProductData(filteredData);
  }, [productData, selectedCategory, searchText]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const setCategoryIndex = (index) => {
    const selectedCategory = categories[index]?.catename || null;
    setSelectedCategory(selectedCategory);
    setSearchText("");
  };

  return (
    <>
      <ScrollView>
        <SafeAreaView style={{ paddingVertical: 24, gap: 24 }}>
          {/* Header Section */}
          <View
            style={{
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image
              source={{
                uri: AVATAR_URL,
              }}
              style={{ width: 52, aspectRatio: 1, borderRadius: 52 }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: colors.text,
                }}
                numberOfLines={1}
              >
                Welcome Back 👋
              </Text>
              <Text
                style={{ color: colors.text, opacity: 0.75 }}
                numberOfLines={1}
              >
                Discover gift that suit your style
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Cart");
              }}
              style={{
                width: 52,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 52,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Icons name="shopping-cart" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Grid Collection View */}
          <View style={{ paddingHorizontal: 24 }}>
            {/* Title bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "700", color: colors.text }}
              >
                New Collections
              </Text>
            </View>
            <View style={{ flexDirection: "row", height: 200, gap: 12 }}>
              {randomItems.map((item) => (
                <Card
                  key={item.productid} // Add key prop with unique value
                  onPress={() => {
                    navigation.navigate("Details", {
                      id: item.productid,
                    });
                  }}
                  price={item.price}
                  imageUrl={item.mainimg}
                />
              ))}
            </View>
          </View>

          {/* Search Bar Section */}
          <View
            style={{ flexDirection: "row", paddingHorizontal: 24, gap: 12 }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: 52,
                borderRadius: 52,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                paddingHorizontal: 24,
                flexDirection: "row",
                gap: 12,
              }}
            >
              <Icons
                name="search"
                size={24}
                color={colors.text}
                style={{ opacity: 0.5 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.text,
                  opacity: 0.5,
                }}
                placeholder="Search"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
            </TouchableOpacity>
          </View>

          {/* Categories Section */}
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 12,
            }}
            renderItem={({ item, index }) => {
              const isSelected = item.catename === selectedCategory;
              return (
                <TouchableOpacity
                  onPress={() => setCategoryIndex(index)}
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 100,
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.background : colors.text,
                      fontWeight: "600",
                      fontSize: 14,
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  >
                    {item.catename}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Mesonary */}
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <MasonryList
              data={filteredProductData}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => (
                <View style={{ padding: 6 }}>
                  <View
                    style={{
                      aspectRatio: i === 0 ? 1 : 2 / 3,
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 24,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.mainimg,
                      }}
                      resizeMode="cover"
                      style={StyleSheet.absoluteFill}
                    />
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          padding: 12,
                        },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", gap: 8, padding: 4 }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#fff",
                            textShadowColor: "rgba(0,0,0,0.2)",
                            textShadowOffset: {
                              height: 1,
                              width: 0,
                            },
                            textShadowRadius: 4,
                          }}
                        >
                          {item.name}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.card,
                            borderRadius: 100,
                            height: 32,
                            aspectRatio: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icons
                            name="favorite-border"
                            size={20}
                            color={colors.text}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }} />
                      <BlurView
                        style={{
                          flexDirection: "row",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          alignItems: "center",
                          padding: 6,
                          borderRadius: 100,
                          overflow: "hidden",
                        }}
                        intensity={20}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#fff",
                            marginLeft: 8,
                          }}
                          numberOfLines={1}
                        >
                          ${item.price}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            addToCart(item.productid);
                          }}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 100,
                            backgroundColor: "#fff",
                          }}
                        >
                          <Icons
                            name="add-shopping-cart"
                            size={18}
                            color="#000"
                          />
                        </TouchableOpacity>
                      </BlurView>
                    </View>
                  </View>
                </View>
              )}
              onEndReachedThreshold={0.1}
            />
          )}
        </SafeAreaView>

        <BottomSheetModal
          snapPoints={["85%"]}
          index={0}
          ref={bottomSheetModalRef}
          backdropComponent={(props) => <CustomBackdrop {...props} />}
          backgroundStyle={{
            borderRadius: 24,
            backgroundColor: colors.card,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.primary,
          }}
        >
          <FilterView />
        </BottomSheetModal>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const Card = ({ price, imageUrl, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: "rgba(0,0,0,0.25)",
          borderRadius: 100,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
          ${price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

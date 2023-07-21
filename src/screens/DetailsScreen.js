import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastMessage } from "../components/CustomToastMessage";
import { post } from "../utils/APICaller";

const DetailsScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(1);

  const postOrderDetail = async (productid) => {
    const orderid = await AsyncStorage.getItem("orderid");
    await post({
      endpoint: "/orderdetail/",
      body: {
        quantity: count,
        orderid: orderid,
        productid: productid,
      },
    })
      .then((response) => {
        const data = response.data["data"];
        return data;
      })
      .catch((error) => {
        console.log(quantity, error);
        return null;
      });
  };

  const addToCart = async (orderid) => {
    try {
      ToastMessage(
        "success",
        "Add successful",
        "Mua đê mua đê, mại zô mại zô!!! 😘"
      );
      await postOrderDetail(orderid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{
          uri: route.params.mainimg,
        }}
        style={{ flex: 1, resizeMode: "center" }}
      />

      <SafeAreaView
        edges={["top"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <StatusBar style="light" />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              borderWidth: 1,
              borderColor: "#000",
            }}
          >
            <Icons name="arrow-back" size={24} color={"#000"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              borderWidth: 1,
              borderColor: "#000",
            }}
          >
            <Icons name="favorite-border" size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <BottomSheet
        detached
        snapPoints={[64, 500]}
        index={0}
        style={{ marginHorizontal: 20 }}
        bottomInset={insets.bottom + 20}
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.primary,
        }}
      >
        <View style={{ padding: 16, gap: 16, flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: colors.text }}>
            {route.params.name}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", gap: 2 }}>
                {new Array(5).fill("").map((_, i) => (
                  <Icons
                    key={i}
                    name={i < 3 ? "star" : "star-border"}
                    color="#facc15"
                    size={20}
                  />
                ))}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  opacity: 0.5,
                  marginTop: 4,
                }}
              >
                3.0 (22 Reviews)
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: colors.primary,
                padding: 6,
                borderRadius: 100,
              }}
            >
              <TouchableOpacity
                onPress={() => setCount((count) => Math.max(1, count - 1))}
                style={{
                  backgroundColor: colors.card,
                  width: 34,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 34,
                }}
              >
                <Icons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.background,
                }}
              >
                {count}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCount((count) =>
                    Math.min(route.params.quantity, count + 1)
                  )
                }
                style={{
                  backgroundColor: colors.card,
                  width: 34,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 34,
                }}
              >
                <Icons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  textTransform: "uppercase",
                }}
              >
                Category:{" "}
                <Text
                  style={{
                    color: colors.text,
                    opacity: 0.5,
                    fontSize: 16,
                    fontWeight: "400",
                    textTransform: "none",
                  }}
                >
                  {route.params.Category.catename}
                </Text>
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 6,
                color: colors.text,
              }}
            >
              Decscription
            </Text>
            <Text
              style={{ color: colors.text, opacity: 0.75 }}
              numberOfLines={7}
            >
              {route.params.detail}
            </Text>
          </View>

          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: colors.text, opacity: 0.75, marginBottom: 4 }}
              >
                Giá bán
              </Text>
              <Text
                style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}
              >
                ${route.params.price.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                height: 64,
                borderRadius: 64,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                flexDirection: "row",
                padding: 12,
              }}
              onPress={() => addToCart(route.params.productid)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.background,
                  paddingHorizontal: 16,
                }}
              >
                Add to cart
              </Text>

              <View
                style={{
                  backgroundColor: colors.card,
                  width: 40,
                  aspectRatio: 1,
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons name="arrow-forward" size={24} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default DetailsScreen;

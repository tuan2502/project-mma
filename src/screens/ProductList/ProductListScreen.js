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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import MasonryList from "reanimated-masonry-list";
import { BlurView } from "expo-blur";
import { get } from "../../utils/APICaller";

const ProductsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredProductData, setFilteredProductData] = useState([]);

  useEffect(() => {
    get({ endpoint: "/category/" })
      .then((response) => {
        setCategories(response.data["data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    get({ endpoint: "/product/" })
      .then((response) => {
        const products = response.data["data"];
        setProductData(products);
        setFilteredProductData(products);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(() => {
    const filteredData = productData.filter((item) => {
      const categoryMatch =
        selectedCategory === null ||
        selectedCategory === "" ||
        item.Category.catename === selectedCategory;
      const nameMatch =
        item.name.toLowerCase().includes(searchText.toLowerCase());

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
    <ScrollView>
      <SafeAreaView style={{ paddingVertical: 24, gap: 24 }}>
        {/* Header Section */}
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
              borderColor: "black",
            }}
          >
            <Icons name="arrow-back" size={24} color={"black"} />
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
              borderColor: "black",
            }}
          >
            <Icons name="add-shopping-cart" size={24} color={"black"} />
          </TouchableOpacity>
        </View>
        {/* Search Bar Section */}
        <View style={{ flexDirection: "row", paddingHorizontal: 24, gap: 12 }}>
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
                    <View style={{ flexDirection: "row", gap: 8, padding: 4 }}>
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

      
    </ScrollView>
  );
};

export default ProductsScreen;
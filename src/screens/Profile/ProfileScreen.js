import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { get } from "../../utils/APICaller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [information, setInformation] = useState(information);
  // const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getInformation();
    });
    return unsubscribe;
  }, [navigation]);

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

  return (
    <>
      {information && (
        <View style={{ flex: 1 }}>
          <StatusBar barStyle={"light-content"} backgroundColor="#212121" />
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1507281736509-c6289f1ea0f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            }}
            style={{ flex: 0.5 }}
            resizeMode={"cover"}
          >
            <View style={{ flex: 0.5 }}></View>
          </ImageBackground>
          <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={{
                  uri: `${
                    information?.image ??
                    "https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  }`,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100 / 2,
                  borderWidth: 3,
                  borderColor: "#FFFFFF",
                  position: "absolute",
                  zIndex: 2,
                }}
              />
            </View>
            <View style={{ marginTop: 60 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                  color: "#212121",
                }}
              >
                {information.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("EditProfile", { information });
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: "25%",
                  zIndex: 99,
                  backgroundColor: "#000",
                  width: 25,
                  height: 25,
                  borderRadius: 30,
                }}
              >
                <MaterialIcons name="edit" size={16} color="white" />
              </TouchableOpacity>
              <Text style={{ textAlign: "center", color: "#00000099" }}>
                #{information.username}
              </Text>
              <View style={{ marginLeft: 50, marginRight: 50 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Icon name="mobile-alt" size={25} color="#212121" />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {information.phone}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Icon name="map-marker-alt" size={25} color="#212121" />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {information.address}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Icon name="envelope" size={25} color="#212121" />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {information.email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  textAlign: "left",
                  color: "#212121",
                  paddingLeft: 40,
                }}
              >
                Tracking your orders:
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
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
                <Icon name="wallet" size={18} />
                <Text marginTop={10}>Pending</Text>
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
                <Icon name="box" size={18} />
                <Text marginTop={10}>Packaging</Text>
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
                <Icon name="truck" size={18} />
                <Text marginTop={10}>Delivering</Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Tracking", {
                    statusInput: "success",
                  });
                }}
              >
                <Icon name="angle-right" size={18} />
                <Text marginTop={10}>See more</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <FloatButton />
    </>
  );
};

export default ProfileScreen;

const FloatButton = () => {
  const navigation = useNavigation();
  const logout = async () => {
    await AsyncStorage.removeItem("LOGIN_TOKEN");
    navigation.navigate("Login");
  };

  return (
    <TouchableOpacity style={styles.floatButton} onPress={() => logout()}>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          width: 30,
          aspectRatio: 1,
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="sign-out-alt" size={15} color={"#000"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatButton: {
    flexDirection: "row",
    position: "absolute",
    height: 45,
    top: 50,
    right: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 64,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00000099",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
});

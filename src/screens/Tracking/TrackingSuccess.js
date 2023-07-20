import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React from "react";
const TrackingSuccess = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          marginTop: 230,
        }}
      >
        <View
          style={{
            borderRadius: 50,
            borderWidth: 3,
            width: 70,
            height: 70,
            alignSelf: "center",
            justifyContent: "center",
            borderColor: "green",
          }}
        >
          <Icon
            name="check"
            size={50}
            style={{ textAlign: "center", color: "green" }}
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "green",
            marginTop: 10,
          }}
        >
          Ordered successfully !!!
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Tracking", {
              statusInput: "pending",
            })
          }
          style={{
            marginTop: 100,
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            backgroundColor: "green",
            borderColor: "green",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",

              color: "white",
            }}
          >
            Tracking Your Orders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TrackingSuccess;

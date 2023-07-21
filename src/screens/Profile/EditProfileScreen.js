import React, { useState } from "react";
import { Button, Keyboard, StyleSheet } from "react-native";
import { TextInput, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastMessage } from "../../components/CustomToastMessage";
import { put } from "../../utils/APICaller";
import { set } from "react-native-reanimated";

const EditProfileScreen = ({
  navigation,
  route: {
    params: { information },
  },
}) => {

  const [name, setName] = useState(information.name);
  const [email, setEmail] = useState(information.email);
  const [phone, setPhone] = useState(information.phone);
  const [address, setAddress] = useState(information.address);

  const handleSave = () => {
    if(!name || !email || !phone || !address){
      ToastMessage(
        "error",
        "Invalid input",
        "Please enter a valid input!"
      );
      setName(information.name);
      setEmail(information.email);
      setPhone(information.phone);
      setAddress(information.address);
      return;
    }
    if (!validateEmail(email)) {
      ToastMessage(
        "error",
        "Invalid email",
        "Please enter a valid email address!"
      );
      return;
    }
    PutProfile(name, email, phone, address);
    
  };

  const PutProfile = async (newName, newEmail, newPhone, newAddress) => {
    
    const uid = "4f639884-3ecb-470b-a785-788c73";
    await put({
      endpoint: `/customer/${uid}`,
      params: { customerid: uid },
      body: {
        name: newName,
        email: newEmail,
        phone: newPhone,
        address: newAddress,
      },
    })
      .then((response) => {
        const data = response.data["data"];
        ToastMessage('info','Update Information', 'Profile Updated Successfully!')
        navigation.navigate('Profile')
        return data;
      })
      .catch((error) => {
        console.log("error", error);
        // return null;
      });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <View >
        <View style={styles.boxInput}>
          <MaterialIcons name="person" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            inputMode="text"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.boxInput}>
          <MaterialIcons name="email" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            inputMode="email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => {
              if (!validateEmail(email)) {
                ToastMessage(
                  "error",
                  "Invalid email",
                  "Please enter a valid email address"
                );
              }
            }}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.boxInput}>
          <MaterialIcons name="phone" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            inputMode="numeric"
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.boxInput}>
          <MaterialIcons name="location-city" size={20} color="black" />
          <TextInput
            style={styles.textInput}
            inputMode="text"
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.buttonUpdate}>
          <Button color="white" title="Update" onPress={handleSave} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 20,
  },

  boxInput: {
    flexDirection: "row",
    height: 40,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    margin: 10,
    padding: 10,
  },

  textInput: { marginLeft: 10, width: "90%" },

  buttonUpdate: {
    backgroundColor: "#000",
    color: "white",
    marginTop: 20,
    marginHorizontal: '35%',
    fontWeight: 500,
    padding: 10,
    borderRadius: 10,
  },
});

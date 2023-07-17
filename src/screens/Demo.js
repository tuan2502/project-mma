import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Dialog from "react-native-dialog";
import {Picker} from '@react-native-picker/picker';

const MyDialog = () => {
  const [country, setCountry] = useState('Unknown');
  const [visible, setVisible] = useState(false);
  const [tempCountry, setTempCountry] = useState('Unknown');

  return (
    <View style={styles.screen}>
      <Button title="Open Dialog" onPress={() => {
        setTempCountry(country);
        setVisible(true);
      }} />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Please select your country</Dialog.Title>
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
        <Dialog.Button label="Cancel" onPress={() => {
          setTempCountry(country);
          setVisible(false);
        }} />
        <Dialog.Button label="OK" onPress={() => {
          setCountry(tempCountry);
          setVisible(false);
        }} />
      </Dialog.Container>
      <Text style={styles.text}>Your country: {country}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  text: {
    fontSize: 24,
  },
  picker: {
    // backgroundColor: "white",
    marginVertical: 30,
    width: "100%",
    padding: 10,
  },
});
  
export default MyDialog;

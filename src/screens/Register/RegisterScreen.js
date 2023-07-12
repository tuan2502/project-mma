import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { post } from "../../utils/APICaller";

export const RegisterScreen = () => {
  const [usernameInput, setUsername] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [fullnameInput, setName] = useState("");

  const handleUsername = (event) => {
    setUsername(event.nativeEvent.text);
  };
  const handleFullname = (event) => {
    setName(event.nativeEvent.text);
  };
  const handlePassword = (event) => {
    setPassword(event.nativeEvent.text);
  };

  const handleSubmit = () => {
    console.log(fullnameInput, usernameInput, passwordInput);
    post({
      endpoint: `/signup`,
      body: {
        fullname: fullnameInput,
        username: usernameInput,
        password: passwordInput,
        role: "customer",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    })
      .then((response) => {
        alert(`Registed sucessfully!!!`);
      })
      .catch((error) => {
        alert(`Something went wrong, you should check again`);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>Welcome to Gift Shop!</Text>

            <Text style={styles.subtitle}>Please enter your information</Text>

            <View style={{ marginBottom: 16 }} />

            <View style={styles.form}>
              <Text style={styles.label}>Full Name:</Text>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="fullname"
                autoCorrect={false}
                keyboardType="default"
                onChange={handleFullname}
                onSubmitEditing={handleSubmit}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="name"
              />
            </View>
            <View style={{ marginBottom: 20 }} />
            <View style={styles.form}>
              <Text style={styles.label}>Username:</Text>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="username"
                autoCorrect={false}
                onChange={handleUsername}
                onSubmitEditing={handleSubmit}
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
              />
            </View>

            <View style={{ marginBottom: 20 }} />
            <View style={styles.form}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="password"
                autoCorrect={false}
                onChange={handlePassword}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
              />
            </View>

            <View style={{ marginBottom: 20 }} />
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.button}>
                <Text style={styles.buttonTitle}>Register</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  subtitle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
  },
  form: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: "#000",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    width: 88,
  },
  textInput: {
    color: "#000",
    flex: 1,
  },
  textButton: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
});

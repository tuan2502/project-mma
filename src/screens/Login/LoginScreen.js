import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { post } from "../../utils/APICaller";

const SizeBox = ({ height }) => {
  return <View style={{ marginBottom: height }}></View>;
};

const LoginScreen = () => {
  const [usernameInput, setUsername] = useState("");
  const [passwordInput, setPassword] = useState("");

  const handleUsername = (event) => {
    setUsername(event.nativeEvent.text);
  };
  const handlePassword = (event) => {
    setPassword(event.nativeEvent.text);
  };

  const handleSubmit = () => {
    console.log(usernameInput, passwordInput);
    post({
      endpoint: `/login`,
      body: {
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
        alert(`Login sucessfully!!!`);
      })
      .catch((error) => {
        alert(`Something went wrong, you should check again`);
      });
  };
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Text style={styles.title}>Welcome back!</Text>

          <Text style={styles.subtitle}>Sign in to your account</Text>

          <SizeBox height={16} />

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

          <SizeBox height={16} />

          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </View>
          <SizeBox height={16} />

          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>Sign In</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
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
    paddingRight: 16,
  },
  textInput: {
    color: "#000",
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
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

export default LoginScreen;

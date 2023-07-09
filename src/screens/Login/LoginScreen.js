import React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Modules
import { Controller, useForm } from "react-hook-form";
// Components

const SizeBox = ({ height }) => {
  return <View style={{ marginBottom: height }}></View>;
};

const LoginScreen = () => {
  const emailInput = React.useRef(null);
  const passwordInput = React.useRef(null);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    Alert.alert("Data", `Email: ${email}\nPassword: ${password}`);
  });

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

          <Pressable onPress={() => emailInput.current?.focus()}>
            <View style={styles.form}>
              <Text style={styles.label}>Email:</Text>

              <Controller
                control={control}
                name="email"
                render={({ onBlur, onChange, value }) => (
                  <TextInput
                    autoCapitalize="none"
                    autoCompleteType="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordInput.current?.focus()}
                    ref={emailInput}
                    returnKeyType="next"
                    style={styles.textInput}
                    textContentType="username"
                    value={value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizeBox height={16} />

          <Pressable onPress={() => passwordInput.current?.focus()}>
            <View style={styles.form}>
              <Text style={styles.label}>Password:</Text>

              <Controller
                control={control}
                name="password"
                render={({ onBlur, onChange, value }) => (
                  <TextInput
                    autoCapitalize="none"
                    autoCompleteType="password"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onSubmit}
                    ref={passwordInput}
                    returnKeyType="done"
                    secureTextEntry
                    style={styles.textInput}
                    textContentType="password"
                    value={value}
                  />
                )}
              />
            </View>
          </Pressable>

          <SizeBox height={16} />

          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </View>
          <SizeBox height={16} />

          <TouchableOpacity onPress={onSubmit}>
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

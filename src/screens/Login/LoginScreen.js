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
  TouchableWithoutFeedback,
  View,
} from "react-native";
// Modules
import { Controller, useForm } from "react-hook-form";
// Components

function useStyles() {
  return StyleSheet.create({
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
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
    forgotPasswordContainer: {
      alignItems: "flex-end",
    },
    form: {
      alignItems: "center",
      backgroundColor: "#000",
      borderRadius: 8,
      flexDirection: "row",
      height: 48,
      paddingHorizontal: 16,
    },
    label: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 20,
      width: 80,
    },
    root: {
      backgroundColor: "#f5f5f5",
      flex: 1,
    },
    safeAreaView: {
      flex: 1,
    },
    subtitle: {
      color: "#000",
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 22,
    },
    textButton: {
      color: "#000",
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 20,
    },
    textInput: {
      color: "#fff",
      flex: 1,
    },
    title: {
      color: "#000",
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 34,
    },
  });
}

const SizeBox = ({height}) =>{
  return (
    <View style={{marginBottom: height}}></View>
  )
}

const App = () => {
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

  const styles = useStyles();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>Welcome back!</Text>

            <Text style={styles.subtitle}>Sign in to your account</Text>

            <SizeBox height={16}/>


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

            <SizeBox height={16}/>


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

            <SizeBox height={16}/>

            <View style={styles.forgotPasswordContainer}>
              <Text style={styles.textButton}>Forgot password?</Text>
            </View>
            <SizeBox height={16}/>

            <TouchableOpacity onPress={onSubmit}>
              <View style={styles.button}>
                <Text style={styles.buttonTitle}>Continue</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default App;

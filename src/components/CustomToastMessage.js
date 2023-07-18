import React from "react";
import Toast from "react-native-toast-message";

export const CustomToastMessage = () => {
  return <div>CustomToastMessage</div>;
};

export const ToastMessage = (type, text1, text2) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  });
};

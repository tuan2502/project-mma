import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const ProfileScreen = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} backgroundColor="#212121" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1507281736509-c6289f1ea0f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        }}
        style={{flex: 0.5}}
        resizeMode={'cover'}>
        <View style={{flex: 0.5}}></View>
      </ImageBackground>
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100 / 2,
              borderWidth: 3,
              borderColor: '#FFFFFF',
              position: 'absolute',
              zIndex: 2,
            }}
          />
        </View>
        <View style={{marginTop: 60}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              color: '#212121',
            }}>
            Gus Nando
          </Text>
          <Text style={{textAlign: 'center'}}>
            Bonds of people is the true power
          </Text>
          <View style={{marginLeft: 80}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                }}>
                <Icon name="mobile-alt" size={25} color="#212121" />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10, flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>+6281-2345-6789</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                }}>
                <Icon name="map-marker-alt" size={25} color="#212121" />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10, flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>Bali</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                }}>
                <Icon name="envelope" size={25} color="#212121" />
              </View>
              <View style={{justifyContent: 'center', marginLeft: 10, flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>
                  tanyagusnando@gmail.com
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 40, marginHorizontal: 30}}>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="facebook" size={25} color="#bdbdbd" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="instagram" size={25} color="#bdbdbd" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="github" size={25} color="#bdbdbd" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="twitter" size={25} color="#bdbdbd" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="linkedin" size={25} color="#bdbdbd" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FloatButton/>
    </View>
  );
};

export default ProfileScreen;

const FloatButton = () => {
  return (
    <TouchableOpacity style={styles.floatButton}>
      <Text style={{ color: "#f5f5f5", fontSize: 16, fontWeight: "600", paddingHorizontal: 16 }}>
        Log out
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          width: 40,
          aspectRatio: 1,
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="sign-out-alt" size={24} color={"#000"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatButton: {
    flexDirection: "row",
    position: "absolute",
    // minWidth: 150,
    height: 64,
    bottom: 20,
    right: 20,
    backgroundColor: "#000",
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
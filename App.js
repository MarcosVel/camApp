import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <RNCamera
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAndroidPermissionStatus}) => {
          if (status !== 'READY') {
            return <View />;
          }
          return (
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => {}} style={styles.capture}>
                <Text>Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.capture}>
                <Text>Album</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttons: {
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
});

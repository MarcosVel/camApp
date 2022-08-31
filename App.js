import React, {useState} from 'react';
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [open, setOpen] = useState(false);
  const [capturePhoto, setCapturePhoto] = useState(null);

  const takePicture = async camera => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    setCapturePhoto(data.uri);
    setOpen(true);
    console.log('foto', data.uri);
  };

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
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}>
                <Text>Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.capture}>
                <Text>Album</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>

      {capturePhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text>Fechar</Text>
            </TouchableOpacity>

            <Image
              style={styles.photo}
              source={{uri: capturePhoto}}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  photo: {
    width: 350,
    height: 450,
    borderRadius: 16,
  },
});

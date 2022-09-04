import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRoll from '@react-native-community/cameraroll';
import {launchImageLibrary} from 'react-native-image-picker';

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [open, setOpen] = useState(false);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [lastImage, setLastImage] = useState(null);

  useEffect(() => {
    CameraRoll.getPhotos({first: 1}).then(res =>
      setLastImage(res.edges[0].node.image.uri),
    );
  }, []);

  const takePicture = async camera => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    setLastImage(data.uri);
    setCapturePhoto(data.uri);
    setOpen(true);

    savePicture(data.uri);
  };

  const invertCam = () => {
    setType(
      type === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
  };

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture(data) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(data, 'photo')
      .then(res => {
        console.log('SALVO COM SUCESSO', res);
      })
      .catch(err => {
        console.log('ERRO:', err);
        throw err;
      });
  }

  const openAlbum = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('picker closed');
      } else if (response.errorMessage) {
        console.log('Error', response.errorMessage);
      } else {
        setCapturePhoto(response.uri);
        setOpen(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <TouchableOpacity onPress={openAlbum} style={styles.album}>
                <Image
                  style={styles.photoAlbum}
                  source={{uri: lastImage}}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}
              />
              <TouchableOpacity onPress={invertCam} style={styles.invert}>
                <Icon name="camera-reverse-outline" size={20} color="#e2e2e2" />
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
    </SafeAreaView>
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
    width: '100%',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  capture: {
    width: 60,
    height: 60,
    backgroundColor: '#e2e2e2',
    borderColor: '#fff',
    borderRadius: 100,
    borderWidth: 5,
  },
  album: {
    width: 40,
    height: 40,
    backgroundColor: '#2b2b2b',
    borderColor: '#e2e2e2',
    borderRadius: 8,
    borderWidth: 3,
  },
  photoAlbum: {
    flex: 1,
    borderRadius: 8,
  },
  invert: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b2b2b',
    borderColor: '#e2e2e2',
    borderRadius: 100,
    borderWidth: 3,
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

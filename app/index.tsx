import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, []);

  if (!permission || !mediaPermission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      try {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync('MyAppPhotos', asset, false);
        Alert.alert('Success', 'Photo saved to gallery!');
      } catch (error) {
        Alert.alert('Error', 'Could not save photo to gallery.');
        console.error(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Snap</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    padding: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000070',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

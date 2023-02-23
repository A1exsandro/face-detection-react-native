/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react'; 
import type {PropsWithChildren} from 'react';
import FaceSDK, { FaceCaptureResponse } from '@regulaforensics/react-native-face-api';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RNCamera } from 'react-native-camera';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


function App(): JSX.Element {
  const [type, setTyoe] = useState(RNCamera.Constants.Type.front)
  const [box, setBox] = useState(null)
  const cameraRef = useRef(null)

const [img, setImg] = useState<FaceCaptureResponse | undefined>()
  console.log('========imgSet', img)

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // FaceSDK.presentFaceCaptureActivity(faceCaptureResponse => {
  //   const response = FaceCaptureResponse.fromJson(JSON.parse(faceCaptureResponse));
  //   // ... check response.image.bitmap for capture result.

  //   setImg(response)
  // }, e => { });

  return (
   <View style={styles.container}>
    <Text>Never Stop Trying</Text>
    <RNCamera
      ref={cameraRef}
      style={styles.camera}
      type={type}
      captureAudio={false}
    />
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  camera: {
    flexGrow:1, 
  },
});

export default App;

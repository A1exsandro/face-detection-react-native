/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react'; 
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { RNCamera } from 'react-native-camera';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


function App() {
  const [type, setTyoe] = useState(RNCamera.Constants.Type.front)
  const [box, setBox] = useState(null)
  const cameraRef = useRef(null)

  const handlerFace = ({faces}) => {
    // console.log(faces)
  }

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
   <View style={styles.container}>
    <Text>Never Stop Trying</Text>
    <RNCamera
      ref={cameraRef}
      style={styles.camera}
      type={type}
      captureAudio={false}
      onFacesDetected={handlerFace}
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
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
});

export default App;

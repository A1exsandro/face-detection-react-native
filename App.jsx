/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';  
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/react-native-face-api';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  StyleSheet,
  Text, 
  View, 
  Image,
  Button,
  TouchableHighlight,
  Alert
} from 'react-native';

var image1 = new MatchFacesImage()
var image2 = new MatchFacesImage()

function App() { 
  // const [backLoad1, setBackLoad1] = useState({img1: require('./images/portrait.png')}) 
  

  const [img1, setImg1] = useState({uri: require('./images/portrait.png')})
  const [img2, setImg2] = useState({uri: require('./images/portrait.png')})
  const [similarity, setSimilarity] = useState('nil')
  const [liveness, setLiveness] = useState('nil')

  console.log('image1=====',img1)

  //Capture the images
  const pickImage1 = () => {
    Alert.alert("Select option", "", [
      {
        text: "Use gallery",
        onPress: () => launchImageLibrary({ includeBase64: true }, response => {
          if (response.assets == undefined) return
          // setImage(response.assets[0].base64, Enum.ImageType.PRINTED)
          setImg1(response.assets[0].uri)
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity(result => {
          setImage(FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap, Enum.ImageType.LIVE)
        }, e => { })
      }], { cancelable: true })
  }

const pickImage2 = () => {
  Alert.alert("Select option", "", [
    {
      text: "Use gallery",
      onPress: () => launchImageLibrary({ includeBase64: true }, response => {
        if (response.assets == undefined) return
        setImage(response.assets[0].base64, Enum.ImageType.PRINTED)
      })
    },
    {
      text: "Use camera",
      onPress: () => FaceSDK.presentFaceCaptureActivity(result => {
        setImage(FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap, Enum.ImageType.LIVE)
      }, e => { })
    }], { cancelable: true })
}

// Set path image
const setImage = (base64, type) => {
  if (base64 == null) return
  image1.bitmap = base64
  console.log('================================my',image1.bitmap)
  image1.imageType = type
  setImg1({ uri: "data:image/png;base64," + base64 })
}

// Match
const matchFaces = () => {
  if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
    return
  this.setState({ similarity: "Processing..." })
  request = new MatchFacesRequest()
  request.images = [image1, image2]
  FaceSDK.matchFaces(JSON.stringify(request), response => {
    response = MatchFacesResponse.fromJson(JSON.parse(response))
    FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
      var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
      this.setState({ similarity: split.matchedFaces.length > 0 ? ((split.matchedFaces[0].similarity * 100).toFixed(2) + "%") : "error" })
    }, e => { this.setState({ similarity: e }) })
  }, e => { this.setState({ similarity: e }) })
}

// Clear Result
const clearResults = () => {
  setImg1(
    {uri: require('./images/portrait.png')}
  ) 
}
 
return (
  <View style={styles.container}>
    <View style={styles.container}> 

      <View style={{ flexDirection: "column", padding: 5 }}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <TouchableHighlight onPress={() => pickImage1(true)}>
            <Image
              style={{
                height: 150,
                width: 150,
              }}
              source={{uri: img1}}
              resizeMode="contain" />
          </TouchableHighlight>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", padding: 5 }}>
          <TouchableHighlight onPress={() => pickImage2(false)}>
            <Image
              style={{
                height: 150,
                width: 200,
              }}
              source={img2.uri}
              resizeMode="contain" />
          </TouchableHighlight>
        </View>
      </View>

      <View style={{ flexDirection: 'column', width: "100%", alignItems: "center" }}>
        <View style={{ padding: 3, width: "75%" }}>
          <Button color="#4285F4"
            onPress={() => {
              matchFaces()
            }}
            title="     Match     "
          />
        </View>

        <View style={{ padding: 3, width: "75%" }}>
          <Button color="#4285F4"
            onPress={() => {
              clearResults()
            }}
            title="Clear"
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: -20 }}>Similarity: {similarity}</Text>
        <Text style={{ marginLeft: 20 }}>Liveness: {liveness}</Text>
      </View>
    </View>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 12,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  resultsScreenBackButton: {
    position: 'absolute',
    bottom: 0,
    right: 20
  }
})

export default App;
  
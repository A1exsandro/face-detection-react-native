/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react'; 
import { launchImageLibrary } from 'react-native-image-picker';  
import FaceSDK, { 
  Enum, 
  FaceCaptureResponse, 
  MatchFacesResponse, 
  MatchFacesRequest, 
  MatchFacesImage, 
  MatchFacesSimilarityThresholdSplit 
} from '@regulaforensics/react-native-face-api';
import {
  StyleSheet,
  Text, 
  View, 
  Image,
  Button,
  TouchableHighlight,
  Alert
} from 'react-native';

  

function App() {  
  const [imge1, setImge1] = useState(new MatchFacesImage())
  const [imge2, setImge2] = useState(new MatchFacesImage())

  const [arrayImage, setArrayImage] = useState([new MatchFacesImage()])
  const [arryResult, setArryResult] = useState([])

  const [img1, setImg1] = useState({uri: require('./images/portrait.png')})
  const [img2, setImg2] = useState({uri: require('./images/portrait.png')})
  const [similarity, setSimilarity] = useState({ similarity: "nil" }) 
  // console.log('==========image1',imge1)
  // console.log('=====arrayImage', arrayImage)
  console.log('==========length', arrayImage.length)
  console.log('=======arryResult', arryResult)
  console.log('=======arryResultLENGTH', arryResult.length)

  // Convertendo array de imagens em blob
  // async function getBlobsFromImages(arrayImage) {
  //   const blobImages = await Promise.all(arrayImage.map(async (image) => {
  //     console.log('======comeco========',image, '=======final=====')
  //     const response = await fetch(image)
  //     const blob = await response.blob()
  //     return blob
  //   }))
  //   return blobImages
  // }
  
  // getBlobsFromImages(arrayImage)
  //   .then((blobImages) => {
  //     console.log('=====blobImages',blobImages);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // Capture the images
  const pickImage = (first) => {
    Alert.alert("Select option", "", [
      {
        text: "Use gallery",
        onPress: () => launchImageLibrary({ includeBase64: true }, response => {
          if (response.assets == undefined) return
          setImage(first, response.assets[0].base64, Enum.ImageType.PRINTED)
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity(result => {
          setImage(first, FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap, Enum.ImageType.LIVE)
        }, e => { })
      }], { cancelable: true })
  }

  // Set path image
  const setImage = (first, base64, type) => {
    if (base64 == null) return
    if (first) { 
      imge1.bitmap = base64
      imge1.imageType = type
      setImg1({uri: { uri: "data:image/png;base64," + base64 }})
      setArrayImage([...arrayImage, imge1 ])
    } else {
      imge2.bitmap = base64
      imge2.imageType = type
      setImg2({uri: { uri: "data:image/png;base64," + base64 }})
    }
  }

  // Match
  // const matchFaces = () => {
  //   if (imge1 == null || imge1.bitmap == null || imge1.bitmap == "" || imge2 == null || imge2.bitmap == null || imge2.bitmap == "")
  //     return

  //   arrayImage.map((m1) => {
  //     setSimilarity({ similarity: "Processing..." })
  //     let request = new MatchFacesRequest()
  //     let mm1 = m1
  //     request.images = [mm1, imge2] 
  
  //     FaceSDK.matchFaces(JSON.stringify(request), matchFacesResponse => {
  //       const response =  MatchFacesResponse.fromJson(JSON.parse(matchFacesResponse))
    
  //       FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
  //         const split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
  //         setSimilarity({ similarity: split.matchedFaces.length > 0 ? ((split.matchedFaces[0].similarity * 100).toFixed(2) + "%") : "does not match" })
  //         setArryResult([...arryResult, split])
  //       }, e => { setSimilarity({ similarity: e }) })
  //     }, e => { setSimilarity({ similarity: e }) })   
  //   })
  // }

  const matchFaces = () => {
    // if (imge1 == null || imge1.bitmap == null || imge1.bitmap == "" || imge2 == null || imge2.bitmap == null || imge2.bitmap == "")
    //   return

    for (let i = 0; i <= arrayImage.length; i++) {
      setSimilarity({ similarity: "Processing..." })
      let request = new MatchFacesRequest()
      let m1 = arrayImage[i]

      console.log('======m1', i,'<<<', m1)
      console.log('=m2=', imge2)
      //let mm1 = m1
      
      request.images = [m1, imge2] 
  
      FaceSDK.matchFaces(JSON.stringify(request), matchFacesResponse => {
        const response =  MatchFacesResponse.fromJson(JSON.parse(matchFacesResponse))
        console.log('=res=', response)
    
        FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
          const split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
          setSimilarity({ similarity: split.matchedFaces.length > 0 ? ((split.matchedFaces[0].similarity * 100).toFixed(2) + "%") : "does not match" })
          setArryResult([...arryResult, similarity])
        }, e => { setSimilarity({ similarity: e }) })
      }, e => { })   
    }
  }

  // Clear Result
  const clearResults = () => {
    setImg1(
      {uri: require('./images/portrait.png')}
    ) 
    setImg2(
      {uri: require('./images/portrait.png')}
    ) 
    setImge1(new MatchFacesImage())
    setImge2(new MatchFacesImage())
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.container}> 

        <View style={{ flexDirection: "column", padding: 5 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TouchableHighlight onPress={() => pickImage(true)}>
              <Image
                style={{
                  height: 150,
                  width: 150,
                }}
                source={img1.uri}
                resizeMode="contain" />
            </TouchableHighlight>
          </View>

          <View style={{ flexDirection: "column", alignItems: "center", padding: 5 }}>
            <TouchableHighlight onPress={() => pickImage(false)}>
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
          <Text style={{ marginLeft: -20 }}>Similarity: {similarity.similarity}</Text>
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
  
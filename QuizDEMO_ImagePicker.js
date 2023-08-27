import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar,
  Image
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const TextInp = () => {
  return (
    <TextInput
    editable
    multiline
    numberOfLines={4}
    maxLength={40}
    onChangeText={text => setUSRinput(text)}
    style={{
      borderWidth: 2,  // size/width of the border
      borderColor: 'lightgrey',  // color of the border
    }}
  />    
  )
}

const fixingDarn = () => {
  let newurl = encode(localUri);
}

const QuizDemo_ImagePicker = () => {
  const name = 'Maku';
  const [USRinput, setUSRinput] = useState('');
  const [fileGot, setfileGot] = useState('Hola');
  const [base64img, setBase64img] = useState("abc")

  const pickDocument = async () => {
    try {

        //https://stackoverflow.com/questions/67780721/convert-image-to-base64-in-expo-react-nativeonly-in-the-frontend-payloadtoola
        let result = await  ImagePicker.launchImageLibraryAsync({
            quality:1
        })

        var filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1, result.assets[0].uri.length);
        console.log(filename)

        setfileGot(filename)

        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
        setBase64img('data:image/png;base64,'+base64)
        //console.log(base64img)
        //let result = await DocumentPicker.getDocumentAsync();
        //let fileType = result.mimeType
        

        /*
        if (fileType == "image/png" || fileType == "image/jpeg"){
            console.log(fileType);
            setfileGot(result.mimeType)
        } else {
            setfileGot("Hola")
        }   

        //console.log(result.uri);
        */

      
    } catch(err) {
      console.log(err)
    }
  };

  return (
    <View style={styles.container}>

        <Text style={{fontSize: 30}}>Image Picker Demo!</Text>

        <Text> {'\n'}</Text>


        <Image style={{width: "100%", height: "50%", borderWidth: 1, borderColor: 'black'}} source={{uri: base64img}}/>

        <Text> {'\n'}</Text>

        <Button title={fileGot} onPress={pickDocument} />
        
        <StatusBar style="auto" />
    </View>
  );  
};

export default QuizDemo_ImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
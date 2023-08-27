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

  function execSQLiteFunc(DATABASE, STATEMENT){
    var dtbs = SQLite.openDatabase(DATABASE)
    
    /**/
    dtbs.transaction((txn) => {
        txn.executeSql(STATEMENT, [], (trans, results) => {
            console.log(results.rows._array)
            return results.rows._array
        }, (error) => {
            console.log("Error! AT LINE!")
        })
    })
  }
 
 
  function readDatabase(){
    var returnValue = execSQLiteFunc("A.db", `SELECT * FROM "QuestionSet"`)


  }

  return (
    <View style={styles.container}>

        <Text style={{fontSize: 30}}>SQLITE Test</Text>

        <Text> {'\n'}</Text>

        <Text> {'\n'}</Text>

        <Button title="Do SQLITE" onPress={() =>{
          console.log("SAFDSGDGFN")

        }} />
        
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
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

import { createSaveFile } from './InitiateSave';

import Quiz_Selector from './Quiz_Selector'
import Quiz_Editor from './Quiz_Editor'
import Quiz_Player from './Quiz_Player'
import Quiz_MainMenu from './Quiz_MainMenu';
import QuizDemo_ImagePicker from './QuizDEMO_ImagePicker';
import QuizDemo_SQliteSim from './QuizDEMO_SQLiteSim'

//import { multiple_Test } from './multipleTest'
//import { Quiz_Editor } from './Quiz_Editor'

const Stack = createNativeStackNavigator();

// creates the save file if there is no existing
//createSaveFile("UQG_SaveFile.db","SAVE") // <-- local main save file
//createSaveFile("Quiz1.db","./database/quizTemplate.db") // <-- local quiz save file

const App = () => {

  // quiz related variables
  const saveFile = SQLite.openDatabase("UQG_SaveFile.db")


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    textInChoice: {
      color: 'white',
      textAlign: 'center',
      margin: 10,
    },  
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu">
        {/* Debug Places */}
        <Stack.Screen name="ImgTest" component={QuizDemo_ImagePicker} options={{ header: () => null }}/>
        <Stack.Screen name="SQLTest" component={QuizDemo_SQliteSim} options={{ header: () => null }}/>


        {/* Actual menu */}
        <Stack.Screen name="MainMenu" component={Quiz_MainMenu} options={{ header: () => null }}/>
        <Stack.Screen name="Selector" component={Quiz_Selector} options={{ header: () => null }}/>
        <Stack.Screen name="Editor" component={Quiz_Editor} options={{ header: () => null }}/>
        <Stack.Screen name="Game" component={Quiz_Player} options={{ header: () => null }}/>
      </Stack.Navigator>
   </NavigationContainer>    
  );
}

//export default App

export default App


// change IP Address: set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.59
// expo start
// eas build -p android --profile preview
// eas build -p android --profile production (only with major updates bruH)
// https://stackoverflow.com/questions/72213464/how-to-navigate-with-react-native-expo
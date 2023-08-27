import * as React from 'react';

import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable,  ScrollView, TextInput, Modal, Alert, ToastAndroid} from 'react-native';
import { createSaveFile, removeSaveFile } from './InitiateSave';    
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import Dialog from "react-native-dialog";
import Toast from 'react-native-root-toast';

import { LinearGradient } from 'expo-linear-gradient';


const Stack = createNativeStackNavigator();

var NameQuiz = 'quizData.db'


//https://stackoverflow.com/questions/1144783/how-do-i-replace-all-occurrences-of-a-string-in-javascript
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function loadQuizData(userFileName, QuizData){
    var userMadeQuizzes = SQLite.openDatabase(userFileName)
                
    userMadeQuizzes.transaction((txn) => {
        txn.executeSql(
            `
            CREATE TABLE IF NOT EXISTS "QuestionSet" (
                "QuestionId" INTEGER,
                "QuizName" TEXT,
                "Question" TEXT,
                "Answer" TEXT,
                "Group" TEXT,
                "Picture" TEXT,
                PRIMARY KEY("QuestionId" AUTOINCREMENT)
            );
            `, [], (trans, results) => {
            
            console.log("Success! 1", userFileName, results)
        }, (error) => {
            console.log("Error: 1", userFileName)
        })
    })
    
    console.log("Created: "+userFileName)
    //console.log("DATABASE||DATABASE||DATABASE||"+userMadeQuizzes)


    userMadeQuizzes.transaction((txn) => {
        txn.executeSql(QuizData, [], (trans, results) => {
            console.log("Success! 2", userFileName)
        }, (error) => {
            console.log("Error!! 3: ", userFileName)
        })
    })

    //console.log("WHATTTT")
    userMadeQuizzes.transaction((txn) => {
        txn.executeSql("SELECT * FROM QuestionSet;", [], (trans, results) => {
        }, (error) => {
            console.log("Error!")
        })
    })
    /**/
}

function closeDatabase(Name){

    var databaseToBeClosed = SQLite.openDatabase(Name)
    databaseToBeClosed.closeAsync()
    databaseToBeClosed.deleteAsync()
    console.log("Closed", Name)
}


var firstLoad = true


const Quiz_MainMenu = ({ navigation }) => {
    //console.log(quizFile)
  
    // STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },

        quizBorder: {
            width: "100%",
            padding: "5%",
            borderColor: '#000000',
            borderWidth: 1,
            marginTop: "10%" ,
            backgroundColor: "#6C9BCF"          
        },

        newQuestionBorder: {
            width: "100%",
            padding: "5%",
            alignItems: 'center',
            borderColor: '#000000',
            borderWidth: 1,
            marginTop: "10%"
        },   

        editorHeader: {
            backgroundColor: '#4C4C6D',
            width: "100%",
            padding: "5%",
        },

        editorText: {
            color: '#FFF'
        },

        TextInput: {
            borderColor: '#000000',
            borderWidth: 1,
            padding: "3%",
        },

        bgShadow: {
            backgroundColor: "#000000",
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.5
        },

        modalContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },

        modalContent: {
            backgroundColor: '#ffffff',
            width: "80%",
            padding: "3%",

        },

        modalFlex: {
            display: "flex",
            flexDirection:"row",
            justifyContent:"space-around"
        },

        warningL: {
            position: "absolute",
            height: "100%",
            width: "100%",

        }

    });

    //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER 
 
    if (firstLoad){
        firstLoad = false
        //closeDatabase("HelloWorld.db")
        //closeDatabase(NameQuiz)
        createSaveFile(NameQuiz,"SAVE")
        //console.log("Initiated")
        
    }

    return (
    <View style={styles.container}>  
      <LinearGradient
        // Background Linear Gradient
        colors={['#5C469C', 'transparent']}
        start={{x: 0, y: 1}}
        end={{x: -0.1, y: 0.5}}
        style={styles.warningL}
      />

        
        <Text style={{fontSize: 30}}>Untitled Quiz Creator</Text>
        <Text>Formerly known as Maku's QuizHelper</Text>

        <Text>{'\n'}</Text>
        <Button title="Play Quiz"
        onPress={()=>{
            Alert.alert(`Sorry about that!`,`This section is still being work on!\nIt includes:\n
> Being able to donwload other user made quiz online!\n
> Compete with other players via highest score!\n   
> More panic modes!\n     
\n~Maku Santiran`)
        }}
        ></Button>

        <Text>{'\n'}</Text>
        <Button title="Manage Quiz"
        onPress={()=>{
            console.log("A")
            navigation.navigate({
                name: 'Selector',
                params: {
                    init: "init"
                },
            })
        }}
        ></Button>


    </View>
    );
}

export default Quiz_MainMenu

//export { App_Editor }

import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { createSaveFile, removeSaveFile } from './InitiateSave';    
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';


const multiple_Test = () => {
    //console.log(quizFile)
    var stack = []
    for (let i = 0; i < 10; i++) {
        stack.push(
          <View key={i}>
            <Text style={{ textAlign: 'center', marginTop: 5 }} >{i}</Text>
          </View>
        );
      }

    
    // STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });

    //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER 
    //removeSaveFile("Quiz1.db")
    
    return (
    <View style={styles.container}>
        <Text> こんにちわ!! </Text>
        <Button title="Create New" onPress={() => {console.log("Hello World!")}} />
        <Text>{'\n'}</Text>
        {stack}
    </View>
    );
}

//export default App_Editor


export { multiple_Test }

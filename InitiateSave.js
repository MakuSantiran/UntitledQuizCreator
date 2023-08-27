import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// https://stackoverflow.com/questions/55622372/expo-sqlite-use-existing-database
// only do this once!
async function createSaveFile(fileName, type) {
    var internalDbName = fileName; // Call whatever you want
    const sqlDir = FileSystem.documentDirectory + "SQLite/";    
    const saveFile = Asset.fromModule(require("./database/quizDatabase.db"));
    const quizTemplate = Asset.fromModule(require("./database/quizTemplate.db"));
    const sqliteBase = Asset.fromModule(require("./database/sqliteBase.db"));

    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
        console.log("Creating")
        await FileSystem.makeDirectoryAsync(sqlDir, {intermediates: true});
        
        // you could use switch case vhere
        if (type == "SAVE"){
            await FileSystem.downloadAsync(saveFile.uri, sqlDir + internalDbName).then(({ uri }) => {
                console.log('Finished downloading to ', uri);
            })
            console.log("Created SaveFile: "+fileName)
        }
 
        else if(type == "BASE"){
            await FileSystem.downloadAsync(sqliteBase.uri, sqlDir + internalDbName).then(({ uri }) => {
               // console.log('Finished downloading to ', uri);
            })
            console.log("Created New BaseQuiz: "+fileName)
        } 

        else if(type == "TEMPLATE"){
            await FileSystem.downloadAsync(quizTemplate.uri, sqlDir + internalDbName).then(({ uri }) => {
                console.log('Finished downloading to ', uri);
            })
            console.log("Created New Quiz: "+fileName)
        } 
        
    } else {
      console.log(fileName+" Already Exists")
      //console.log(FileSystem.getInfoAsync(sqlDir + fileName))
      //return SQLite.openDatabase(internalDbName);
      //await FileSystem.downloadAsync("./database",sqlDir + internalDbName);
    }
}
// Then you can use the database like this


async function removeSaveFile(Name) {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
        
    await FileSystem.deleteAsync(sqlDir + Name, {intermediates: true});
    console.log("Deleted "+Name)   

}


export {createSaveFile, removeSaveFile}
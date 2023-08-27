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



const Stack = createNativeStackNavigator();

var NameQuiz = 'quizData.db'


//https://stackoverflow.com/questions/1144783/how-do-i-replace-all-occurrences-of-a-string-in-javascript
function replaceAll(str, find, replace) {
    if (str.includes(find)) {
        return str.replace(new RegExp(find, 'g'), replace);
    } else {
        return str
    }
    return str
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
                "Picture" BLOB,
                "Disabled" INTEGER,
                "RemixExclusion" TEXT,
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


var firstLoad = true



const Quiz_Selector = ({ navigation, route }) => {
    //console.log(quizFile)
     
    var quizList = []

    const [quizListC, setQuizList] = useState()

    const [keyIt, addKeyIt] = useState(0)
    
    const [tempArray, setTempArray] = useState([])
    const [quizDisplay, setQuizDisplay] = useState([])
    const [displayCreator, setDisplayCreator] = useState(false)
    const [newTitle, setNewTitle] = useState(false)
    const [newDescription, setNewDescription] = useState("A description : ]")


    const [showModal, setShowModal] = useState(false)
    const [selectedQuizName, setSelectedQuizName] = useState("")
    const [selectedQuizDescription, setSelectedQuizDescription] = useState("")
    const [quizAddress, setQuizAddress] = useState("")

    useEffect(() => {
        

        if (quizListC == "A"){
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            setQuizDisplay([])
            displayLocalFiles()
            setQuizList("C")
        }

    }, [quizListC]);


    function addNewQuizToDisplay(Label, Description, quizFileAddress, keyID, REFRESH = false){
        console.log("Pushed! The"+ quizFileAddress)
        
        // this fixes thing
        quizList.push(quizDisplay)

        quizList.push(
            <View key={keyID}>
                <Pressable 
                style={styles.quizBorder}
                onPress={() => {
                    setSelectedQuizName(Label)
                    setSelectedQuizDescription(Description)
                    setQuizAddress(quizFileAddress)

                    console.log(Label, quizFileAddress)
                    setShowModal(true)
                }}>
                
                <Text style={{color: "#FFFFFF"}}> {Label} </Text>

                </Pressable>
            </View>
        );

        console.log(">>>>>>>>>>>>>>>>>>>>>>|||||||||||||"+quizList, keyID)
    }


    function closeDatabase(Name){

        while(quizList.length) {
            quizList.pop()
        }
        setQuizDisplay(quizList)

        var databaseToBeClosed = SQLite.openDatabase(Name)
        databaseToBeClosed.closeAsync()
        databaseToBeClosed.deleteAsync()
        console.log("Closed", Name)
    }

    const importQuiz = (Name) => {     
        
        var quizFile = SQLite.openDatabase(Name)
        console.log(">>>>>>>>>>>>>>>>")
        //console.log(quizFile)

        quizFile.transaction((txn) => {
            txn.executeSql("SELECT * FROM QuizDatabase;", [], (trans, results) => {
            console.log(results.rows._array)

            var i = 0
            for (i=0; i<2; i++){
                var userQuizName = results.rows._array[i]["QuizName"]
                var userQuizId = results.rows._array[i]["QuizId"]
                var userQuizData = results.rows._array[i]["QuizData"]

                var noSpaceName = replaceAll(userQuizName, " ", "")
                
                var userFileName = noSpaceName+"_"+userQuizId+".db"

                loadQuizData(userFileName, userQuizData)

                //addNewQuizToDisplay(Label, Description, quizFileAddress, keyID, REFRESH = false)

                /*Remove savefile first*/
                //removeSaveFile(fileName)
                //createSaveFile(userFileName,"BASE")

            }
            setQuizDisplay(quizList)
            //setQuizDisplay(quizList)

          },
            (error) => {
                console.log("Error Reading database")
                //console.log("execute error: " + JSON.stringify(error))
          });
        });
    }

    function loadLocalQuiz(Name){     
        
        var userMadeQuizzes = SQLite.openDatabase(Name)
        //console.log("Created: "+fileName)
    
        console.log(Name+" >>>>>>>>>>>>>>>>>>>>>>>>>>>")

        userMadeQuizzes.transaction((txn) => {
            txn.executeSql('SELECT * FROM QuestionSet;', [], (trans, results) => {
                console.log("WhatTheHeck? "+results.rows._array)
            }, (error) => {
                console.log("Error!! loadinG")
            })
        })

        /*
        var userMadeQuiz = SQLite.openDatabase(Name)
        console.log(">>>>>>>>>>>>>>>>")
        //console.log(quizFile)

        userMadeQuiz.transaction((txn) => {
          txn.executeSql("SELECT * FROM QuestionSet;", [], (trans, results) => {
            console.log(results.rows._array)
          },
            (error) => {
                console.log("Error Reading database")
                //console.log("execute error: " + JSON.stringify(error))
          });
        });
        /*/
    }

    function clearDisplay(){
        quizList = []
        setQuizDisplay(quizList)
        addKeyIt(0)
        console.log("Removed", quizList, quizDisplay.length)
    }

    function illegalCharacterCheck(text){
        if (text.includes("\\")) return true;
        if (text.includes("/")) return true;
        if (text.includes(":")) return true;
        if (text.includes("*")) return true;
        if (text.includes("?")) return true;
        if (text.includes('"')) return true;
        if (text.includes("<")) return true;
        if (text.includes(">")) return true;
        if (text.includes("|")) return true;

        return false;
    }

    function displayLocalFiles(){

       // clearDisplay()

        var userMadeQuizzes = SQLite.openDatabase(NameQuiz)

        userMadeQuizzes.transaction((txn) => {
            txn.executeSql('SELECT * FROM LocalSaveFiles;', [], (trans, results) => {

               // console.log("START START START", quizDisplay.length, quizList)

                if (quizDisplay.length > 0){
                    setQuizDisplay([])
                }

                let i = 0
                for (i=0; i<results.rows._array.length; i++){
                    var fileAddress = results.rows._array[i]["QuizFileName"]
                    var quizDescription = results.rows._array[i]["QuizDescription"]
                    var newname = results.rows._array[i]["QuizName"]

                    addKeyIt(keyIt + i)

                    console.log(keyIt)
                    
                    addNewQuizToDisplay(newname, quizDescription, fileAddress, keyIt+i, false)

                    console.log("WhatTheHeck? "+newname+" "+fileAddress+" "+quizDescription)
                }
            
                setQuizDisplay(quizList)
                
                
            }, (error) => {
                console.log("Error!! Displaying")
            })
        })               
    }

    const deleteAQuiz = (fileAddress) =>{
        console.log("DELETING DELETING DELETING",NameQuiz, fileAddress)

        var userMadeQuizzes = SQLite.openDatabase(NameQuiz)
        var sqlStatement = `DELETE FROM "LocalSaveFiles" WHERE "QuizFileName" == '${fileAddress}';`

        console.log(sqlStatement)

        userMadeQuizzes.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                closeDatabase(fileAddress)
                console.log("What IS iTT??",fileAddress)
                //console.log("Deleted", results)
                setQuizList("A")

                Alert.alert("Deleted "+selectedQuizName+"!","You have succesfully deleted it!")
                setShowModal(false)
            }, (error) => {
                console.log("Error!! Deletion 422")
            })
        })   
        
    }

    const createANewQuiz = (newQuiz, quizDescription = "No Description Provided") =>{

        var userMadeQuizzes = SQLite.openDatabase(NameQuiz)
        //console.log("Created: "+fileName)
        
        if (newQuiz == null || newQuiz == ""){
            console.log("Hey you cant input that!")
            alert("Please put something in the textbox!")
            return
        }






        console.log(NameQuiz+" >>>>>>>>>>>>>>>>>>>>>>>>>>>")

        /*/
        userMadeQuizzes.transaction((txn) => {
            txn.executeSql('SELECT * FROM LocalSaveFiles;', [], (trans, results) => {
                console.log("WhatTheHeck? "+results.rows._array)
            }, (error) => {
                console.log("Error!!")
            })
        })        
        /*/

        var noSpaceInDatabase = replaceAll(newQuiz, " ", "")

        // this checks for illegal characters
        if (illegalCharacterCheck(noSpaceInDatabase)){
            Alert.alert("OOF",`Unfortunately the following characters aren't allowed: \\ / : * ? " < > |`)
            return
        }

        console.log("CREATED CREATED CREATED: "+noSpaceInDatabase)


        // handles the ' on quiz description
        var filtiredDescription = replaceAll(quizDescription,"'","''")


        userMadeQuizzes.transaction((txn) => {
            txn.executeSql(`INSERT INTO "LocalSaveFiles" VALUES (NULL, NULL, '${newQuiz}', '${noSpaceInDatabase}.db', '${filtiredDescription}', NULL)`, [], (trans, results) => {
                console.log("WhatTheHeck? "+results.rows._array)
                var noSpaceName = replaceAll(newQuiz, " ", "")
                var fileAddress = noSpaceInDatabase+".db"
                
                console.log("THE FILE ADDRESS IS: "+fileAddress)

                var NewQuiz = SQLite.openDatabase(fileAddress)

                // step two is creating the tables
                NewQuiz.transaction((txn) => {
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
                        `, [], (trans, results2) => {
                            
                            addKeyIt(keyIt + 1)

                            addNewQuizToDisplay(newQuiz, quizDescription, fileAddress, keyIt, false)
                            setQuizDisplay(quizList)

                            console.log("Success! 2", fileAddress)
                            //ToastAndroid.show(newQuiz+' '+quizDescription+' '+fileAddress, ToastAndroid.SHORT);
                            ToastAndroid.show('You have created '+newQuiz+' quiz file!', ToastAndroid.SHORT);

                        console.log("Success! 1", fileAddress, results2)

                    }, (error) => {
                        console.log("Error: 1", fileAddress)
                    })
                })                


                
            }, (error) => {
                alert("QuizName Already Exists!")
                console.log("Error!! 444")
            })
        })

        

        
    }
    
    // STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
    const styles = StyleSheet.create({
        container: {
            marginTop: Constants.statusBarHeight,
            flex: 1,
            backgroundColor: '#fff',
        },

        quizBorder: {
            width: "100%",
            padding: "5%",
            borderColor: '#000000',
            borderWidth: 1,
            marginTop: "1%" ,
            backgroundColor: "#6C9BCF"          
        },

        newQuestionBorder: {
            position: "absolute",
            width: "50%",
            padding: "7%",
            alignItems: 'center',

            backgroundColor: "#4C4C6D",

            bottom: "5%",
            alignSelf: 'center',

            shadowOffset: { width: 0, height: 4 },
            shadowColor: '#000',
            shadowOpacity: 0.8,
            shadowRadius: 40, 
            elevation: 10,
        },   

        groupAddText: {
            color: "#fff",
            fontWeight: "bold"
        },

        editorHeader: {
            position: "absolute",
            top: "0%",
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

        pseudoPic: {
            backgroundColor: "#335cc9",
            width: "50%",
            height: "100%",
        }

    });

    //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER //RENDER 
    //removeSaveFile("Quiz1.db")
    
    // <Button title="Load Quiz1" onPress={() => {loadQuiz("MyFirstQuiz_1.db");}} />
    // <Button title="Load Quiz2" onPress={() => {loadQuiz("ColorsQuiz_2.db");}} />
    // <Button title="Create New" onPress={() => {createSaveFile(NameQuiz,"SAVE")}} />
    // <Button title="Import Quiz" onPress={() => {importQuiz(NameQuiz);}} />

    // <Text>{'\n'}</Text>
    // <Button title="Delete" onPress={() => {removeSaveFile(NameQuiz);}} />
    // <Button title="Delete2" onPress={() => {removeSaveFile("MyFirstQuiz_1.db");}} />
    // <Button title="Delete3" onPress={() => {removeSaveFile("ColorsQuiz_2.db");}} />

    //createSaveFile(NameQuiz,"SAVE")


    /*/
        return(
        <Text> K o N i c h i w A </Text>
        
        <Text>{'\n'}</Text>
        <Button title="Create New" onPress={() => {createSaveFile(NameQuiz,"SAVE")}} />
        <Button title="Import Quiz" onPress={() => {importQuiz(NameQuiz);}} />

        <Text>{'\n'}</Text>
        {quizDisplay}

        <Text>{'\n'}</Text>
        <Button title="Close Database" onPress={() => {alert("Closed Database!"); closeDatabase(NameQuiz);}} />
        <Button title="Close Database2" onPress={() => {alert("Closed Database!"); closeDatabase("MyFirstQuiz_1.db");}} />
        <Button title="Close Database3" onPress={() => {alert("Closed Database!"); closeDatabase("ColorsQuiz_2.db");}} />
        )
    /*/

    /*/


        <Button title="Create New" onPress={() => {createSaveFile(NameQuiz,"SAVE")}} />
        <Text>{'\n'}</Text>
        <Button title="Display Content" onPress={() => {setQuizList("A")}} />
        <Text>{'\n'}</Text>
        <Button title="Clear Contentt" onPress={() => {clearDisplay()}} />
        <Text>{'\n'}{'\n'}{'\n'}{'\n'}</Text>
        <Button title="Close Database" onPress={() => {alert("Closed Database!"); closeDatabase(NameQuiz);}} />
        <Text>{'\n'}</Text>
        <Button title="Close Database2" onPress={() => {alert("Closed Database!"); closeDatabase("HelloWorld.db");}} />
        <Text>{'\n'}</Text>
        <Button title="Close Database3" onPress={() => {alert("Closed Database!"); closeDatabase("HelloWorld2.db");}} />
        <Text>{'\n'}</Text>
        <Button title="Display the piece of shi" onPress={() => {console.log("PLEASE:"+quizDisplay)}} />
        


    /**/
    React.useEffect(() => {
        firstLoad = true   
        clearDisplay()
        setQuizList("A") 
        console.log("AB")  
    }, [route.params?.init]);
    /**/

    if (firstLoad){
        firstLoad = false
        //closeDatabase("HelloWorld.db")
        //closeDatabase(NameQuiz)
        //createSaveFile(NameQuiz,"SAVE")
        clearDisplay()
        setQuizList("A") 
        console.log("Initiated")
        
    }

 

    return (

    <View style={styles.container}>
        <ScrollView>
        <View style={{margin: "8%"}}></View>

            {quizDisplay}

            {/* This one is for creating a new quiz */}
            <Dialog.Container visible={displayCreator}>
            <Dialog.Title>Create a new Quiz! </Dialog.Title>
                <Text>{'\n'} Image Picker Coming Soon! {'\n'}</Text>
            
                <Text> Title </Text>
                <TextInput 
                    style={styles.TextInput}            
                    multiline={true}
                    value={newTitle}
                    onChangeText={setNewTitle}
                    maxLength={255}
                ></TextInput>


                <Text> Description </Text>
                <TextInput 
                    style={styles.TextInput}            
                    multiline={true}
                    value={newDescription}
                    onChangeText={setNewDescription}
                    maxLength={255}
                ></TextInput>

                <Dialog.Button label="Cancel"  onPress={() => {setDisplayCreator(false)}}/>
                <Dialog.Button label="Create" onPress={() => {
                    createANewQuiz(newTitle, newDescription)
                    setDisplayCreator(false)
                }} />
            </Dialog.Container>



            <Modal
                transparent={true}
                visible={showModal}
            >
                <View style={styles.modalContainer}>

                    <Pressable
                    style={styles.bgShadow}
                        onPress={() => {
                            setShowModal(!showModal);
                        }}                        
                    ></Pressable>

                    <View style={styles.modalContent}>
                        
                        <View style={{position: "absolute", top: "-5%", right: "0%", alignContent: "center"}}>
                            <Pressable 
                            style={{
                                padding: "3%", 
                                backgroundColor: "#E76161",
                            }}
                            
                            onPress={() => {
                                clearDisplay()
                                Alert.alert('Warning!', `You're about to delete a QUIZ FILE! Do you still want to proceed?`, [
                                {
                                    text: 'Nope!',
                                    onPress: () => {setQuizList("A")},
                                    style: 'cancel',
                                },
                                {text: 'Yes!', onPress: () => deleteAQuiz(quizAddress)},
                                ]);                            
                                //deleteQuestion(selectedQuestionId)
                            }}
                            >
                                <Text style={{color: "#FFF"}}>     Delete </Text>
                            </Pressable>
                            
                        </View>


                        <View style={styles.modalFlex}>

                            <View style={styles.pseudoPic}>
                                <Text style={{color: "#FFF", fontSize: 30}}> : ) </Text>
                                <Text style={{color: "#FFF"}}>  Thumbnail Image{'\n'}  Coming soon!{'\n'} </Text>
                            </View>

                            <View style={{width: "40%"}}> 
                                <Text style={{fontSize: 18, fontWeight: "bold"}}>{selectedQuizName} {'\n'}</Text>
                                <Text>Ratings: N/A {'\n'}</Text>
                                <Button title="Publish?"
                                onPress={() => {
                                    // Add a Toast on screen.
                                    Alert.alert("Coming Soon! Still Working on it","~Maku Santiran")
                                }}
                                ></Button>
                            </View>
                        
                        </View>

                        <Text>
                        {'\n'}
                        {selectedQuizDescription}
                        {'\n'}
                        {'\n'}
                        {'\n'}
                        </Text>

                        <View style={styles.modalFlex}>

                            <Button title="Cancel"
                            style={styles.modalFlexPerBtn}
                            onPress={() => {
                                setShowModal(false)
                            }}
                            />   

                            <Button title="Edit"
                            style={styles.modalFlexPerBtn}
                            onPress={() => {
                                setShowModal(false)
                                navigation.navigate({
                                    name: 'Editor',
                                    params: {
                                        quizFile: quizAddress,
                                        quizName: selectedQuizName
                                    },
                                })
                                
                            }}
                            />  

                            <Button title="Play"
                            style={styles.modalFlexPerBtn}
                            onPress={() => {
                                setShowModal(false)
                                Alert.alert('Now playing '+selectedQuizName+'!', `Select a game mode for the quiz!`, [
                                    {
                                        text: 'Go back',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Practice Mode',
                                        onPress: () => {
                                            navigation.navigate({
                                                name: 'Game',
                                                params: {
                                                    quizFile: quizAddress,
                                                    mode: "PracticeMode"
                                                },
                                            })
                                        },
                                    },
                                    {
                                        text: 'Classic Mode', 
                                        onPress: () => {
                                            navigation.navigate({
                                                name: 'Game',
                                                params: {
                                                    quizFile: quizAddress,
                                                    mode: "ClassicMode"
                                                },
                                            })
                                        }
                                    },
                                ]);       
                                
                            }}
                            />  


                        </View>
                    </View>

                </View>
            </Modal>
            
            <Text style={{marginBottom: "25%"}}></Text>
            <StatusBar style="auto" />
        </ScrollView>

        <View style={styles.editorHeader}>
                <Text style={styles.editorText} > Manage Quiz </Text>
        </View>        

        <Pressable style={styles.newQuestionBorder} onPress={(e) => {
                setDisplayCreator(true)
            }}>
                <Text style={styles.groupAddText}> New Quiz </Text>
        </Pressable>             
    </View>
    );
}

export default Quiz_Selector

//export { App_Editor }

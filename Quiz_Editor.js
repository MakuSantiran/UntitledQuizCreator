import * as React from 'react';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

import { useState, useEffect,  useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, ScrollView, Modal, TextInput, Alert, ToastAndroid, Image} from 'react-native';

import DialogInput from 'react-native-dialog-input';
import Dialog from "react-native-dialog";
import {Picker} from '@react-native-picker/picker';

import { createSaveFile, removeSaveFile } from './InitiateSave';    
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

var NameQuiz = 'quizData.db'


//https://stackoverflow.com/questions/1144783/how-do-i-replace-all-occurrences-of-a-string-in-javascript
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function handleInput(e) {
    console.log(e.target.value);
}



const Quiz_Editor = ({ navigation, route }) => {

    console.log("HEY LISTEN")

    var keyIt = 0
    var groupForUseState = []
    var groupHeader = []
    var groupList = []
    var currentQuiz = ""
    var positionIndVar = 0

    const [fileAddress, setFileAddress] = useState("")
    const [groupDisplay, setGroupDisplay] = useState([])
    const [groupListSlct, setGroupListSlct] = useState([])
    const [groupChoice, setGroupChoice] = useState([])

    const [quizName, setQuizName] = useState([""])

    // for picker
    const [newGroupName, setNewGroupName] = useState("");


    // editor variables
    const [selectedGroup, setSelectedGroup] = useState();
    const [selectedGroupTxt, setSelectedGroupTxt] = useState();
    const [questionTxt, setQuestionText] = useState();
    const [answerTxt, setAnswerText] = useState();
    const [selectedPic, setSelectedPic] = useState("Null");
    const [questionDisabled, setQuestionDisabled] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState();


    const [isEditable, setIsEditable] = useState(false);
    const [onExistingQuestion, setOnExistingQuestion] = useState(false);

    // GUI related things
    const [showModal, setShowModal] = useState(false)
    const [showGroupEdit, setShowGroupEdit] = useState(false)
    const [showEmptyMessage, setShowEmptyMessage] = useState("none")
    
    // Scroll view things
    const scrollRef = useRef();
    const [dataSourceCords, setDataSourceCords] = useState([]);
    const [positionInd, setpositionInd] = useState(positionIndVar)
    var scrollToVar = 0
    var recentlyEditedID = 0
    

    const addgroupHeader = (userFileName, arrayQuestion, Group, QuestionId, Picture, keyID) => {
        // group header
        groupHeader.push(
            <View key={keyID} style={styles.groupBorder}>
                <Pressable
                    onPress={(e) => {
                        setNewGroupName()
                        setSelectedGroupTxt(Group)
                        setShowGroupEdit(true)
                    }}
                >
                    <Text style={styles.groupText} >{Group}</Text>
                </Pressable>
            </View>
        );
        
        // <Button title={Group}/>

        /**/
        var groupArray = arrayQuestion[Group]
        //console.log("LOOOK"+groupArray[0][0]["Question"])
        
        // questions
        let i1=0
        for (i1=0; i1<groupArray.length; i1++){
            keyIt = keyIt + 1
            let curQuestion = groupArray[i1][0]["Question"]
            let curAnswer = groupArray[i1][0]["Answer"]
            let curQuestionId = groupArray[i1][0]["QuestionId"]
            let pic = groupArray[i1][0]["Picture"]
            let disable = groupArray[i1][0]["Disabled"]

            let specialMarker = ""
            let disabledValue = false

            let questionBGColor = "#FFFFFF"

            //console.log("DisabledValue is "+disable)
            //console.log("RECENTLY EDITED WAS "+recentlyEditedID)

            if (disable == 1){
                specialMarker = specialMarker+"⛔"
                disabledValue = true
            }

            //check if may image
            if (pic != "None"){
                specialMarker = specialMarker+"📷"
                console.log("AHAAAA")
            }

            // if this was the recently thenn
            if (recentlyEditedID == curQuestionId){
                questionBGColor = "#DDDDDD"
            }            

            groupHeader.push(
                <View 
                    key = {keyIt}
                    style={styles.coverAll}
                    onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        dataSourceCords[positionIndVar] = layout.y;
                        setDataSourceCords(dataSourceCords);
                        
                        //console.log('height:', layout.height);
                        //console.log('width:', layout.width);
                        //console.log('x:', layout.x);
                        //console.log('y:', layout.y);

                        // if this was the recently thenn
                        if (recentlyEditedID == curQuestionId){
                            scrollToVar = positionIndVar
                        }

                        setpositionInd(positionIndVar)
                        //console.log("ITERATION FOR SCROLLING THING "+ positionIndVar)
                        positionIndVar = positionIndVar + 1    
                    }}                
                >
                    <Pressable value={groupArray[i1][0]["Question"]} onPress={(e) => {
                        setSelectedGroupTxt(Group)
                        setQuestionText(curQuestion)
                        setAnswerText(curAnswer)
                        setSelectedQuestionId(curQuestionId)
                        setSelectedPic(pic)
                        setQuestionDisabled(disabledValue)
                        setOnExistingQuestion(true)
                        setIsEditable(false);
                        setShowModal(true);
                        console.log(curQuestionId)
                    }}>

                        <View style={{
                            borderColor: '#000000',
                            backgroundColor: questionBGColor,
                            borderWidth: 1,
                            padding: "5%",
                            borderTopWidth: 0,                            
                        }}>
                            <Text>{groupArray[i1][0]["Question"]}</Text>
                            <Text style={{color: "#7C96AB"}}>Answer: [{groupArray[i1][0]["Answer"]}]</Text>
                            <Text style={{position: "absolute", right: "2%"}}>{specialMarker}</Text>                            
                        </View>

                    </Pressable>
                </View>
            ); 
        }   

        // le add buttomn
        keyIt = keyIt + 1
        groupHeader.push(
            <View key={keyIt}>
                <Button title="+" onPress={() => {
                    setSelectedGroupTxt(Group)
                    setQuestionText()
                    setAnswerText()
                    setSelectedPic("None")
                    setOnExistingQuestion(false)
                    setIsEditable(false)
                    setShowModal(true)
                }}/>
                <Text>{'\n'}</Text>
            </View>
        ); 

        keyIt = keyIt + 1
        // for the picker
        groupChoice.push(
            <Picker.Item key={keyIt} label={Group} value={Group}/>
        )

        setTimeout(() => {
            console.log("Scrolling to "+scrollToVar+"||"+ dataSourceCords[scrollToVar - 1])
            scrollRef.current.scrollTo({
                x: 0,
                y: dataSourceCords[scrollToVar - 1],
                animated: true,
            });
        }, 220);

        /*/
        
 
        /**/
       //console.log(">>>>>>>>>>>>>>>>>>>>>>|||||||||||||"+keyIt)
    }

    function loadQuizData(userFileName, QuizData){
        var userMadeQuiz = SQLite.openDatabase(userFileName)

        userMadeQuiz.transaction((txn) => {
            txn.executeSql("SELECT * FROM QuestionSet;", [], (trans, results) => {
                console.log(results.rows._array)
            }, (error) => {
                console.log("Error!")
            })
        })
        /**/
    }

    // this is very tedious but for now and for the sake of time, this is the most simpliest way to do it
    function getGroups(userFileName){
        var userMadeQuiz = SQLite.openDatabase(userFileName)
        var GroupDictionary = {}

        // first get the list of groups
        userMadeQuiz.transaction((txn) => {
            txn.executeSql('SELECT DISTINCT "Group" FROM QuestionSet;', [], (trans, results) => {
                
                // initiate the group 
                var i = 0
                for (i=0; i<results.rows._array.length; i++){
                    GroupDictionary[results.rows._array[i]["Group"]] = []
                    groupList.push(results.rows._array[i]["Group"])
                }
                //setGroupList(GroupDictionary)
                setGroupListSlct(groupList)

                    /* Phase 2 */
                    userMadeQuiz.transaction((txn) => {
                        txn.executeSql('SELECT * FROM QuestionSet', [], (trans, results2) => {
                            
                            // add the pieces of shi- groups
                            var i = 0
                            for(i=0; i<results2.rows._array.length; i++){
                                var group = results2.rows._array[i]["Group"]
                                var Id = results2.rows._array[i]["QuestionId"]
                                if (group in GroupDictionary){
                                    GroupDictionary[group].push([results2.rows._array[i], Id])
                                }
                            }

                            //console.log(results.rows._array)
                            //setGroupList(ListOfGroups)

                                // this just gets the distinct groups
                                userMadeQuiz.transaction((txn) => {
                                    txn.executeSql('SELECT DISTINCT "Group" FROM QuestionSet;', [], (trans, results3) => {
                                        console.log("Data Gathered!")
                                        //console.log(results.rows._array)
                        
                                        console.log("Initiating step 3")
                                        //console.log(GroupDictionary)

                                        if (results3.rows._array.length == 0){
                                            setShowEmptyMessage("flex")
                                            console.log("Empty!")
                                        }
                                        
                                        var i = 0
                                        for (i=0; i<results3.rows._array.length; i++){
                                            var group = results3.rows._array[i]["Group"]
                                            var Picture = results3.rows._array[i]["Picture"]
                                            
                                            addgroupHeader(userFileName, GroupDictionary, group, scrollToVar, Picture, keyIt)
                                            keyIt = keyIt + 1
                                            setShowEmptyMessage("none")
                                        }
                                        
                                        //console.log(dataSourceCords);

                                        setGroupDisplay(groupHeader)
                                        console.log("Step 3 Finished")
                                    }, (error) => {
                                        console.log("Error!")
                                    })
                                })

                            console.log("Step 2 finished")
                        }, (error) => {
                            console.log("Error!")
                        })
                    })
                    /**/  
                console.log("Step 1 finished")
            }, (error) => {
                console.log("Error!")
            })
        })
        //console.log(groupList)
    }

    function hideGroup(){
        setShowGroupEdit(false)
    }

    function pressedGroupChange(oldName, NewName){
        console.log("OldName")
        //modifyGroupName(selectedGroupTxt, newGroupName)
    }

// CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) 
// CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) 
// CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) // CRUD OPERATIONS YAY (ARGH) 

    function modifyGroupName(Group, NewGroupName){
        var userMadeQuiz = SQLite.openDatabase(fileAddress)
        var sqlStatement = `UPDATE "QuestionSet" SET 'Group' = "${NewGroupName}" WHERE "Group" == '${Group}';`
        
        //console.log(sqlStatement)

        if (newGroupName == undefined || newGroupName == " "){
            console.log("Hey you cant input that!")
            alert("Please put something in the textbox!")
            return
        }

        userMadeQuiz.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                console.log(results.rows._array)
            }, (error) => {
                console.log("Error! Cant Update.. looks like something's wronng with command")
            })
        })

        groupHeader.pop(); 
        setGroupDisplay([])
        getGroups(fileAddress)
        setShowModal(false);
        setNewGroupName()
        ToastAndroid.show('You have modified "'+Group+'" group name!', ToastAndroid.SHORT);
    }

    function updateQuestionPic(ID, PictureURI){
        
        var userMadeQuiz = SQLite.openDatabase(fileAddress)
        var sqlStatement = 
        `UPDATE "QuestionSet" SET 
            'Picture' = "${PictureURI}"
        WHERE "QuestionID" == ${ID};`

        console.log(sqlStatement)

        /**/
        userMadeQuiz.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                console.log("UPDATED Only PIC "+results.rows._array)
            }, (error) => {
                console.log("Error! Cant Update PIC.. looks like something's wronng with command")
            })
        })        
    }

    function modifyQuestion(ID, Question, Answer, Group, PictureURI, booleanDisable){
        console.log(Group)

        if (Answer == undefined || Question == undefined){
            console.log("Hey you cant input that!")
            Alert.alert("Missing values", "Please put something in the Question and Answer textbox!")
            return
        }

        if (Group == undefined){
            Alert.alert("Missing Group Name", "Please put the group name so the quiz would sort the choices for you")
            return
        }

        var filtiredQuestion = replaceAll(Question,"'","''")
        var filtiredAnswer = replaceAll(Answer,"'","")
        var filtiredGroup = replaceAll(Group,"'","''")
        var filtiredDisabled = 0

        if (booleanDisable == true){
            filtiredDisabled = 1
        }

        var userMadeQuiz = SQLite.openDatabase(fileAddress)
        var sqlStatement = 
        `UPDATE "QuestionSet" SET 
            'QuestionId' = ${ID}, 
            'QuizName' = "${quizName}", 
            'Question' = "${filtiredQuestion}", 
            'Answer' = "${filtiredAnswer}", 
            'Group' = "${filtiredGroup}", 
            'Picture' = "${PictureURI}",
            'Disabled' = ${filtiredDisabled},
            'RemixExclusion' = ""
        WHERE "QuestionID" == ${ID};`

        console.log(sqlStatement)

        /**/
        userMadeQuiz.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                console.log("UPDATED ONE OF THIS THINGS? "+results.rows._array)
            }, (error) => {
                console.log("Error! Cant Update.. looks like something's wronng with command")
            })
        })
         
        recentlyEditedID = ID

        groupHeader.pop(); 
        setGroupDisplay([])
        getGroups(fileAddress)
        setShowModal(!showModal);
        ToastAndroid.show('You have modified a question!', ToastAndroid.SHORT);
        /**/
    }

    function addQuestion(ID, Question, Answer, Group, PictureURI, booleanDisable){
        var userMadeQuiz = SQLite.openDatabase(fileAddress)
        
        if (Answer == undefined || Question == undefined){
            console.log("Hey you cant input that!")
            Alert.alert("Missing values", "Please put something in the Question and Answer textbox!")
            return
        }

        if (Group == undefined){
            Alert.alert("Missing Group Name", "Please put the group name so the quiz would sort the choices for you")
            return
        }

        var filtiredQuestion = replaceAll(Question,"'","''")
        var filtiredAnswer = replaceAll(Answer,"'","")
        var filtiredGroup = replaceAll(Group,"'","''")

        var filtiredDisabled = 0

        if (booleanDisable == true){
            filtiredDisabled = 1
        }

        var sqlStatement = `
        INSERT INTO "QuestionSet" 
        VALUES (
            NULL,
            '${quizName}',
            '${filtiredQuestion}',
            '${filtiredAnswer}',
            '${filtiredGroup}',
            '${PictureURI}',
            ${filtiredDisabled},
            ''
        );`
        
        console.log(sqlStatement)

        /**/
        userMadeQuiz.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                console.log("ADDED A NEW QUESTIONID"+results.rows._array)


                userMadeQuiz.transaction((txn) => {
                    txn.executeSql(`SELECT * FROM 'QuestionSet' ORDER BY "QuestionId" DESC LIMIT 1`, [], (trans, results2) => {
                        recentlyEditedID = results2.rows._array[0]["QuestionId"]
                        console.log("THE LATEST QUESTION WAS FADSGGDSDEGSDGF "+recentlyEditedID)

                        //SELECT * FROM 'QuestionSet' ORDER BY "QuestionId" DESC LIMIT 1
                        
                    }, (error) => {
                        console.log("Error! AT READING LATEST ADDED")
                    })
                })

            }, (error) => {
                console.log("Error! AT INSERTING!")
            })
        })
        /**/

        groupHeader.pop(); 
        setGroupDisplay([])
        getGroups(fileAddress)
        setShowModal(!showModal);
        ToastAndroid.show('You have added a new question!', ToastAndroid.SHORT);
    }

    function deleteQuestion(selectedQuestionId){
        var userMadeQuiz = SQLite.openDatabase(fileAddress)

        var sqlStatement = `DELETE FROM "QuestionSet" WHERE "QuestionId" == `+selectedQuestionId+`;`
        console.log(sqlStatement)
        
        /**/
        userMadeQuiz.transaction((txn) => {
            txn.executeSql(sqlStatement, [], (trans, results) => {
                console.log(results.rows._array)
            }, (error) => {
                console.log("Error! AT LINE!")
            })
        })

        groupHeader.pop(); 
        setGroupDisplay([])
        getGroups(fileAddress)
        setShowModal(!showModal);  
        /**/
        ToastAndroid.show('You have deleted that particular question!', ToastAndroid.SHORT);
    }

    
  const pickPicture = async () => {
    try {
        //https://stackoverflow.com/questions/67780721/convert-image-to-base64-in-expo-react-nativeonly-in-the-frontend-payloadtoola
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true,
            aspect:[1,1],
            quality:0.9
        })



        //console.log("The quality of the picture was "+result.assets[0].fileSize)
        let fileExtension = result.assets[0].uri.substr(result.assets[0].uri.lastIndexOf('.') + 1);
        const pictureInfo = await FileSystem.getInfoAsync(result.assets[0].uri)
        const pictureSize = pictureInfo.size  / 1024 / 1024

        console.log("Picture size is "+pictureSize)

        console.log(fileExtension)
        //var filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1, result.assets[0].uri.length);

        // this checks if the image size is way too big
        if (pictureSize > 0.1){
            var manipResult = await manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 720, height: 720 } }],
                { compress: 0.2, format: fileExtension }
            );
            console.log("A HIGH FILE SIZE!! MUST COMPRESS!"+ manipResult.uri)
            
            const base64Comp = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
            const pictureInfo_comp = await FileSystem.getInfoAsync(manipResult.uri)
            const pictureSize_comp = pictureInfo_comp.size  / 1024 / 1024

            console.log("Compresssed picture size is "+pictureSize_comp)

            if (pictureSize_comp > 0.1){
                Alert.alert("Warning!","The picture you have selected is incompatible :{")
                await FileSystem.deleteAsync(FileSystem.cacheDirectory+"/ImagePicker")
                await FileSystem.deleteAsync(FileSystem.cacheDirectory+"/ImageManipulator") // this took
            } else {
                setSelectedPic('data:image/png;base64,'+base64Comp)
                await FileSystem.deleteAsync(FileSystem.cacheDirectory+"/ImagePicker")
                await FileSystem.deleteAsync(FileSystem.cacheDirectory+"/ImageManipulator") // way too long
                console.log("Successfully deleted ya know? "+manipResult) 
            }

        } else { 
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
            setSelectedPic('data:image/png;base64,'+base64)
            await FileSystem.deleteAsync(FileSystem.cacheDirectory+"/ImagePicker") // to know, but its now working :]
        }

        /*/
        if (fileExtension == "jpeg"|| fileExtension == "png"){
            if (pictureSize < 2){
                setSelectedPic('data:image/png;base64,'+base64)
            } else {
                Alert.alert("Picture size too big","Please select a picture that is not more than 2mb :(")
            }
            
        } else {
            Alert.alert("Invalid picture selected!","For now we only support jpeg and png pictures")
        }
        /*/
        
      
    } catch(err) {
      console.log(err)
    }
  };

  function checkNUpdate(quizFile, ColumnName, DataType, DefaultData){
    //
    var userMadeQuiz = SQLite.openDatabase(quizFile)

    var sqlStatement = `SELECT COUNT(*) AS EXIST FROM pragma_table_info('QuestionSet') WHERE name='`+ColumnName+`'`
    console.log(sqlStatement)
    
    /**/
    userMadeQuiz.transaction((txn) => {
        txn.executeSql(sqlStatement, [], (trans, results) => {
            var doesItExist = results.rows._array[0]["EXIST"]
            
            console.log("Does "+ColumnName+" Exists? : "+doesItExist)

            if (doesItExist){
                console.log("It DOes")
            } else {

                //  creates a new column!
                var sqlStatement2 = `ALTER TABLE QuestionSet ADD COLUMN `+ColumnName+` `+DataType+` NOT NULL DEFAULT `+DefaultData+`;`
                console.log(sqlStatement2)

                /**/
                userMadeQuiz.transaction((txn) => {
                    txn.executeSql(sqlStatement2, [], (trans, results2) => {

                        console.log(results2.rows._array)

                        console.log("Created a column named "+ColumnName+"!")
                    }, (error) => {
                        console.log("Error! AT Creating "+ColumnName+" column!")
                    })
                }) 
                /**/
                
            }
        }, (error) => {
            console.log("Error! AT Checking "+ColumnName+" COLUMN!")
        })
    })
    /**/
  }


// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE// STYLE
    
    const styles = StyleSheet.create({
        container: {
            marginTop: Constants.statusBarHeight,
            flex: 1,
            backgroundColor: '#FFF',

            //backgroundColor: '#2A2F4F',
        },

        quizHeader: {
            position: "absolute",
            top: "0%",
            backgroundColor: '#4C4C6D',
            width: "100%",
            padding: "5%",
        },

        groupBorder: {
            backgroundColor: '#6C9BCF',
            width: "100%",
            padding: "5%"
            
        },       
        
        groupText: {
            color: '#fff',
            fontSize: 20,

        },

        titleText: {
            color: '#fff',
            fontSize: 20,
        },

        groupBorderAdd: {
            position: "absolute",
            width: "50%",
            alignSelf: 'center',
            padding: "7%",
            alignItems: 'center',

            backgroundColor: "#4C4C6D",

            bottom: "5%",
            


            shadowOffset: { width: 0, height: 4 },
            shadowColor: '#000',
            shadowOpacity: 0.8,
            shadowRadius: 40, 
            elevation: 10,
        },   

        groupAddText: {
            color: "#FFF",
            fontWeight: "bold"
        },


        coverAll: {
            width: "100%",
        },

        question: {
            borderColor: '#000000',
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            padding: "5%",
            borderTopWidth: 0,
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
            position: "relative",
            backgroundColor: '#ffffff',
            width: "95%",
            padding: "3%",
        },

        modalTextInputQuestion: {
            borderColor: '#000000',
            borderWidth: 1,
            padding: "2%",
        },

        modalTextInput: {
            borderColor: '#000000',
            borderWidth: 1,
            padding: "3%",
        },

        modalFlexDisable: {
            display: "flex",
            flexDirection:"row",
            marginTop: "-5%",
            marginBottom: "2%"
        },

        modalFlex: {
            display: "flex",
            flexDirection:"row",
            justifyContent:"space-around",
            marginTop: "-5%",
            marginBottom: "auto"
        },

        modalFlexPic: {
            display: "flex",
            flexDirection:"row",
            height: "20%",
            width: "100%",
        },

        modalFlexPerBtn: {
            //backgroundColor: "#000"
        },


        dialogTextInput: {
            borderColor: '#000000',
            borderWidth: 1,
            padding: "3%",
        },

    });
    
    // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER 
    
    //loadQuizData("MyFirstQuiz_1.db", "E")

    // get the passed value first
    React.useEffect(() => {
        if (route.params?.quizFile) {
            console.log("The darn file was "+route.params?.quizFile)
            console.log("---------------------Initiated-------------------")
            setFileAddress(route.params?.quizFile)

            checkNUpdate(route.params?.quizFile, "Disabled", "INTEGER", 0)
            checkNUpdate(route.params?.quizFile, "RemixExclusion", "TEXT", '""')

            getGroups(route.params?.quizFile)
            setFileAddress(route.params?.quizFile)
            setQuizName(route.params?.quizName)

        }
    }, [route.params?.quizFile, route.params?.quizName]);

    //<Button title="Pop" onPress={() => {groupHeader.pop(); setGroupDisplay(groupHeader)}} />

    /*/
        <Picker
            selectedValue={selectedGroup}
            onValueChange={(itemValue, itemIndex) => {
                
                if (itemValue == "-- New --"){
                    setIsEditable(true)
                    setSelectedGroupTxt()
                } else {
                    setIsEditable(false)
                    setSelectedGroupTxt(itemValue)
                }
                setSelectedGroup(itemValue)
            }}
        >
            {groupChoice}
            <Picker.Item label="-- New --" value="-- New --" />
        </Picker>

        <Button title="Play"onPress={() => {
            navigation.navigate({
                name: 'Game',
                params: {quizFile: fileAddress},
            })
        }} />       

    /*/

    return (

    <View style={styles.container}>

        {/* This will show up if empty */}
        <Text style={{top: "50%", textAlign: "center", display: showEmptyMessage}}> Woaah such empty! (⁠ﾉﾟ⁠0ﾟ⁠)⁠ﾉ⁠~{'\n'} Press the [ Add Question ] to create a new question! </Text>

        <ScrollView ref={scrollRef}>
            <View style={{margin: "8%"}}></View>

            {groupDisplay}

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
                        <ScrollView>
                            <Text style={{fontSize: 18}}>Question (Max 255)</Text>
                            <TextInput 
                                style={styles.modalTextInputQuestion}
                                multiline={true}
                                numberOfLines={5}
                                value={questionTxt}
                                onChangeText={setQuestionText}
                                maxLength={255}
                            ></TextInput>
                            <Text>{'\n'}</Text>

                            <Text style={{fontSize: 18}}>Group</Text>
                            <TextInput 
                                style={styles.modalTextInput}
                                multiline={false}
                                value={selectedGroupTxt}
                                onChangeText={setSelectedGroupTxt}
                            ></TextInput>
                            <Text>{'\n'}</Text>
                            
                            
                            <Text style={{fontSize: 18}}>Answer</Text>
                            <TextInput 
                                style={styles.modalTextInput}
                                multiline={false}
                                value={answerTxt}
                                onChangeText={setAnswerText}
                            ></TextInput>
                            <Text>{'\n'}</Text>

                            <View style={styles.modalFlexDisable}>
                                <View style={{paddingTop: 8, paddingBottom: 8}}>
                                    <Text style={{fontSize: 18, backgroundColor:"#fff", marginTop: "-4%", marginBottom: "1%"}}>Disabled:{' '}
                                    </Text>
                                </View>

                                {/* This is to make the checkbox easier to press Hhahhahhaha */}
                                <Pressable
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: 8
                                    }}

                                    onPress={()=>{
                                        if (questionDisabled == false){
                                            setQuestionDisabled(true)
                                        } else {
                                            setQuestionDisabled(false)
                                        }
                                    }}
                                >
                                    <Checkbox
                                        value={questionDisabled}
                                        onValueChange={setQuestionDisabled}
                                        color={questionDisabled ? '#6C9BCF' : undefined}
                                    ></Checkbox> 
                                </Pressable>
                            </View>

                            
                            <View style={styles.modalFlexPic}>

                                <View style={{width: "40%"}}>
                                    <Text style={{fontSize: 18}}>Picture</Text>
                                    <Pressable style={{width: "100%", height: "100%"}}

                                        onLongPress={() => {
                                                if (selectedPic == "None"){
                                                    pickPicture()
                                                } else {
                                                    Alert.alert('Do you want to remove the picture?', `By pressing yes, you'll remove it`, [
                                                        {
                                                            text: 'No',
                                                            onPress: () => {},
                                                            style: 'Cancel',
                                                        },
                                                        {
                                                            text: 'Yes',
                                                            onPress: () => {
                                                                setSelectedPic("None")
                                                            },
                                                        },
                                                    ]);                                                       
                                                }
                                            }
                                        }

                                        onPress={() => {
                                            console.log(groupListSlct)
                                            pickPicture()
                                        }}                            
                                    >
                    
                                        <View style={{borderWidth: 1, borderColor: 'black', width: "100%", height: "100%"}}>
                                            <View style={{backgroundColor: "#6C9BCF", position: "absolute", width: "100%", height: "100%"}}>
                                                <View style={{flex:1, alignItems: "center", justifyContent: 'center', height: "10%"}}>
                                                    <Text style={{color: "#ffffff", fontWeight: "400"}}> Tap on me to pick! </Text>
                                                </View>
                                            </View>
                                    
                                            <Image style={{width: "100%", height: "100%", borderWidth: 1, borderColor: 'black'}} source={{uri: selectedPic}}/>
                                        </View>
                                    </Pressable>                            
                                </View>

                                <View style={{paddingLeft: "5%", fontSize: 10}}>

                                    <Text style={{fontSize: 18}}>Disabled Remix(WIP)</Text>

                                    <Text>{'>'}Remix 1</Text>
                                    <Text>{'>'}Remix 2</Text>
                                    <Text>{'>'}Remix 3</Text>
                                    <Text>{'>'}Remix 4</Text>
                                    <Text>{'>'}Remix 5</Text>

                                    {/*
                                    <Text>Remix Mode Exclusion (WIP)</Text>

                                    <Text> {'>'}Remix 1: Shuffled Letters</Text>
                                    <Text> {'>'}Remix 2: Identification mode</Text>
                                    <Text> {'>'}Remix 3: What answer relates</Text>
                                    <Text> {'>'}Remix 4: True or False</Text>
                                    <Text> {'>'}Remix 5: Enumeration</Text>
                                    */}
                                </View>
                                    
                                    {/** 
                                    <View style={{width: "50%", height: "50%"}}>
                                        <Button title="Select Image"
                                        onPress={() => {
                                            console.log(groupListSlct)
                                            Alert.alert("Coming Soon! Still Working on it","~Maku Santiran")
                                        }}
                                        />
                                    </View>
                                    */}                            
                            </View>

                            <Text>{'\n'}</Text>

                            <Text>{'\n'}</Text>

                            
                            <View style={styles.modalFlex}>
                                <Button title="Cancel"
                                style={styles.modalFlexPerBtn}
                                onPress={() => {
                                    setShowModal(!showModal);
                                }}
                                />     

                                <Button title="Delete"
                                style={styles.modalFlexPerBtn}
                                onPress={() => {
                                    if (onExistingQuestion){
                                    
                                        Alert.alert('Warning!', `You're about to delete a question! Do you still want to proceed?`, [
                                        {
                                            text: 'Nope!',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {text: 'Yes!', onPress: () => deleteQuestion(selectedQuestionId)},
                                        ]);                            
                                        //deleteQuestion(selectedQuestionId)
                                    }
                                    
                                }}
                                />
                        
                                <Button title="Save"
                                style={styles.modalFlexPerBtn}
                                onPress={() => {

                                    //modifyQuestion(selectedQuestionId)
                                    if (!onExistingQuestion){
                                        console.log("AAAAAAAAAADDDDDDDDDDDDD")
                                        addQuestion(selectedQuestionId, questionTxt, answerTxt, selectedGroupTxt, selectedPic, questionDisabled)
                                    } else {
                                        modifyQuestion(selectedQuestionId, questionTxt, answerTxt, selectedGroupTxt, selectedPic, questionDisabled)
                                    }
                                }}
                                />
                                
                            </View>
                            <Text style={{marginBottom: "5%"}}></Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
    
            <Dialog.Container visible={showGroupEdit}>
            <Dialog.Title>Change "{selectedGroupTxt}" Group Name? </Dialog.Title>
            <Text>Please type a new group name</Text>
            <TextInput 
                style={styles.dialogTextInput}
                value={newGroupName}
                onChangeText={setNewGroupName}            
            ></TextInput>
            <Dialog.Button label="Cancel"  onPress={() => {setShowGroupEdit(false)}}/>
            <Dialog.Button label="Change" onPress={() => {
                modifyGroupName(selectedGroupTxt, newGroupName)
                setShowGroupEdit(false) 
            }} />
            
            </Dialog.Container>

            <Text style={{marginBottom: "15%"}}></Text>
        </ScrollView>


        
        <View style={styles.quizHeader}>
            <Pressable
                onPress={(e) => {
                    console.log("A")
                }}
            >
                <Text style={styles.titleText} >{quizName} </Text>
            </Pressable>
        </View>

        <Pressable style={styles.groupBorderAdd} onPress={(e) => {
                setOnExistingQuestion(false)
                setShowModal(true)
                setIsEditable(true)
                setQuestionText()
                setAnswerText()
                setSelectedPic("None")
                //setSelectedGroupTxt()
            }}>
            <Text style={styles.groupAddText}> Add Question </Text>
        </Pressable>        
    </View>


    );
}

export default Quiz_Editor

//export { Quiz_Editor }


// SELECT COUNT(*) AS EXIST FROM pragma_table_info('QuestionSet') WHERE name='Disabled'
// ALTER TABLE QuestionSet ADD COLUMN Disabled INTEGER;

// SELECT COUNT(*) AS EXIST FROM pragma_table_info('QuestionSet') WHERE name='RemixExclusion'
// ALTER TABLE QuestionSet ADD COLUMN RemixExclusion TEXT;

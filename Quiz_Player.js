import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Modal, Image, TextInput} from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

import { createSaveFile } from './InitiateSave';

import Constants from 'expo-constants';

// self made "extension"
import { Choices } from './Quiz_PlayerFunctions';
import { ChoicesStyleVar, GameColors, ChoicesStyleUpdate, mainStyle, gameOverStyles, successScreenStyles } from './Quiz_PlayerCss'

const Stack = createNativeStackNavigator();

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

var firstRun = true

var count = 1
var bgPlaying = false
var quizDataTemp = ""
var SQLiteResTemp = ""
var atQuestionVar = 0
var atQuestionVarTemp = 0
var questionVar = ""
var questionGroupHeaderVar = ""
var questionImageVar = "None"

var identificationMistakes = 0

var potentialChoice1Var = NaN
var potentialChoice2Var = NaN
var potentialChoice3Var = NaN
var potentialChoice4Var = NaN

var correctlyAnswered = false

var localHealth = 100
var realHealth = 100
var localGOBOAlpha = 0 //GameOver BlackOut - GOBO
var gameOver = false

var BGMUSC_stopped = false
var stopAllBGSound = false

// colors
var C_EMPTYBARCOLOR = '#27374D'
var C_INCORRECTCOLOR = '#F6546A'
var C_CORRECTANSWERCOLOR = '#4d982c'
var C_HEALTHMID =  '#F9D949'

// game related Mode
var classicModeVar = true
var remixValue = 0
var remixValueRarity = 4 //the higher, the more rare

function restartVariables(){
   count = 1
   bgPlaying = false
   quizDataTemp = ""
   SQLiteResTemp = ""
   atQuestionVar = 0
   atQuestionVarTemp = 0
   localHealth = 100
   questionVar = ""
   questionGroupHeaderVar = ""
   questionImageVar = "None"
  
   potentialChoice1Var = NaN
   potentialChoice2Var = NaN
   potentialChoice3Var = NaN
   potentialChoice4Var = NaN
  
   correctlyAnswered = false  
   localHealth = 100
   gameOver = false

   BGMUSC_stopped = false
   stopAllBGSound = false

   remixValue = 0
   ChoicesStyleVar.displayIdentification = "none"
   ChoicesStyleVar.displayMultipleChoice = "flex"

   // STYLES reset
   ChoicesStyleVar.GOBOAlpha = 0
}


// lerping to make animation smooth :D
function lerp(a,b,t){
  return (1-t)*a + t*b 
} 

// creates the save file if there is no existing
//createSaveFile("UQG_SaveFile.db","SAVE") // <-- local main save file
//createSaveFile("Quiz1.db","./database/quizTemplate.db") // <-- local quiz save file

const Quiz_Player = ({ navigation, route }) => {

  if (firstRun){
    restartVariables()
    firstRun = false
    console.log(firstRun)
  }
  
  // quiz related variables
  const saveFile = SQLite.openDatabase("UQG_SaveFile.db")
  const [loadedQuiz, setLoadedQuiz] = useState("")

  // choices
  const [atQuestion, setAtQuestion] = useState(0);
  const [questionImage, setQuestionImage] = useState("None")

  // game Mode (or game related modes)
  const [classicMode, setClassicMode] = useState(true)

  // health
  const [healthVal, setHealthVal] = useState(localHealth)
  const [drainHealth, setDrainHealth] = useState(true)

  //MODAL
  const [showModal, setShowModal] = useState(false)
  const [showModal_Completed, setShowModal_Completed] = useState(false)

  const [CBack_SHOW,setCBack_SHOW] = useState("none");
  const [userIdenAns, setUserIdenAns] = useState("");

  // healthBar
  const [isInLowHealth, setIsInLowHealth] = useState(false)

  // wrongAnswers
  const [mistakes, setMistakes] = useState(0);

  // quizdata
  const [amountOfQuestion, setAmountofQuestion] = useState(0)

  // files
  const [SQLiteRes, setSQLiteRes] = useState();
  const [quizData, setQuizData] = useState();
  
  const [quizFile, setQuizFile] = useState("");

  const [question, setQuestion] = useState("No question yet");
  const [questionGroupHeader, setQuestionGroupHeader] = useState("No Question Yet")
  const [frames, setFrames] = useState(0);

  
  //BG sound effects
  const NOSTALGIA_SFX = require('./sfx/Nostalgia.mp3')

  const BGMUSIC_BG0 = require('./sfx/bgMusic0.mp3')
  const BGMUSIC_BG1 = require('./sfx/bgMusic1.mp3')
  const BGMUSIC_BG2 = require('./sfx/bgMusic2.mp3')
  const BGMUSIC_BG3 = require('./sfx/bgMusic3.mp3')
  const BGMUSIC_BG4 = require('./sfx/bgMusic4.mp3')
  const BGMUSIC_BG5 = require('./sfx/bgMusic5.mp3')

  const BGMUSIC_ARRAY = [BGMUSIC_BG0, BGMUSIC_BG1, BGMUSIC_BG2, BGMUSIC_BG3, BGMUSIC_BG4, BGMUSIC_BG5]

  //SFX
  const RESTART_SFX = require('./sfx/Restart.wav')
  const CORRECT_SFX = require('./sfx/Correct.wav')
  const WRONG_SFX = require('./sfx/Wrong.wav')

  //const [stopAllBGSound, setStopAllBGSound] = useState(false)

  // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS 
  // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS
  // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS
  // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS
  function playBGLoop(name, sound, setVolume = 1){
    console.log('Playing '+name);

    var TheAudio = Audio.Sound.createAsync(
      sound,
      { 
        playThroughEarpieceAndroid: false,
        shouldPlay: true,
        volume: setVolume
      }
    ).then((res)=>{
      res.sound.setOnPlaybackStatusUpdate((status)=>{
        if (stopAllBGSound && BGMUSC_stopped == false){
          BGMUSC_stopped = true
          console.log('Unloading '+name);
          res.sound.unloadAsync().catch(()=>{});
        }
        if(!status.didJustFinish) return;
        console.log('Replaying '+name);
        res.sound.replayAsync().catch(()=>{});
      });
    }).catch((error)=>{});

    console.log(">>>> "+sound)    
    return TheAudio
  }

  // https://github.com/expo/expo/issues/1873
  function playSound(name, sound, setVolume = 1){
    console.log('Playing '+name);

    var TheAudio = Audio.Sound.createAsync(
      sound,
      { 
        playThroughEarpieceAndroid: false,
        shouldPlay: true,
        volume: setVolume
      }
    ).then((res)=>{
      res.sound.setOnPlaybackStatusUpdate((status)=>{
        if(!status.didJustFinish) return;
        console.log(res.status.uri)
        console.log('Unloading '+name);
        res.sound.unloadAsync().catch(()=>{});
      });
    }).catch((error)=>{});

    console.log(">>>> "+sound)
  }

  const SQL_LITE = async(Name, SQL_Command)=>{
    var SQLiteFile = SQLite.openDatabase(Name)
  
    SQLiteFile.transaction((txn) => {
      txn.executeSql(SQL_Command, [], (trans, results) => {
        //console.log(results.rows._array)
        return results.rows._array
      },
        (error) => {
          console.log("ERROR! " + JSON.stringify(error))
          return false
      });
    });      
  }
  
  const createQuiz = () => {
    if (bgPlaying == false){
      bgPlaying = true
      playSound("BG", NOSTALGIA_SFX)
    }
  }

  const getQuizDetails = (Name) => {
    var quizFile = SQLite.openDatabase(Name)

    quizFile.transaction((txn) => {
      txn.executeSql('SELECT * FROM QuestionSet WHERE "Disabled" != 1 ORDER BY RANDOM()', [], (trans, results) => {

        if (results.rows._array.length > 0){

          var question = results.rows._array[0]["Question"]
          let picture = results.rows._array[0]["Picture"]
          let grouping = results.rows._array[0]["Group"]

          //console.log(question)
  
          quizDataTemp = results.rows._array
          setAmountofQuestion(quizDataTemp.length)
  
          //var i = 0
          //for (i=0; i<quizDataTemp.length; i++){
            //console.log(quizDataTemp[i]["Question"])
          //}
          atQuestionVar = 0
          atQuestionVarTemp = 0
          questionVar = question
          questionImageVar = picture
          questionGroupHeaderVar = grouping
          

          stopAllBGSound = false
          BGMUSC_stopped = true
  
          //setQuestion(question)
          //setAtQuestion(0)

          remixValue = Math.floor(Math.random() * remixValueRarity);
          console.log("Remix VALUE ISSS "+remixValue)
          ChoicesStyleVar.displayIdentification = "none"
          ChoicesStyleVar.displayMultipleChoice = "flex"
  
          if (remixValue == 1  && classicModeVar){
            ChoicesStyleVar.displayIdentification = "flex"
            ChoicesStyleVar.displayMultipleChoice = "none"
          }
        
          setQuestion()
          setQuestionGroupHeader()
          setQuestionImage(questionImageVar)
          setQuizData(results.rows._array)
          setQuizFile(Name)
          setFrames(0)
          setMistakes(0)
          
          
          //console.log("Image File is  "+questionImage+" and question is"+questionVar)
          
          //console.log("NOW THAT NUMBER IS "+atQuestion)
  
          playSound("Restart", RESTART_SFX, 0.3)
          identificationMistakes = 0

          if (classicModeVar == true){
            //console.log("I AM PLAYINGGGGGGGGGGGGGGGGG", classicMode)
            let randomMusicIndex =  Math.floor(Math.random() * 6);
            playBGLoop("BG", BGMUSIC_ARRAY[randomMusicIndex], 0.2)
          }

          remixValue = Math.floor(Math.random() * remixValueRarity);
          console.log("Remix VALUE ISSS "+remixValue)
          ChoicesStyleVar.displayIdentification = "none"
          ChoicesStyleVar.displayMultipleChoice = "flex"
  
          if (remixValue == 1  && classicModeVar){
            ChoicesStyleVar.displayIdentification = "flex"
            ChoicesStyleVar.displayMultipleChoice = "none"
          }          
          generateNewQuestion(Name, true);
          
        } else {
          console.log("AA")
          questionVar="Uhh there isn't any question with this particular quiz (⁠o__⁠ o⁠;⁠)⁠ゞ"
          questionGroupHeaderVar = "Quiz doesn't have any question!!"
          setDrainHealth(false)
          ChoicesStyleVar.C1B_SHOW = "none"
          ChoicesStyleVar.C2B_SHOW = "none"
          ChoicesStyleVar.C3B_SHOW = "none"
          ChoicesStyleVar.C4B_SHOW = "none"
          setCBack_SHOW("flex")
          setQuestion(questionVar)
          setQuestionImage("None")
          setQuestionGroupHeader()
        }

      },
          (error) => {
          console.log("execute error: " + JSON.stringify(error))
      });
    });
  }  

  const generateNewQuestion = async(Name, Init = false, Answer="No Answer", button="None") =>{
    var quizFile = SQLite.openDatabase(Name)
    var Group = quizDataTemp[atQuestionVar]["Group"]
    var CorrectAns = quizDataTemp[atQuestionVar]["Answer"]

    // this uhhh, adds new question
    quizFile.transaction((txn) => {
      txn.executeSql(`SELECT * FROM QuestionSet WHERE "Group" == "${Group}" AND "Disabled" != 1 ORDER BY RANDOM() LIMIT 3;`, [], (trans, results) => {
        var response = results.rows._array
        var origLength = response.length - 1
        
        //console.log(">>> Group "+Group)
        //console.log(">>> Details: " + JSON.stringify(results.rows._array))
        
        // this will help to fix the missing items (although its a cheap fix)
        if (response.length < 4){
          while (response.length < 4){
            response.push(response[0])
            //console.log(">>>>>>>>>"+response)
          }
        }

        // create new choices
        var choices = new Array(
          CorrectAns,
          response[0]["Answer"],
          response[1]["Answer"],
          response[2]["Answer"],
        );
          
        console.log("UserAnswered: "+ Answer+"| Correct answer: "+CorrectAns)
        
        //console.log(choices)
        choices = shuffle(choices)
        //console.log(choices)
          
        potentialChoice1Var = choices[0]
        potentialChoice2Var = choices[1]
        potentialChoice3Var = choices[2]
        potentialChoice4Var = choices[3]
        
        // this gets the index of correct answer
        var CorrectAnsInd = choices.indexOf(CorrectAns);

        console.log("THE CORRECT INDEX IS "+ CorrectAnsInd)

        if (Answer!=CorrectAns){
          Choices.choice1 = potentialChoice1Var
          Choices.choice2 = potentialChoice2Var
          Choices.choice3 = potentialChoice3Var
          Choices.choice4 = potentialChoice4Var
        }
        
        questionVar = quizDataTemp[atQuestionVar]["Question"]
        questionImageVar = quizDataTemp[atQuestionVar]["Picture"]
        questionGroupHeaderVar = quizDataTemp[atQuestionVar]["Group"]

        console.log("Array: "+atQuestionVar+": "+quizDataTemp[atQuestionVar]["Question"]+" "+quizDataTemp[atQuestionVar]["QuestionId"])
        
        remixValue = Math.floor(Math.random() * remixValueRarity);

        setQuestionGroupHeader()
        setQuestion()
        setQuestionImage(questionImageVar)
        setUserIdenAns("")
        
        ChoicesStyleVar.displayIdentification = "none"
        ChoicesStyleVar.displayMultipleChoice = "flex"

        if (remixValue == 1  && classicModeVar){
          ChoicesStyleVar.displayIdentification = "flex"
          ChoicesStyleVar.displayMultipleChoice = "none"
        }

      },(error) => {
          console.log("execute error: " + JSON.stringify(error))
      });
    });
    
  }


  const checkAnswer = async(Name, Init = false, Answer="No Answer", button="None") => {

    var CorrectAns = quizDataTemp[atQuestionVar]["Answer"]
    
    //console.log(atQuestionVar+" "+CorrectAns)

    // should make seperate function about thiss
    // IDENTIFICATION MODE
    if (remixValue == 1 && classicModeVar){
      var theUserIdenAns = userIdenAns.toLowerCase()

      // if incorrect
      if (theUserIdenAns.trim() != CorrectAns.toLowerCase() && Init == false){
        if (!correctlyAnswered){
          setMistakes(mistakes + 1)
          localHealth = localHealth -10
          playSound("WRONG", WRONG_SFX)
  
          identificationMistakes += 1;
          console.log(identificationMistakes)
  
  
          if (identificationMistakes > 2) {
            setUserIdenAns(CorrectAns)
          }
        }
      }

      if (theUserIdenAns.trim() == CorrectAns.toLowerCase() && !correctlyAnswered){
        identificationMistakes = 0
        setUserIdenAns("Correct!")

        localHealth = localHealth + 15
        playSound("CORRECT", CORRECT_SFX)
        correctlyAnswered = true
        ChoicesStyleVar.C4B_COLOR = C_CORRECTANSWERCOLOR;

        if (Init == false){          
          // delay
          if ((amountOfQuestion-1) > atQuestionVar){
            setTimeout(function() {
              setUserIdenAns("")
              ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;
              atQuestionVar = atQuestionVar + 1
              correctlyAnswered = false
              generateNewQuestion(Name, Init, Answer, button);
            }, 1000);
  
          } else{
            stopAllBGSound = true
            BGMUSC_stopped = false
            setTimeout(function() {
              setDrainHealth(false)
              setShowModal_Completed(true)
              console.log("Finished!")
            }, 1000);
          }
        }

        
      }
      return
    }

    // this prevents from picking another option after correctly answered
    if (correctlyAnswered == true){
      return
    }

    // if incorrect answer (this happens if its not initiated [could be reworked])
    if (Answer != CorrectAns && Init == false){

      // this prevents to press the button multiple times
      if (button!="None"){
        // could make this as different function
        if (button == "1B" && ChoicesStyleVar.C1B_COLOR == C_INCORRECTCOLOR){
          return
        }else if (button == "2B" && ChoicesStyleVar.C2B_COLOR == C_INCORRECTCOLOR){
          return
        }else if (button == "3B" && ChoicesStyleVar.C3B_COLOR == C_INCORRECTCOLOR){
          return
        }else if (button == "4B" && ChoicesStyleVar.C4B_COLOR == C_INCORRECTCOLOR){
          return
        }
      }   

      if (button!="None"){
        // could make this as different function
        if (button == "1B"){
          ChoicesStyleVar.C1B_COLOR = C_INCORRECTCOLOR;
        }else if (button == "2B"){
          ChoicesStyleVar.C2B_COLOR = C_INCORRECTCOLOR;
        }else if (button == "3B"){
          ChoicesStyleVar.C3B_COLOR = C_INCORRECTCOLOR;
        }else if (button == "4B"){
          ChoicesStyleVar.C4B_COLOR = C_INCORRECTCOLOR;
        }
        setMistakes(mistakes + 1)
        console.log("ADSSFGFDSGDFSAGFSDXFDFGFHGEGDFGTDHFG "+mistakes)
      }   

      localHealth = localHealth - 20
      playSound("WRONG", WRONG_SFX)
      console.log("Incorrect!")
      return
    }


    // if correct answer
    if (Answer == CorrectAns){
      console.log("YES")
      localHealth = localHealth + 15
      playSound("CORRECT", CORRECT_SFX)
      correctlyAnswered = true

      if (button!="None"){
        // could make this as different function
        if (button == "1B"){
          ChoicesStyleVar.C1B_COLOR = C_CORRECTANSWERCOLOR;
        }else if (button == "2B"){
          ChoicesStyleVar.C2B_COLOR = C_CORRECTANSWERCOLOR;
        }else if (button == "3B"){
          ChoicesStyleVar.C3B_COLOR = C_CORRECTANSWERCOLOR;
        }else if (button == "4B"){
          ChoicesStyleVar.C4B_COLOR = C_CORRECTANSWERCOLOR;
        }
      }

      if (Init == false){          
        // delay
        if ((amountOfQuestion-1) > atQuestionVar){
          setTimeout(function() {
            ChoicesStyleVar.C1B_COLOR = C_EMPTYBARCOLOR;
            ChoicesStyleVar.C2B_COLOR = C_EMPTYBARCOLOR;
            ChoicesStyleVar.C3B_COLOR = C_EMPTYBARCOLOR;
            ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;
            atQuestionVar = atQuestionVar + 1
            correctlyAnswered = false
            generateNewQuestion(Name, Init, Answer, button);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
          }, 1000);

        } else{
          stopAllBGSound = true
          BGMUSC_stopped = false
          setTimeout(function() {
            setDrainHealth(false)
            setShowModal_Completed(true)
            console.log("Finished!")
          }, 1000);
        }
      }
    }


    // if correct answer in Identification



    /*
    var Group = quizData[atQuestion]["Group"]
    var CorrectAns = quizData[atQuestion]["Answer"]

    setSQLiteRes("")
    SQL_LITE(Name, "SELECT * FROM QuestionSet WHERE"+ '"Group"'+ "LIKE '"+Group+"' ORDER BY RANDOM() LIMIT 3;")
    var quizFile = SQLiteRes
      //console.log(CorrectAns)
    }
    /**/
  }

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

  // <Button title="Initiate question"onPress={() => {getQuizDetails(loadedQuiz);}} />
  // <Button title="Play" onPress={() => {createQuiz();}} />

  // USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)
  // USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)
  // USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)
  // USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)// USE EFFECTS (RUN PER FRAMES)
  
  /**/ //this runs per frames
  // this runs per frames
  useEffect(() => {
    const updateFrames = () => { 
      
      // yes, just like games
      ChoicesStyleUpdate.update()

      if (drainHealth == true){
        
        realHealth = lerp(realHealth, localHealth, 0.6)

        // health things!
        if (localHealth > 100){
          localHealth = 100
        }
        if (localHealth > 50){
          setIsInLowHealth(false)
          ChoicesStyleVar.C_healthBar = GameColors.C_CORRECTANSWERCOLOR
        }
        if (localHealth < 50 && localHealth > 20){
          setIsInLowHealth(false)
          ChoicesStyleVar.C_healthBar = GameColors.C_HEALTHMID
        }
        if (localHealth < 20 ){
          setIsInLowHealth(true)
          ChoicesStyleVar.C_healthBar = GameColors.C_INCORRECTCOLOR
        }
        if (realHealth < 0){
          gameOver = true
        }

        if (isInLowHealth){
          if (ChoicesStyleVar.redOpacity < 2){
            ChoicesStyleVar.redOpacity += 0.08
          }
        } else{
          if (ChoicesStyleVar.redOpacity > -1){
            ChoicesStyleVar.redOpacity -= 0.05
          }
        }

        if (realHealth > 100){
          realHealth = 100
        }


        localHealth -= 0.03
        setHealthVal(realHealth)

        var Stringified = healthVal.toString() + "%"
        ChoicesStyleVar.health = Stringified

        //console.log("currennt Health "+ Stringified)
        // this runs per framee
      }

      if (gameOver == true){
        if (ChoicesStyleVar.GOBOAlpha < 1){
          ChoicesStyleVar.GOBOAlpha = ChoicesStyleVar.GOBOAlpha + 0.03
          ChoicesStyleVar.GOBODisplay = "flex"
        } 

        if (ChoicesStyleVar.GOBOAlpha > 0.5){
          stopAllBGSound = true
          BGMUSC_stopped = false
        }

        if (ChoicesStyleVar.GOBOAlpha > 1){
          setShowModal(true)
        }
      }

      setFrames(frames + 1)
      //console.log("Frames "+frames)
    }; 
    const interval = setInterval(updateFrames, 1);
    return () => clearInterval(interval);
  }, [frames]);

  /*These are for persistent variables*/
  useEffect(() => {
    setQuestionGroupHeader(questionGroupHeaderVar)
  }, [questionGroupHeader]);

  useEffect(() => {
    setQuestion(questionVar)
  }, [question]);

  useEffect(() => {
    setClassicMode(classicModeVar)
  }, [setClassicMode]);

  useEffect(()=>{
    if (questionImageVar != "None"){
      ChoicesStyleVar.displayImage = "flex"
    } else {
      ChoicesStyleVar.displayImage = "none"
    }
    setQuestionImage(questionImageVar)

    //console.log(questionImageVar)
  }, [questionImageVar])


  useEffect(() => {
    if (route.params?.quizFile) {
        console.log("The darn file was "+route.params?.quizFile)
        checkNUpdate(route.params?.quizFile, "Disabled", "INTEGER", 0)
        checkNUpdate(route.params?.quizFile, "RemixExclusion", "TEXT", '""')
        
        setLoadedQuiz(route.params?.quizFile)
        getQuizDetails(route.params?.quizFile)
        localHealth = 100
    }
  }, [route.params?.quizFile]);

  useEffect(() => {
    // this one responsible for initiating wat kind of mode
    if (route.params?.mode) {

      if (route.params?.mode == "ClassicMode"){
        ChoicesStyleVar.healthDisplay = "flex"
        classicModeVar = true
        setClassicMode(classicModeVar)

      } else {
        ChoicesStyleVar.healthDisplay = "none"
        setDrainHealth(false)
        classicModeVar = false
        setClassicMode(classicModeVar)
      }

      console.log(route.params?.mode)
    }
  }, [route.params?.mode]);


  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        //setStopAllBGSound(true)

        stopAllBGSound = true
        BGMUSC_stopped = false

        console.log(stopAllBGSound)
        // happnes?
        console.log("A USER LEFT")
        navigation.dispatch(e.data.action)
      }),
    [navigation]
  );

  // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER 
  // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER 
  // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER 
  // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER // RENDER
  
  return (
    <View style={mainStyle.container}>  

      <LinearGradient
        // Background Linear Gradient
        colors={['#E76161', 'transparent']}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0.7}}
        style={mainStyle.warningL}
      />

      {/* 
      <Text>At question: {atQuestionVar} </Text>
      <Button title="PlayMusic" onPress={() => {createQuiz();}} />
      <Text> {'\n'}</Text>
      */}

      <View style={{position: "absolute", top: Constants.statusBarHeight, width: "100%"}}>
        <View style={{backgroundColor: "#4C4C6D", padding: "2%"}}>
          <Text style={{color: "#FFFFFF", fontSize: 20,  textAlign: "center", fontWeight: "800"}}> {questionGroupHeader} </Text>
        </View> 
      </View>
      
      <Text style={{fontSize: 18, paddingLeft: "10%", paddingRight: "10%"}}> {question} </Text>

      <View style={mainStyle.imageStyle}>
        <Image style={{width: "100%", height: "100%", borderWidth: 1, borderColor: 'black'}} source={{uri: questionImage}}/>
      </View>
      

      <Text> {'\n'}</Text>

      {/* Multiple Choice Mode */}
      <View style={mainStyle.multipleChoice}>
        <Pressable style={mainStyle.choice1} title={Choices.choice1} onPress={() => {checkAnswer(quizFile, false, Choices.choice1, "1B");}}>
          <View style={mainStyle.health1}></View>
          <Text style={mainStyle.textInChoice}>{Choices.choice1}</Text>
        </Pressable>
        <Pressable style={mainStyle.choice2} title={Choices.choice1} onPress={() => {checkAnswer(quizFile, false, Choices.choice2, "2B");}}>
          <View style={mainStyle.health2}></View>
          <Text style={mainStyle.textInChoice}>{Choices.choice2}</Text>
        </Pressable>
        <Pressable style={mainStyle.choice3} title={Choices.choice1} onPress={() => {checkAnswer(quizFile, false, Choices.choice3, "3B");}}>
          <View style={mainStyle.health3}></View>
          <Text style={mainStyle.textInChoice}>{Choices.choice3}</Text>
        </Pressable>
        <Pressable style={mainStyle.choice4} title={Choices.choice1} onPress={() => {checkAnswer(quizFile, false, Choices.choice4, "4B");}}>
          <View style={mainStyle.health4}></View>
          <Text style={mainStyle.textInChoice}>{Choices.choice4}</Text>
        </Pressable>
      </View>

      {/* Identification Mode */}
      <View style={mainStyle.identification}>
        <TextInput  
            style={mainStyle.identificationTextInput}
            value={userIdenAns}
            onChangeText={setUserIdenAns}      
            placeholder="Type the correct answer"
        ></TextInput>

        <Pressable style={mainStyle.choice4} title={"Submit"} onPress={() => {checkAnswer(quizFile, false, Choices.choice4, "5B");}}>
          <View style={mainStyle.health4}></View>
          <Text style={mainStyle.textInChoice}>{"Submit"}</Text>
        </Pressable>          
      </View>

      {/* Completed Screen */}
      <View>
        <Modal
            visible={showModal_Completed}
            transparent={true}            
        > 

        <View style={successScreenStyles.bgShadow}></View>

        <View style={successScreenStyles.modalContainer}>
          <View style={successScreenStyles.modalContent}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>RESULTS:  </Text>
            <Text>You have answered {amountOfQuestion} questions </Text>
            <Text>You had {mistakes} Mistakes </Text>

            <Text></Text>
            <Text>( ꈍᴗꈍ) Nicely done! Now you take the real quiz? or not??</Text>

            <Text></Text>
            <View style={successScreenStyles.modalFlex}>
              <Button title='Retry?'
              onPress={() => {

                if (classicMode){
                  ChoicesStyleVar.healthDisplay = "flex"
                  setDrainHealth(true)
                } else {
                  setDrainHealth(false)
                }
                
                restartVariables()
                setShowModal_Completed(false)    
                
                ChoicesStyleVar.C1B_COLOR = C_EMPTYBARCOLOR;
                ChoicesStyleVar.C2B_COLOR = C_EMPTYBARCOLOR;
                ChoicesStyleVar.C3B_COLOR = C_EMPTYBARCOLOR;
                ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;

                getQuizDetails(loadedQuiz)

                atQuestionVar = 0
              }}></Button>


            <Button title='Finish'
            onPress={() => {
              setDrainHealth(true)
              restartVariables()
              setShowModal_Completed(false)    
              
              ChoicesStyleVar.C1B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C2B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C3B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;

              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
            }}></Button>


            </View>
            


          </View>
        </View>

        </Modal>
      </View>

      {/* Game Over Screen */}
      <View style={gameOverStyles.blackOut}>
        <Modal
            visible={showModal}            
        > 
          <View style={gameOverStyles.container}>
            <Text style={{color: "#FFFFFF", fontSize: 50}}> QUIZ OVER! </Text>
            <Text style={{color: "#FFFFFF", marginBottom: "10%"}}> You only answered {atQuestionVar} question/s</Text>

            <Button title='Retry?'
            onPress={() => {

              if (classicMode){
                setDrainHealth(true)
                ChoicesStyleVar.healthDisplay = "flex"
              } else {
                setDrainHealth(false)
              }

              gameOver = false
              localHealth = 100
              ChoicesStyleVar.GOBOAlpha = 0
              ChoicesStyleVar.GOBODisplay = "none"
              setShowModal(false)    
              
              ChoicesStyleVar.C1B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C2B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C3B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;

              getQuizDetails(loadedQuiz)
            }}></Button>

            <Text>{'\n'}</Text>
            <Button title='Quit'
            onPress={() => {
              gameOver = false
              localHealth = 100
              ChoicesStyleVar.GOBOAlpha = 0
              ChoicesStyleVar.GOBODisplay = "none"
              setShowModal(false)    
              
              ChoicesStyleVar.C1B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C2B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C3B_COLOR = C_EMPTYBARCOLOR;
              ChoicesStyleVar.C4B_COLOR = C_EMPTYBARCOLOR;

              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
            }}></Button>

          </View>
        </Modal>
      </View>
          
      <View style={{display: CBack_SHOW}}>
        <Button title='Go back'
        onPress={() =>{
          const popAction = StackActions.pop(1);
          navigation.dispatch(popAction);
        }}
        ></Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

//export default App

export default Quiz_Player

// change IP Address: set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.59
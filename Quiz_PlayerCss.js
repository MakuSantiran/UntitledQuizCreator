import { StyleSheet} from 'react-native';
import Constants from 'expo-constants';

// Variables Neeeded

var GameColors = {
  C_EMPTYBARCOLOR: '#27374D',
  C_INCORRECTCOLOR: '#F6546A',
  C_CORRECTANSWERCOLOR: '#4d982c',
  C_HEALTHMID: '#F9D949'  
}

var ChoicesStyleVar = {
  C1B_COLOR: GameColors.C_EMPTYBARCOLOR,
  C2B_COLOR: GameColors.C_EMPTYBARCOLOR,
  C3B_COLOR: GameColors.C_EMPTYBARCOLOR,
  C4B_COLOR: GameColors.C_EMPTYBARCOLOR,

  C1B_SHOW: "flex",
  C2B_SHOW: "flex",
  C3B_SHOW: "flex",
  C4B_SHOW: "flex",
  healthDisplay: "flex",

  health: "100%",
  C_healthBar: GameColors.C_CORRECTANSWERCOLOR,
  
  redOpacity: 0,

  displayImage: "none",
  displayMultipleChoice: "flex",
  displayIdentification: "none",

  GOBOAlpha: 0,
  GOBODisplay: "none",
}


var mainStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    textInChoice: {
      color: 'white',
      textAlign: 'center',
      padding: 10,
    },
  
    choice1: {
      margin: 10,
      width: '75%',
      backgroundColor: ChoicesStyleVar.C1B_COLOR,
      textAlign: 'center',
      display: ChoicesStyleVar.C1B_SHOW
    },
  
    choice2: {
      margin: 10,
      width: '75%',
      backgroundColor: ChoicesStyleVar.C2B_COLOR,
      textAlign: 'center',
      display: ChoicesStyleVar.C2B_SHOW
    },
  
    choice3: {
      margin: 10,
      width: '75%',
      backgroundColor: ChoicesStyleVar.C3B_COLOR,
      textAlign: 'center',
      display: ChoicesStyleVar.C3B_SHOW
    },
  
    choice4: {
      margin: 10,
      width: '75%',
      backgroundColor: ChoicesStyleVar.C4B_COLOR,
      textAlign: 'center',
      display: ChoicesStyleVar.C4B_SHOW
    },
  
    health1: {
      position: "absolute", 
      backgroundColor: ChoicesStyleVar.C_healthBar, 
      width: ChoicesStyleVar.health, 
      height: "100%",
      opacity: 0.6,
      display: ChoicesStyleVar.healthDisplay
    },
  
    health2: {
      position: "absolute", 
      backgroundColor: ChoicesStyleVar.C_healthBar, 
      width: ChoicesStyleVar.health, 
      height: "100%",
      opacity: 0.6,
      display: ChoicesStyleVar.healthDisplay
    },

    health3: {
      position: "absolute", 
      backgroundColor: ChoicesStyleVar.C_healthBar, 
      width: ChoicesStyleVar.health, 
      height: "100%",
      opacity: 0.6,
      display: ChoicesStyleVar.healthDisplay
    },

    health4: {
      position: "absolute", 
      backgroundColor: ChoicesStyleVar.C_healthBar, 
      width: ChoicesStyleVar.health, 
      height: "100%",
      opacity: 0.6,
      display: ChoicesStyleVar.healthDisplay
    },

    warningL: {
      position: "absolute",
      height: "100%",
      width: "100%",
      opacity: ChoicesStyleVar.redOpacity,

  },

  imageStyle: {
    display: ChoicesStyleVar.displayImage,
    width: "70%", 
    height: "35%", 
    borderWidth: 1, 
    borderColor: 'black',
    marginTop: "5%",
  },

  identificationTextInput: {
    borderColor: '#000000',
    borderWidth: 1,
    width: "80%",
    padding: "2%",
    textAlign: "center"
  },

  identification: {
    display: "none",
    flex: 1,
    backgroundColor: "#AAAAAA",
    padding: 10,
  },

  multipleChoice: {
    display: ChoicesStyleVar.displayMultipleChoice
  },

  jumbledMode:{
    display: "none"
  },

  swappedMode:{
    display: "none"
  },

  enumerateTheDefinition:{
    display: "none"
  }

});

var gameOverStyles = StyleSheet.create({
    blackOut: {
      top: Constants.statusBarHeight,
      position: "absolute",
      backgroundColor: 'rgba(0,0,0,'+ChoicesStyleVar.GOBOAlpha+')',
      width: "100%",
      height: "100%",
      display: ChoicesStyleVar.GOBODisplay,
    },

    container: {
      position: "relative",
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',   
    }
});

var successScreenStyles = StyleSheet.create({

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
      
      bgShadow: {
        backgroundColor: "#000000",
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.5
    },

    modalFlex: {
      display: "flex",
      flexDirection:"row",
      justifyContent:"space-around"
    },
});

var ChoicesStyleUpdate = {
  update: function(){
    mainStyle = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      
        textInChoice: {
          color: 'white',
          textAlign: 'center',
          padding: 10,
        },
      
        choice1: {
          margin: 10,
          width: '75%',
          backgroundColor: ChoicesStyleVar.C1B_COLOR,
          textAlign: 'center',
          display: ChoicesStyleVar.C1B_SHOW
        },
      
        choice2: {
          margin: 10,
          width: '75%',
          backgroundColor: ChoicesStyleVar.C2B_COLOR,
          textAlign: 'center',
          display: ChoicesStyleVar.C2B_SHOW
        },
      
        choice3: {
          margin: 10,
          width: '75%',
          backgroundColor: ChoicesStyleVar.C3B_COLOR,
          textAlign: 'center',
          display: ChoicesStyleVar.C3B_SHOW
        },
      
        choice4: {
          margin: 10,
          width: '75%',
          backgroundColor: ChoicesStyleVar.C4B_COLOR,
          textAlign: 'center',
          display: ChoicesStyleVar.C4B_SHOW
        },
      
        health1: {
          position: "absolute", 
          backgroundColor: ChoicesStyleVar.C_healthBar, 
          width: ChoicesStyleVar.health, 
          height: "100%",
          opacity: 0.6,
          display: ChoicesStyleVar.healthDisplay
        },
      
        health2: {
          position: "absolute", 
          backgroundColor: ChoicesStyleVar.C_healthBar, 
          width: ChoicesStyleVar.health, 
          height: "100%",
          opacity: 0.6,
          display: ChoicesStyleVar.healthDisplay
        },

        health3: {
          position: "absolute", 
          backgroundColor: ChoicesStyleVar.C_healthBar, 
          width: ChoicesStyleVar.health, 
          height: "100%",
          opacity: 0.6,
          display: ChoicesStyleVar.healthDisplay
        },

        health4: {
          position: "absolute", 
          backgroundColor: ChoicesStyleVar.C_healthBar, 
          width: ChoicesStyleVar.health, 
          height: "100%",
          opacity: 0.6,
          display: ChoicesStyleVar.healthDisplay
        },

        warningL: {
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: ChoicesStyleVar.redOpacity,

      },

      imageStyle: {
        display: ChoicesStyleVar.displayImage,
        width: "70%", 
        height: "35%", 
        borderWidth: 1, 
        borderColor: 'black',
        marginTop: "5%",
      },

      identificationTextInput: {
        borderColor: '#000000',
        borderWidth: 1,
        width: "80%",
        padding: "2%",
        textAlign: "center"
      },

      identification: {
        display: ChoicesStyleVar.displayIdentification,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
      },

      multipleChoice: {
        display: ChoicesStyleVar.displayMultipleChoice,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
      },

      jumbledMode:{
        display: "none"
      },

      swappedMode:{
        display: "none"
      },

      enumerateTheDefinition:{
        display: "none"
      }

    });
    
    gameOverStyles = StyleSheet.create({
        blackOut: {
          top: Constants.statusBarHeight,
          position: "absolute",
          backgroundColor: 'rgba(0,0,0,'+ChoicesStyleVar.GOBOAlpha+')',
          width: "100%",
          height: "100%",
          display: ChoicesStyleVar.GOBODisplay,
        },
    
        container: {
          position: "relative",
          flex: 1,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',   
        }
    });
    
    successScreenStyles = StyleSheet.create({
    
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
          
          bgShadow: {
            backgroundColor: "#000000",
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.5
        },
    
        modalFlex: {
          display: "flex",
          flexDirection:"row",
          justifyContent:"space-around"
        },
    });
  }
}


export {
  ChoicesStyleVar,
  GameColors,
  ChoicesStyleUpdate,

  mainStyle, 
  gameOverStyles, 
  successScreenStyles
}
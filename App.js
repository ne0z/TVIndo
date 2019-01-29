//import liraries
import React, { Component } from 'react';
import Streaming from './src/views/Streaming';
import Home from './src/views/Home';
import SplashScreen from './src/views/SplashScreen';
import { createStackNavigator, createAppContainer } from "react-navigation";

const RootStack = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen
    },
    Home: {
      screen: Home
    },
    Streaming: {
      screen: Streaming
    }
  },
  {
    initialRouteName: "SplashScreen",
    headerMode: "none"
  }
);


const App = createAppContainer(RootStack);

//make this component available to the app
export default App;

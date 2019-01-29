//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage } from 'react-native';
import {StackActions,NavigationActions} from "react-navigation";
import axios from 'axios';
// create a component
class SplashScreen extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        axios.get("http://initrd.me/channel.json").then((response) => {
            AsyncStorage.setItem("channel", JSON.stringify(response.data.items))
        }).catch(
            (error) => {
                alert(error)
            }
        )
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
            ],
            key: null
        });

        this.props.navigation.dispatch(resetAction);
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../images/logo.png')} style={{ width: 280, height: 150 }} />
                <Text style={{ color: "white", marginTop: 20, fontSize: 18 }}>CRR Security</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

//make this component available to the app
export default SplashScreen;

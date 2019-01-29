//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, ScrollView, TVEventHandler, AsyncStorage } from 'react-native';
import Channel from '../config/Channel.js';

// create a component
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: null,
            channel: null
        }
    }

    _enableTVEventHandler = () => {
        this._tvEventHandler = new TVEventHandler();
        this._tvEventHandler.enable(this, (cmp, evt) => {
            if (evt && evt.eventType === 'left') {
            } else if (evt && evt.eventType === 'up') {
                if (this.state.index === null) {
                    this.setState({ index: 0 })
                } else {
                    if (this.state.index > 0) {
                        this.setState({ index: this.state.index - 1 })
                    }
                }
            } else if (evt && evt.eventType === 'right') {
            } else if (evt && evt.eventType === 'down') {
                if (this.state.index === null) {
                    this.setState({ index: 0 })
                } else {
                    if (this.state.index < this.state.channel.length - 1) {
                        this.setState({ index: this.state.index + 1 })
                    }
                }
            } else if (evt && evt.eventType === 'select') {
                if (this.state.index === null) {
                    this.setState({ index: 0 })
                } else {
                    this.props.navigation.navigate("Streaming", { index: this.state.index })
                }
            }
        });
    }

    _disableTVEventHandler = () => {
        if (this._tvEventHandler) {
            this._tvEventHandler.disable();
            delete this._tvEventHandler;
        }
    }

    _retrieveData = async () => {
        try {
            result = await AsyncStorage.getItem('channel');
            if (result !== null) {
                result = JSON.parse(result)
                Channel.items.map((item, index) => {
                    result[index]["thumb"] = item.thumb
                });
                result.map((item, index) => {
                    if (item.thumb === undefined) {
                        result[index]["thumb"] = require("../images/unknown.png")
                    }
                })
                this.setState({ channel: result })
            }
        } catch (error) {
            return null
        }
    }

    componentDidMount() {
        this._retrieveData()
        this._enableTVEventHandler();
    }

    componentWillUnmount() {
        this._disableTVEventHandler();
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {
                        this.state.channel !== null &&
                        this.state.channel.map((item, index) => {
                            if (this.state.index === index) {
                                var bg = "yellow"
                            } else {
                                var bg = "transparent"
                            }
                            return (
                                <TouchableHighlight onPress={() => this.props.navigation.navigate("Streaming", { index: index })} key={index} style={{ backgroundColor: 'white', padding: 5, borderBottomWidth: 1, }}>
                                    <View style={{ flexDirection: "row", width: "100%", backgroundColor: bg }}>
                                        <Image source={item.thumb} style={{ flex: 1, resizeMode: 'contain', width: 56, height: 56 }} />
                                        <Text style={{ flex: 3, justifyContent: 'center', alignItems: 'center', fontSize: 48, color: 'black' }}>{item.name}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default Home;

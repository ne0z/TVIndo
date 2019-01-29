//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TVEventHandler, AsyncStorage } from 'react-native';
import Video from 'react-native-video';
import Channel from '../config/Channel';
import KeepAwake from 'react-native-keep-awake';

// create a component
class Streaming extends Component {
    _tvEventHandler: any;
    constructor(props) {
        super(props)
        this.state = {
            channels: null,
            channel: null,
            channelId: 0,
            message: null
        }
    }
    _enableTVEventHandler = () => {
        this._tvEventHandler = new TVEventHandler();
        this._tvEventHandler.enable(this, (cmp, evt) => {
            if (evt && evt.eventType === 'left') {
                if (this.state.channelId > 0) {
                    this.setState({ channelId: this.state.channelId - 1, channel: this.state.channels[this.state.channelId - 1] })
                } else {
                    this.setState({ channelId: this.state.channels.length - 1, channel: this.state.channels[this.state.channels.length - 1] })
                }
            } else if (evt && evt.eventType === 'up') {
            } else if (evt && evt.eventType === 'right') {
                if (this.state.channelId < this.state.channels.length - 1) {
                    this.setState({ channelId: this.state.channelId + 1, channel: this.state.channels[this.state.channelId + 1] })
                } else {
                    this.setState({ channelId: 0, channel: this.state.channels[0] })
                }
            } else if (evt && evt.eventType === 'down') {
            } else if (evt && evt.eventType === 'playPause') {
            }
        });
    }

    _disableTVEventHandler = () => {
        if (this._tvEventHandler) {
            this._tvEventHandler.disable();
            delete this._tvEventHandler;
        }
    }



    onBuffer = () => {
        this.setState({
            message: "Sedang memuat video..."
        })
    };

    onProgress = () => {
        this.setState({
            message: null
        })
    };

    componentWillMount() {
        const { navigation } = this.props;
        const channelId = navigation.getParam('index', 0);

        AsyncStorage.getItem("channel", (error, result) => {
            result = JSON.parse(result)
            Channel.items.map((item, index) => {
                result[index]["thumb"] = item.thumb
            });
            result.map((item, index) => {
                if (item.thumb === undefined) {
                    result[index]["thumb"] = require("../images/unknown.png")
                }
            })
            this.setState({ channels: result })
            this.setState({ channel: result[channelId], channelId: channelId })
        })
    }

    componentDidMount() {
        this._enableTVEventHandler();
    }

    componentWillUnmount() {
        this._disableTVEventHandler();
    }
    render() {
        return (
            <View style={styles.container}>
                <KeepAwake/>
                {
                    this.state.channel !== null &&
                    <Video source={{
                        isNetwork: true,
                        type: '',
                        uri: this.state.channel.url
                    }}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}
                        onBuffer={this.onBuffer.bind(this)}
                        onProgress={this.onProgress.bind(this)}
                        style={{ width: '100%', height: '100%' }} />
                }
                
                {
                    this.state.message !== null &&
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor:'black' }}>
                        <Text style={{ fontSize: 50, color: 'white' }}>{this.state.message}</Text>
                        <Text style={{ fontSize: 40, color: 'yellow' }}>( CHANNEL {this.state.channelId+1} )</Text>
                    </View>
                }
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
        backgroundColor: 'black',
    },
});

//make this component available to the app
export default Streaming;

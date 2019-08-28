
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TouchableHighlight,
    TextInput,
    Button,
    WebView,
    ScrollView
} from 'react-native';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import *as counterAction from '../../action/counterAction';

class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.phoneNumber = ""

        this.state = {
            homeNumber: 0
        };
    }

    setMsg(e){
        this.setState({
            homeNumber: e
        })
    }

    render() {
        return (<TabBarComponent
            {...this.props}
            style={{ borderTopColor: 'red' }}
        />)
    }
}

export default connect(
    (state) => ({
        count: state.counter.count,
    }),
    (dispatch) => ({
        incrementFn: () => dispatch(counterAction.increment()),
        decrementFn: () => dispatch(counterAction.decrement()),
    })
)(TabBarComponent)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabbar: {
        backgroundColor: '#ffffff',
        shadowColor: '#ff544f',
    },
    label: {
        color: '#ffffff',
        fontWeight: '400',
        textAlign: "left",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    camera: {
        flex: 1
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    preview: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    toolBar: {
        width: 200,
        margin: 40,
        backgroundColor: '#000000',
        justifyContent: 'space-between', 
    },
    button: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
      fontWeight: '500',
      color: '#000',
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
      padding: 16,
    }
});
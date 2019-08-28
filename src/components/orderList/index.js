
/**
 * @imports
 */
import { PermissionsAndroid, NativeModules } from 'react-native';
import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions, Button, 
    TouchableHighlight,Linking,
    DeviceEventEmitter } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewNavigation, {
    NavigationModes, TravelModeBox, TravelIcons,
    TravelModes, DirectionsListView, ManeuverView, DurationDistanceView
}
    from 'react-native-maps-navigation';
import OptionGroup from 'react-native-optiongroup';
import Styles, { AppColors, AppFonts } from '../../../styles/AppStyles';
// import MapStyles from '../../../styles/MapStyles';
// import Geocoder from 'react-native-geocoder';
import MapViewDirections from 'react-native-maps-directions';
import { StackNavigator, TabBarBottom, TabNavigator, createStackNavigator, createAppContainer } from "react-navigation";


import { NativeRouter, Route, Link } from "react-router-native";
import Svg from "../../../icons/icons";

import AppStyles from "../uncollected";

import { OrderQuery, DailySum,Update } from "../../api";

// import MyTabBar from '../unitl/MyTabBar';
const { width, height } = Dimensions.get('window');

/**
 * @app
 */
export default class orderList extends Component {

    /**
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.props = props;

        this.timer = null;
        this.count = 1;
        this.lnlg = "";
        this.state = {
            origin: { latitude: 0, longitude: 0 },
            destination: { latitude: 35.785094, longitude: 139.663175 },
            navigationMode: NavigationModes.IDLE,
            travelMode: TravelModes.DRIVING,
            isFlipped: false,
            isNavigation: false,
            route: false,
            step: false,
            titleNumber: [0, 0],
            deliveredNumber: [0, 0],
            driverTitleNumber: [0, 0],
            OrderDataList:null
        }


        this.mounted = false;
    }

    static navigationOptions = {    
        header: null
    };

    getData(status) {
        // alert(JSON.stringify(status));
        OrderQuery({
            status: status,
            // type: "current",
            shopModel: { shopId: global.storeInfo.shopId },
            driverModel: {
                name: global.dm.name,
                driverId: global.dm.driverId,
                allowDistance:"20"
            }
        }).then((data) => {
            this.setState({
                OrderDataList: data
            })
        });
    }

    setUp(index) {
        let orgData = this.state.OrderDataList.data
        let data = JSON.parse(JSON.stringify(this.state.OrderDataList.data));
        let rightData = orgData[index];
        let leftData = orgData[index-1];
        data[index-1] = rightData;
        data[index] = leftData;
        let OrderDataList = {
            data: data
        }
        this.setState({
            OrderDataList:OrderDataList
        })
    }

    setDown(index) {
        let orgData = this.state.OrderDataList.data
        let data = JSON.parse(JSON.stringify(this.state.OrderDataList.data));
        let rightData = orgData[index];
        let leftData = orgData[index+1];
        data[index+1] = rightData;
        data[index] = leftData;
        let OrderDataList = {
            data: data
        }
        this.setState({
            OrderDataList:OrderDataList
        })
    }

    renderData(data,index){
        

        let actionW = width*.2;
        let dataSize = this.state.OrderDataList.data.length-1;
        return <View
                style={{
                    width: width - 8,
                    // position:"relative",
                    backgroundColor:"#ffffff",
                    justifyContent:"center",
                    paddingLeft:4,
                    paddingRigjt:4,
                    marginBottom:10
                }}
            >
                <View style={[AppStyles.middleButtonRight, {
                        flexDirection: 'row',
                        height:80
                    },
                    AppStyles.middleButton, {
                        width: width,
                        paddingLeft: 25
                    }
                ]}>
                    <View style={{width:width*.2}}>
                        <Text style={styles.activeFont}>{data.orderId} </Text>
                    </View>
                    <View style={[{
                        backgroundColor: "#a0a0a0", padding: 5,
                        width: 80
                    }, AppStyles.middleButton, styles.center]}>
                        <TouchableHighlight
                            onPress={() => { Linking.openURL(`tel:` + data.shopModel.phone) }}
                            style={{ backgroundColor: "#a0a0a0" }}
                        >
                            <Text style={[{
                                borderRadius: 40,
                                borderColor: "#a0a0a0",
                                borderWidth: 1,
                                width: 40,
                                height: 40,
                                fontSize: 45,
                                padding: 0,
                                backgroundColor: "#ffffff",
                                color: '#a0a0a0',
                                fontFamily: 'iconfont'
                            }]}>&#xe60a;</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[
                        { width: 150}, AppStyles.middleButton,
                        {
                            height: 80,
                            backgroundColor: data.driverPaidStatus ? "#f0695a":"#62a55d",
                            paddingLeft: 15,
                            paddingTop: 5,
                            // marginLeft: 35,
                            // position:"absolute",
                            right:0,
                            marginLeft:5
                        }]}>
                        {
                            data.driverPaidStatus ? (<View style={{
                                flexDirection: 'row', justifyContent: "space-between",
                                height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                            }}>
                                <View>
                                    <View>
                                        <Text style={[styles.activeFont, { color: "#ffffff" }]}>Due to Store</Text>
                                        <Text style={[styles.activeFont, { color: "#ffffff" }]}>€{data.driverPaid}</Text>
                                    </View>
                                </View>
                            </View>) : (<View ststyle={{
                                flexDirection: 'row', justifyContent: "space-between",
                                height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                            }}>
                                <View>
                                    <View>
                                        <Text style={[styles.activeFont, { color: "#ffffff" }]}>Due to You</Text>
                                        <Text style={[styles.activeFont, { color: "#ffffff" }]}>€{data.storePaid.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>)
                        }
                    </View>
                </View>
                <View style={{ justifyContent: "center", flexDirection: 'row', marginTop: 15,
                        justifyContent: "flex-start" }}>
                    <View style={{
                        // flexDirection: 'row',
                        // justifyContent: "flex-start"
                    }}>
                        <Text style={[{
                            fontFamily: 'iconfont',
                            fontSize: 12,
                            paddingLeft:5
                        }]}>
                            { data.shopModel.phone }
                            {/* &#xe604; */}
                        </Text>
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ 
                                width: width * .5,
                                fontSize: 12,
                                paddingRight: 2
                            }}>
                                {data.address}
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 5,
                        
                    }}>
                        {index>0?(
                            <TouchableHighlight
                                onPress={() => { this.setUp(index) }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "iconfont",
                                        paddingTop: 4,
                                        fontSize:35,
                                        color: "#ffffff",
                                        backgroundColor: "#f0695a",
                                        width: actionW,
                                        textAlign:"center",
                                        minHeight: 45
                                    }}
                                >
                                    &#xe7f1;
                                </Text>
                            </TouchableHighlight>)
                        :null}
                        <Text 
                            style={{width:5}}
                        >
                            {/* { index +"   "+  } */}
                        </Text>
                        {index != dataSize?(
                            <TouchableHighlight
                                onPress={() => { this.setDown(index) }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "iconfont",
                                        fontSize:35,
                                        paddingTop: 4,
                                        color: "#ffffff",
                                        backgroundColor: "#f0695a",
                                        width: actionW,
                                        textAlign:"center",
                                        minHeight: 45
                                    }}
                                >
                                &#xe7f2;
                                </Text>
                            </TouchableHighlight>)
                        :null}
                    </View>
                </View>
            </View>
    }

    componentWillMount() {
    }

    componentDidMount() {
        const updateStatus = this.props.location.state;
        // alert(JSON.stringify(updateStatus))
        getStatus = "";

        if(updateStatus.updateStatus=="delivered") getStatus = "collected";
        if(updateStatus.updateStatus=="collected") getStatus = "accepted";
        // alert(JSON.stringify(params));
        this.getData(getStatus);
    }
    /**
     * @render
     * @returns {*}
     */
    render() {
        this.lnlg += "\nload\n";

        // const params = this.props.location.state;
        // const {data,pathname} = params;

        // const { params } = this.props.navigation.state;

        // let updateStatus = "";
        // if(data.status=="collected") updateStatus = "delivered";
        // if(data.status=="accepted") updateStatus = "collected";
        // let pathname = params.pathname;
               
        let contentHeight = height-60;
        // let mainHeight = height-500;
        return (
            <View style={[Styles.appContainer,{height,height}]}>
                {/* <View>
                    <Text>
                        {contentHeight}
                    </Text>
                </View> */}
                <View
                    style={{
                        width: width,
                        height: 40,
                        flexDirection: 'row' 
                    }}
                >
                 <TouchableHighlight 
                    onPress={() => {
                        this.props.history.goBack(); 
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingTop:5
                        }}
                    >
                        <Text  onPress={()=>{
                                this.props.history.goBack(); 
                            }} 
                            style={{
                                marginLeft:5,
                                width:50,
                                textAlign:"center",
                                fontFamily: 'iconfont',
                                fontSize: 20, 
                                paddingTop:5, 
                            }} 
                        >
                            &#xe614;
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight:"bold"
                            }}
                        >
                            Order List
                        </Text>
                    </View>
                 </TouchableHighlight>
                    
                </View>

                <View style={{backgroundColor:"#c6c7c8"}}>

                    <ScrollView style={{backgroundColor:"#c6c7c8",
                        height: contentHeight,
                        width:width-8,
                        paddingLeft:8,
                        // paddingRight:4
                    }}>
                        {this.state.OrderDataList? 
                        this.state.OrderDataList.data.map((data,index) => (
                            this.renderData(data,index)
                        )):null}
                    </ScrollView>
                    
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    defWidth: {
        width: width / 2 - 8
    },
    defHeight: {
        width: (width / 2 - 8) * 0.42
    },
    iconStyle: {
        color: '#ffffff',
        fontFamily: 'iconfont',
        fontSize: 20
    },
    iconStyleSM: {
        color: '#ffffff',
        fontFamily: 'iconfont',
        fontSize: 16
    },
    activeFont: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000"
    },

    lineFont: {
        fontSize: 16,
        color: "#000000",
        paddingLeft: 5
    },
    center: {

        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    }
})
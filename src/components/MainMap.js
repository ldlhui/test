
/**
 * @imports
 */
import { 
    Image,NativeModules } from 'react-native';
import React, { Component } from 'react';
import {
    ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions, Button,
    TouchableHighlight, Linking,
    DeviceEventEmitter
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewNavigation, {
    NavigationModes, TravelModeBox, TravelIcons,
    TravelModes, DirectionsListView, ManeuverView, DurationDistanceView
}
    from 'react-native-maps-navigation';
import OptionGroup from 'react-native-optiongroup';
import Styles, { AppColors, AppFonts } from '../../styles/AppStyles';
import MapStyles from '../../styles/MapStyles';
// import Geocoder from 'react-native-geocoder';
import MapViewDirections from 'react-native-maps-directions';
import { StackNavigator, TabBarBottom, TabNavigator, createStackNavigator, createAppContainer } from "react-navigation";


import { NativeRouter, Route, Link } from "react-router-native";
import Svg from "../../icons/icons";

import AppStyles from "./uncollected";

import { OrderQuery, DailySum, Update } from "../api";

import MyTabBar from '../unitl/MyTabBar';

import LineBtn from "../components/lineBtn";

// import sd from "./"

var nativeImageSource = require('./hs.png');

var Geolocation = require('Geolocation');

const { width, height } = Dimensions.get('window');
// var Geolocation = require('Geolocation');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 0, maximumAge: 0 };
/**
 * Settings
 * @type {string}
 */

/**
 * You need to fill in a Google API Key that enables the Direction API.
 */
const GOOGLE_API_KEY = 'AIzaSyDb2jB0BGD_4ds0O-HSOk6afQUrwMcbDeA';

/**
 * Set to true to use the controls methods instead of props
 * @type {boolean}
 */
const USE_METHODS = false;

const defaultProps = {
    enableHack: false,
    geolocationOptions: GEOLOCATION_OPTIONS,
};

/**
 * @app
 */
export default class MapApp extends Component {

    // static navigationOptions = {
    //     title: null, header: null,
    //     tabBarLabel: '主页',
    //     tabBarIcon: ({ focused, tintColor }) => (
    //         <Image
    //             style={{ width: 26, height: 26, tintColor: tintColor }}
    //         />
    //     )
    // };

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
            Accuracy:1
        }


        this.mounted = false;

        // PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        //     {
        //         'title': 'Cool Photo App Camera Permission',
        //         'message': 'Cool Photo App needs access to your camera ' +
        //             'so you can take awesome pictures.'
        //     }
        // )
    }
    

    static navigationOptions = {
        header: null
    };

    getData(data) {
        global.storage.load({
            key: 'location'
        }).then(locations => {
            // alert(JSON.stringify(location.accuracy));
            OrderQuery({
                status: data.status,
                type: "others",
                shopModel: { shopId: global.storeInfo.shopId},
                driverModel: {
                    latitude: locations.latitude,
                    longitude: locations.longitude,
                    name: global.dm.name,
                    driverId: global.dm.driverId,
                    allowDistance: "20"
                }
            }).then((data) => {
                // OrderQuery({
                //     status: 'new', type: 'current',
                //     shopModel: { shopId: '2321321jb' },
                //     driverModel: {
                //         latitude: locations.latitude,
                //         longitude: locations.longitude,
                //         name: 'Jim',
                //         driverId: 'd001'
                //     }
                // }).then((otherData) => {
                //     DeviceEventEmitter.emit('msg', {
                //         homePageNumber:  [otherData.data.length,data.data.length]
                //     });
                // })

                this.setState({
                    newOtherOrderData: data,
                    orderSize: data.data.length,
                    accuracy: accuracy
                })
                global.storage.save({
                    key: 'showOrders',
                    data: true,
                    expires: null
                });
            });
        }
            , error => {

            });
        this.setState({
            showOrders: true
        })
    }
    /**
     * goDisplayRoute
     * @void
     */
    goDisplayRoute() {
        if (!this.validateRoute()) return;

        // There are two ways to display a route - either through the method
        // displayRoute or by setting the props.
        // The difference is that you get instant feedback when using methods vs props.

        if (USE_METHODS) {
            this.refNavigation.displayRoute(
                this.state.origin,
                this.state.destination,
                {
                    mode: this.state.travelMode
                }
            ).then(route => {
                console.log(route);
            });

        } else {

            this.setState({
                navigationMode: NavigationModes.ROUTE,
            });
        }
    }
    /**
     * goNavigateRoute
     * @void
     */
    goNavigateRoute() {
        if (!this.validateRoute()) return;

        // There are two ways to navigate a route - either through the method
        // navigateRoute or by setting the props.
        // The difference is that you get instant feedback when using methods vs props.

        if (USE_METHODS) {
            this.refNavigation.navigateRoute(
                this.state.origin,
                this.state.destination,
                {
                    mode: this.state.travelMode
                }
            ).then(route => {
                this.setState({
                    isNavigation: true
                })
            });

        } else {
            this.setState({
                navigationMode: NavigationModes.NAVIGATION,
            });
        }
    }

    /**
     * validateRoute
     * @returns {boolean}
     */
    validateRoute() {
        if (this.state.destination.length >= 3) return true;

        Alert.alert('Address required', 'You need to enter an address first');

        return false;
    }

    getLocation() {
        // Geolocation.watchPosition(
        //       location => {
        //           var result = "速度：" + location.coords.speed +
        //                       "\n经度：" + location.coords.longitude +
        //                       "\n纬度：" + location.coords.latitude +
        //                       "\n准确度：" + location.coords.accuracy +
        //                       "\n行进方向：" + location.coords.heading +
        //                       "\n海拔：" + location.coords.altitude +
        //                       "\n海拔准确度：" + location.coords.altitudeAccuracy +
        //                       "\n时间戳：" + location.timestamp;
        //           alert(result);
        //       },
        //       error => {
        //         alert("获取位置失败："+ error)
        //       },

        //     );
            
        // navigator.geolocation.watchPosition((position) => {
        //     var lastPosition = JSON.stringify(position);
        //     alert(JSON.stringify(position));
        //     // this.setState({lastPosition});
        // });
        // let data = NativeModules.ToastExample;


        // NativeModules.ToastExample.show("asd", 0, (data) => {

        //     data = JSON.parse(data);
        //     // alert(JSON.stringify(data));
        //     this.setState({
        //         origin: {
        //             latitude: data.latitude,
        //             longitude: data.longitude,
        //             Accuracy: data.Accuracy,
        //         }
        //     })
        navigator.geolocation.getCurrentPosition(
            val => {
                // alert(val.coords.heading);
                // alert(JSON.stringify(val.coords));
                this.setState({
                    origin: {
                        latitude: val.coords.latitude,
                        longitude: val.coords.longitude,
                        Accuracy: val.coords.Accuracy,
                    }
                })
            }
        );
        navigator.geolocation.watchPosition(
            val => {
                // alert(val.coords.heading);
                // alert(JSON.stringify(val.coords));
                this.setState({
                    origin: {
                        latitude: val.coords.latitude,
                        longitude: val.coords.longitude,
                        Accuracy: val.coords.Accuracy,
                    }
                })
            }
        );

        //     this.count++;
        // });
    }

    componentWillMount() {

        // this.timer && clearTimeout(this.timer);
    }

    showDailog(item, _this, updateStatus) {
        // _this.setState({
        //     // isVisible: true,
        //     item: item
        // })

        let info = "";
        //  !item.orderPaidStatus ? "Did you pay sotre.  "+item.driverPaid:"";

        if (!item.orderPaidStatus) info = "Did you pay store €" + item.driverPaid;
        if (!item.orderPaidStatus) info = "Did the store pay you €" + item.storePaid;
        Alert.alert('', 'Did you collect all delivery items? \n ' + info,
            [
                {
                    text: "Yes", onPress: () => {
                        this.updateData(item, _this, updateStatus);
                    }
                },
                // {text:"No", onPress:this.updateData(item, _this,"No")},
                {
                    text: "No", onPress: () => {

                    }
                },
            ]
        );
        // setTimeout(function () { _this.setState({ isVisible: false }) }, 10000);this.confirm

    }


    updateData(item, _this, updateStatus) {
        Update({
            orderId: item.orderId,
            updateStatus: updateStatus,
            status: item.status,
            type: 'current',
            driverModel: {
                driverId: global.dm.driverId
            }
        }).then((data) => {
            // this.props.navigation.push
            this.props.navigation.goBack()
        });
    }


    componentDidMount() {
        let me = this;
        me.getLocation();


        
        // global.storage.load({
        //     key: 'chinaT'
        // }).then(data => {
        //     this.setState({
        //         titleNumber: data
        //     })
        // })
        // global.storage.load({
        //     key: 'driverData'
        // }).then(data => {
        //     this.setState({
        //         driverTitleNumber: data
        //     })
        // })

    }

    // _toast(){
    //     NativeModules.ToastModule.show('toast', 
    //     NativeModules.ToastModule.SHORT,(success)=>{alert(success)},(error)=>{alert(error)})
    // }
    gps2d(lat_a,lng_a,lat_b,lng_b) {

        let d = 0;
 
        lat_a = lat_a*Math.PI/180;
 
        lng_a = lng_a*Math.PI/180;
 
        lat_b = lat_b*Math.PI/180;
 
        lng_b = lng_b*Math.PI/180;
 
       
 
        d = Math.sin(lat_a)*Math.sin(lat_b)+Math.cos(lat_a)*Math.cos(lat_b)*Math.cos(lng_b-lng_a);
 
        d = Math.sqrt(1-d*d);
 
        d = Math.cos(lat_b)*Math.sin(lng_b-lng_a)/d;
 
        d = Math.asin(d)*180/Math.PI;
 
       
 
 //     d = Math.round(d*10000);
 
        return d;
 
    }

    async animateCamera() {
        const camera = await this.map.getCamera();
        camera.heading += 40;
        camera.pitch += 10;
        camera.altitude += 1000;
        camera.zoom -= 1;
        camera.center.latitude += 0.5;
        this.map.animateCamera(camera, { duration: 2000 });
    }    

    /**
     * @render
     * @returns {*}
     */
    render() {

        let _this = this;

        this.lnlg += "\nload\n";
        this.timer && clearTimeout(this.timer);
        // this.timer = setTimeout(this.getLocation.bind(this),5000);

        let params = this.props.location.state;
        const { data, pathname } = params;

        // const { params } = this.props.navigation.state;

        let updateStatus = "";
        if (data.status == "collected") updateStatus = "delivered";
        if (data.status == "accepted") updateStatus = "collected";  

        let lat_a = this.state.origin.latitude;
        let lng_a = this.state.origin.longitude;
        let lat_b = params.destination.latitude;
        let lng_b = params.destination.longitude;

        let fx = this.gps2d(lat_a,lng_a,lat_b,lng_b);
        let fxd = 0;

        if(fx==0) fxd = 0;
        if(fx>0&&fx<=22.5) fxd = 0;
        if(fx>22.5&&fx<=45) fxd = 45;
        if(fx>45&&fx<=112.5) fxd = 90;
        if(fx>112.5&&fx<=157.5) fxd = 135;
        if(fx>157.5&&fx<=202.5) fxd = 180;


        if(fx<0&&fx>=-22.5) fxd = 0;
        if(fx<-22.5&&fx>=-67.5) fxd = -45;
        if(fx<-67.5&&fx>=-112.5) fxd = -90;
        if(fx<-112.5&&fx>=-157.5) fxd = -135;
        if(fx<-157.5&&fx>=-202.5) fxd = -180;

        return (
            <View style={[Styles.appContainer, { height, height }]}>
                {/* <Text>
                    {this.state.Accuracy}
                    {"\n123"}
                    {this.state.origin.longitude}{"\n"}
                </Text> */}
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
                                    paddingTop: 5
                                }}
                            >
                                <Text onPress={() => {
                                    this.props.history.goBack();
                                }}
                                    style={{
                                        marginLeft: 5,
                                        width: 50,
                                        textAlign: "center",
                                        fontFamily: 'iconfont',
                                        fontSize: 20,
                                        paddingTop: 5,
                                    }}
                                >
                                    &#xe614;
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                Direction
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {/* <Text>
                    {JSON.stringify(params)}
                </Text> */}
                {/* <View
                    style={{
                        width: width,
                        height: width,
                    }}
                > */}
                    <View style={{
                        width: width,
                        height: width,
                        maxHeight:height-220
                        // transform: [{rotate:'45deg'}]
                    }}>
                        {
                            this.state.origin.latitude != 0 ? (<MapView
                                style={{
                                    width: width,
                                    height: width,
                                    flex: 1,
                                    backgroundColor: "#000000"
                                }}

                                // showUserLocation={true}
                                pitchEnabled={true}
                                
                                Camera={{
                                    center: {
                                        latitude: this.state.origin.latitude,
                                        longitude: this.state.origin.longitude,
                                    },
                                    pitch: 38,
                                    heading: fxd,
                                    altitude: 1000,
                                    zoom: 14,
                                }}

                                initialCamera={{
                                    center: {
                                        latitude: this.state.origin.latitude,
                                        longitude: this.state.origin.longitude,
                                    },
                                    pitch: 38,
                                    heading: fxd,
                                    altitude: 1000,
                                    zoom: 14,
                                }}
                                showsMyLocationButton={true}
                                showsUserLocation={true}
                                loadingEnabled={true}
                                followsUserLocation={true}
                            >
                                {/* <MapView.Marker coordinate={this.state.origin} /> */}

                                <MapView.Marker
                                    // image={nativeImageSource}
                                    coordinate={params.destination}
                                >

                                <Image style={{
                                    width:35,
                                    height:35
                                }} source={nativeImageSource} />

                                </MapView.Marker>

                                {
                                    this.state.destination.latitude != 0 && this.state.origin.latitude ? (<MapViewDirections
                                        origin={this.state.origin}
                                        region={this.state.origin}
                                        destination={params.destination}
                                        apikey={GOOGLE_API_KEY}

                                        showUserLocation={true}
                                        strokeWidth={6}
                                        strokeColor="#00a8f7"
                                    />) : null
                                }
                            </MapView>) : null
                        }
                    </View>
                {/* </View> */}

                {this.state.origin.latitude != 0 ? (
                    <View
                        style={{
                            width: width - 7,
                            position: "relative"
                        }}
                    >
                        <View style={[AppStyles.middleButtonRight, {
                            flexDirection: 'row',
                            justifyContent: "flex-start",
                            // justifyContent: "space-between"
                            height: 80
                        },
                        AppStyles.middleButton, {
                                width: width,
                                paddingLeft: 25
                            }
                        ]}
                        >
                            <View
                                style={{
                                    width:100
                                }}
                            >
                                <Text numberOfLines={2}  style={[styles.activeFont,{width:100}]}>{data.orderId} </Text>
                                {/* <Text style={[styles.activeFont, { fontSize: 15 }]}>In {
                            ((new Date(item.pickUpStart)).getTime() - (new Date(item.pickUpEnd)).getTime()) / 60000
                        } Mins</Text> */}
                            </View>
                            <View style={[{
                                backgroundColor: "#a0a0a0", padding: 5,
                                width: 80
                            }, AppStyles.middleButton, styles.center]}>
                                <TouchableHighlight
                                    onPress={() => { Linking.openURL(`tel:` + data.shopModel.phone) }}
                                    style={{ 
                                        borderRadius: 45,backgroundColor: "#a0a0a0" }}
                                >
                                    <Text style={[{
                                        borderRadius: 35,
                                        borderColor: "#a0a0a0",
                                        borderWidth: 1,
                                        width: 45,
                                        overflow: 'hidden',
                                        height: 45,
                                        fontSize: 45,
                                        padding: 0,
                                        backgroundColor: "#ffffff",
                                        color: '#a0a0a0',
                                        fontFamily: 'iconfont'
                                    }]}>&#xe60a;</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[
                                { width: 150 }, AppStyles.middleButton,
                                {
                                    height: 80,
                                    backgroundColor: data.driverPaidStatus ? "#f0695a" : "#62a55d",
                                    paddingLeft: 15,
                                    paddingTop: 5,
                                    // marginLeft: 35,
                                    position: "absolute",
                                    right: 0
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
                        <View style={{ justifyContent: "center", flexDirection: 'row', marginTop: 15 }}>
                            <Text style={[styles.iconStyle, { color: "#ff544f" }]}>&#xe604;</Text>
                            <View style={{ paddingLeft: 5 }}>
                                <Text style={{ width: width * .85 }}>
                                    {/* 138 SPRINGDALE ROAD DUBLIN 5 D05 K8Y6 */}
                                    {data.address}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',width:width }}>

                            <View style={{
                                flexDirection: 'row',
                                width: width * .5,
                                justifyContent: "center"
                            }}>
                                <LineBtn item={data} width={width * .5} setCE={()=>{
                                    
                                }} title={updateStatus} showDailog={(data) => {
                                    this.showDailog(data, _this, updateStatus);
                                }}>
                                </LineBtn>
                            </View>
                            <View style={{ paddingLeft: 20 }}>
                                <TouchableHighlight
                                    onPress={() => {
                                        // alert("123");
                                        var path = {
                                            pathname: '/orderList',
                                            state: {
                                                updateStatus: updateStatus
                                            }
                                        }
                                        this.props.history.push(path);
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: "#f5f5f5",
                                        height: 50,
                                        padding: 15, paddingLeft: 10, paddingRight: 10
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "bold",
                                                color: "#000000"
                                            }}>Order List</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>) : null}
                {/* <View style={{
                    position:"absolute",
                    bottom:10
                }}>
                    <MyTabBar
                        tabs={
                            ["Home", "driver", "map", "delivered", "user"]
                        }
                        {...this.props}
                        titleNumber={this.state.titleNumber}
                        deliveredNumber={this.state.deliveredNumber}
                        driverTitleNumber={this.state.driverTitleNumber}

                        activeTab={"driver"}
                        goToPage={(data) => {
                            this.setState({
                                activeTab: data
                            })
                            if(data != "driver") this.props.history.push('/' + data);
                        }}
                    >
                    </MyTabBar>
                </View> */}
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
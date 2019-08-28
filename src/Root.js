import React from "react";
import {
    View, Text,
    TouchableHighlight,
    DeviceEventEmitter,
    Dimensions, NativeModules,Platform
} from "react-native";
import Permissions from 'react-native-permissions'
import {
    createStackNavigator, createAppContainer
} from "react-navigation";

import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})
global.storage = storage;

import MainMap from "./components/MainMap";
import StaticMap from "./components/staticMap";

import { Provider } from 'react-redux';
import configureStore from './store';
import AppStyle from "../styles/AppStyles";

import homePage from "./containers/homePage";
import driver from "./containers/driver";
import Delivered from "./containers/delivered";
import CurrentHistory from "./containers/storeHistory";
import login from "./containers/login";

import User from "./containers/user";
import { connect } from 'react-redux';
import *as counterAction from '../src/action/counterAction';


import MyTabBar from './unitl/MyTabBar';
var ScrollableTabView = require('react-native-scrollable-tab-view');


import {
    NativeRouter,
    Route,
    Link,
    Redirect,
    withRouter
  } from "react-router-native";
  
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

import OrderList from "./components/orderList";

const { width, height } = Dimensions.get('window');
class MapScreen extends React.Component {
    static navigationOptions = {
        title: null,
    };
    render() {
        return (<MainMap />);
    }
}

class MapEasyScreen extends React.Component {
    static navigationOptions = {
        title: null,
    };

    render() {
        return (<StaticMap></StaticMap>);
    }
}


class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "test",
            deliveredNumber: null,
            titleNumber: null,
            driverTitleNumber: null,
            title: null,
            notifTitle: "",
            notifBody: ""
        }
    }


    componentWillMount() {

    }

    componentDidMount(){

    }

    render() {
        
        return (
            <View>
                <MyTabBar
                    tabs={
                        ["Home", "driver", "map", "delivered", "user"]
                    }

                    titleNumber={this.state.titleNumber}
                    deliveredNumber={this.state.deliveredNumber}
                    driverTitleNumber={this.state.driverTitleNumber}

                    activeTab={this.state.activeTab}
                    goToPage={(data) => {
                        this.setState({
                            activeTab: data
                        })
                        this.props.history.push('/'+data);
                        // this.props.navigation.push(data);
                        // return <Redirect
                        //     to={{
                        //         pathname: "/"+data,
                        //         // state: { from: props.location }
                        //     }}
                        // />
                    }}
                >
                </MyTabBar>
            </View>
        )
    }
}


const houseApp = createStackNavigator({
    Uncollected: { screen: driver },
    CollectedChat: { screen: StaticMap }
});
const SimpleApp = createStackNavigator({
    ChinaTown: { screen: homePage },
    Chat: { screen: StaticMap },
    driver: {
        screen: houseApp
    },
    map: {
        screen: MainMap
    },
    delivered: {
        screen: Delivered
    },
    collecting: {
        screen: Delivered
    }
});



SimpleApp.navigationOptions = {
    header: null,
};

houseApp.navigationOptions = {
    header: null,
};

MapScreen.navigationOptions = {
    header: null,
};

Delivered.navigationOptions = {
    header: null,
};

// const AppNavigator = createBottomTabNavigator(
//     {
//         Home: {
//             // screen: SimpleApp,
//             screen: homePage
//         }
//     },
//     {
//         initialRouteName: "Home",
//         tabBarComponent: props =>
//             <TabBarComponent
//                 {...props}
//                 style={{ borderTopColor: '#605F60' }}
//             />,
//     }
// );



// const mapApp = createStackNavigator({
//     ChinaTown: { screen: homePage },
//     Chat: { screen: StaticMap },
//     driver: {
//         screen: houseApp
//     },
//     map: {
//         screen: MainMap
//     },
//     delivered: {
//         screen: Delivered
//     },
//     collecting: {
//         screen: Delivered
//     }
// });

// mapApp.navigationOptions = {
//     header: null,
// };

const main = createStackNavigator({
    login: { screen: login },
    pages: { screen: SimpleApp }
});

const App = createAppContainer(main);
const store = configureStore();

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notifTitle: null,
            notifBody: null
        }
    }

    setData() {
        this.setState({
            notifTitle: null,
            notifBody: null
        })
    }

    // 方法定义 lat,lng 
    GetDistance( lat1,  lng1,  lat2,  lng2){
        var radLat1 = lat1*Math.PI / 180.0;
        var radLat2 = lat2*Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    }

    onClickMsg(data) {
        DeviceEventEmitter.emit('trigger', {
            data: data
        });
    }

    async componentDidMount() {
        // Permissions.checkMultiple(['camera', 'photo']).then(response => {
        //     //response is an object mapping type to permission
            
        // })
        navigator.geolocation.getCurrentPosition(
            location => {
        })
        if(Platform.OS === "android") {
            //Android平台需要运行的代码
            NativeModules.ToastExample.show("asd", 0, (data) => {
                data = JSON.parse(data);
                global.storage.save({
                    key: 'location',
                    data: data,
                    expires: null
                });
            });
            setInterval(()=>{
                NativeModules.ToastExample.show("asd", 0, (data) => {
                    data = JSON.parse(data);
                    global.storage.save({
                        key: 'location',
                        data: data,
                        expires: null
                    });
                });
            },1000);
        }else{
        //iOS平台需要运行的代码
            navigator.geolocation.watchPosition(
                location => {
                // alert(JSON.stringify(location.coords.latitude));
                // data = JSON.parse(data);
                global.storage.save({
                    key: 'location',
                    data: {
                        latitude:location.coords.latitude,
                        longitude:location.coords.longitude
                    },
                    expires: null
                });
            })
        }
        
 
        firebase.auth()
            .signInAnonymouslyAndRetrieveData()
            .then(credential => {
                if (credential) {
                    console.log('default app user ->', credential.user.toJSON());
                }
            });

        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // alert(enabled);
        } else {
            // alert("false");
        }

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel',
            firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');
        firebase.notifications().android.createChannel(channel);

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
        }

        try {
            await firebase.messaging().requestPermission();
        } catch (error) {
            // alert(error);
        }
        try {
            !this.notificationOpenedListener ? this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action;
                // Get information about the notification that was opened
                const notification = notificationOpen.notification;
                // this.onClickMsg("true")
                // alert(notification);
                alert("a1")
            }) : "";

            !this.notificationDisplayedListener ? this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                // notification.android.setChannelId(notification.data.channelId || "UNKNOW");
                // notification.setTitle(notification.title || "AppName");
                // firebase.notifications().displayNotification(notification);
                this.onClickMsg("true")
                // notification.android.setChannelId(notification.data.channelId || "UNKNOW");
                // notification.setTitle(notification.title || "AppName");
                // firebase.notifications().displayNotification(notification);
            }) : "";

            !this.messagingListener ? this.messagingListener = firebase.messaging().subscribeToTopic("order").then((data) => {
                // alert(JSON.stringify(data));
            }) : "";

            !this.notificationListener ? this.notificationListener = firebase.notifications().onNotification((notification) => {
                // Process your notification as required

                
                // alert("JSON.stringify(info)");
                let info = notification.data;
                if(type == "others") {
                    try {
                        let _this = this
                        // alert(JSON.stringify(info));
                        global.storage.load({
                            key: 'location'
                        }).then(locations => {
                            let km = _this.GetDistance( locations.latitude,  locations.longitude,  info.latitude,  info.longitude)
                            // alert(isNaN(km))
                            if(isNaN(km)){
                                _this.setState(
                                    {
                                        notifTitle: notification.title,
                                        notifBody: notification.body
                                    }
                                )
                
                                _this.timer = setTimeout(_this.setData.bind(_this), 30000);
                                throw new Error('local is null')
                            }
                            if(km<20) {
                                _this.setState(
                                    {
                                        notifTitle: notification.title,
                                        notifBody: notification.body
                                    }
                                )
                
                                _this.timer = setTimeout(_this.setData.bind(_this), 30000);
                            }
                        })
                    } catch (error) {
                        
                        // if(info.type!="current"&&)
    
                        this.setState(
                            {
                                notifTitle: notification.title,
                                notifBody: notification.body
                            }
                        )
    
                        this.timer = setTimeout(this.setData.bind(this), 30000);
                    }
                } else {
                    this.setState(
                        {
                            notifTitle: notification.title,
                            notifBody: notification.body
                        }
                    )

                    this.timer = setTimeout(this.setData.bind(this), 30000);
                }
            }) : "";
        } catch (error) {

        }
    }

    getTip() {
        return <TouchableHighlight
            onPress={() => {
                this.onClickMsg()
            }}
        >
            <View style={{
                height: 50,
                backgroundColor:'rgba(0, 0, 0, 0.7)',
                flexDirection: 'row',
                width: width,
                justifyContent: "center",
                paddingLeft:15,
                paddingRight:15
            }}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold"
                }}>
                    {this.state.notifTitle}
                    {":\n"}
                    {this.state.notifBody}
                </Text>
                <Text style={{
                    color: "#ffffff",
                    fontFamily: 'iconfont',
                    paddingTop:5,
                    height:48
                }}>
                    &#xe62d;
                </Text>
            </View>
        </TouchableHighlight>
    }

    render() {

        return (<Provider store={store}>
            {this.state.notifTitle ? (
                    <View  style={{width:width,height:30,
                        backgroundColor:"#ffffff",
                        position:"absolute",
                        zIndex: 9999}}
                    >
                        {this.getTip()}
                    </View>
                ) : null}
            {/* <App /> */}
            <NativeRouter>
                <View style={{width:width, height:height,
                backgroundColor:"#ffffff",
                paddingTop:Platform.OS === 'ios' ? 25: ""
                }}>
                    {/* <Route exact path="/Login" component={login} /> */}
                    <View style={{width:width,
                        height:height,
                        backgroundColor:"#ffffff"
                    }}>
                        <Route exact path="/" component={login} />

                        {/* <Route exact path="/" component={homePage} /> */}
                        <Route path="/pages" component={homePage} />
                        <Route path="/ChinaTown" component={homePage} />
                        <Route path="/Chat" component={StaticMap} />
                        <Route path="/driver" component={driver} />
                        <Route path="/map" component={MainMap} />
                        <Route path="/delivered" component={Delivered} />
                        <Route path="/orderList" component={OrderList} />
                        <Route path="/collecting" component={Delivered} />
                        <Route path="/currentHistory" component={CurrentHistory} />
                        <Route path="/otherHistory" component={Delivered} />
                        <Route path="/user" component={User} />
                        
                        {/* <Link to="/ChinaTown" underlayColor="#f0f4f7" style={{height:40}}>
                            <Text>ChinaTown</Text>
                        </Link>
                        <Link to="/driver" underlayColor="#f0f4f7" style={{height:40}}>
                            <Text>driver</Text>
                        </Link> */}
                    </View>
                    {/* <TabBarComponent
                        style={{ borderTopColor: '#605F60' }}
                    /> */}
                </View>
            </NativeRouter>
        </Provider>)
    }
}


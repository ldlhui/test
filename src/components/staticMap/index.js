
/**
 * @imports
 */
import { PermissionsAndroid, NativeModules } from 'react-native';
import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Dimensions,
    Button,
    BackHandler,
    Image,
    TouchableHighlight
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewNavigation, {
    NavigationModes, TravelModeBox, TravelIcons,
    TravelModes, DirectionsListView, ManeuverView, DurationDistanceView
} from 'react-native-maps-navigation';
import OptionGroup from 'react-native-optiongroup';
import Styles, { AppColors, AppFonts } from '../../../styles/AppStyles';
import MapStyles from '../../../styles/MapStyles';
// import Geocoder from 'react-native-geocoder';
import MapViewDirections from 'react-native-maps-directions';
import { StackNavigator, TabBarBottom, TabNavigator, createStackNavigator, createAppContainer } from "react-navigation";
const { width, height } = Dimensions.get('window');
var Geolocation = require('Geolocation');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



var nativeImageSource = require('./hs.png');
// import localIcon from ""; 

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
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
    // static navigationOptions =  ({navigation, screenProps}) => ({
    //     title: 'Route View',
    //     headerLeft:(
    //         <Text  onPress={()=>{
    //             navigation.goBack()
    //             // alert(JSON.stringify(navigation));
    //             // navigation.state.params.navigatePress()
    //         }} style={{
    //             marginLeft:5, 
    //             width:50,
    //             textAlign:"center",
    //             fontFamily: 'iconfont',
    //             fontSize: 15
    //         }} >
    //             {/* {JSON.stringify(navigation)} */}
    //             &#xe614;
    //         </Text>
    //     )
    // });
    // static navigationOptions = {
    //     tabBarLabel: '主页',
    //     tabBarIcon: ({ focused, tintColor }) => (
    //         <Image
    //             style={{ width: 26, height: 26, tintColor: tintColor }}
    //         />
    //     )
    // };
    _onBackAndroid = () => {
        alert(JSON.stringify(this.props.navigator.pop()))
        // const { params } = this.props.navigation.state;
        // const { goBack } = this.props.navigation
        // this.props.navigation.push(params.routeName);
        // goBack(params.routeName);
        // goBack(params.routeName)
        // this.props.navigation.push(params.routeName);

    }

    /**
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
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
        }

        this.mounted = false;

        const location = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                'title': 'Cool Photo App Camera Permission',
                'message': 'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.'
            }
        )
    }

    static navigationOptions = {    
        header: null
    };

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
        global.storage.load({
            key: 'location'
        }).then(locations => {

            this.setState({
                origin: {
                    latitude: locations.latitude,
                    longitude: locations.longitude
                }
            })
        }
            , error => {
            });

        // NativeModules.ToastExample.show("asd", 0, (data) => {
        //     data = JSON.parse(data);
        //     this.lnlg += "\n获取3位置第" + this.count + "次 latitude"
        //         + JSON.stringify(data);
        //     this.setState({
        //         origin: {
        //             latitude: data.latitude,
        //             longitude: data.longitude
        //         }
        //     })
        //     this.count++;
        // });
    }

    onBackPress = () => {
        return true;
        // const { params } = this.props.navigation.state;

        // const { goBack } = this.props.navigation;

        // // alert(JSON.stringify(params));
        // this.props.navigation.push(params.routeName);
        // goBack(params.routeName);
        // if (nav.index === 0) {
        //     return false;
        // }
        // dispatch(NavigationActions.back());
        // return true;
    };

    componentWillMount() {
        if (this.timer) {
            this.timer && clearTimeout(this.timer);
        }

        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentDidMount() {
        let me = this;
        me.getLocation();
        // this.props.navigation.setParams({ navigatePress:this._onBackAndroid });
        // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    /**
     * @render
     * @returns {*}
     */
    render() {
        this.timer && clearTimeout(this.timer);
        this.lnlg += "\nload\n";
        this.timer = setTimeout(this.getLocation.bind(this), 3200);

        const params = this.props.location.state;
        const { data, pathname } = params;
        // const { params } = this.props.navigation.state;
        // alert(JSON.stringify(this.props.location));

        if(!params) return false;
        return (
            <View style={Styles.appContainer}>
                {/* <Text>
                    {params.index}
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
                            // params.returnData(params.index);
                            this.props.history.goBack({state:{ddd:123}});
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingTop: 5
                            }}
                        >
                            <Text 
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
                {
                    this.state.origin.latitude != 0 ? (<MapView
                        // provider={this.props.provider}
                        style={{
                            width: width,
                            height: height,
                            flex: 1,
                        }}
                        Camera={{
                            center: {
                                latitude: this.state.origin.latitude,
                                longitude: this.state.origin.longitude,
                            },
                            zoom: 4,
                            pitch: 45,
                            heading: 90,
                            altitude: 1000,
                            zoom: 12,
                        }}

                        // showsUserLocation={true}
                        // style={}
                        // initialRegion={{
                        //     latitude: this.state.origin.latitude,
                        //     longitude: this.state.origin.longitude,
                        //     latitudeDelta: LATITUDE_DELTA,
                        //     longitudeDelta: LONGITUDE_DELTA,
                        // }}
                        initialCamera={{
                            center: {
                                latitude: this.state.origin.latitude,
                                longitude: this.state.origin.longitude,
                            },
                            pitch: 45,
                            heading: 90,
                            altitude: 1000,
                            zoom: 12,
                        }}
                    >
                        {/* <MapView.Marker coordinate={this.state.origin} /> */}
                        
                        
                        <MapView.Marker
                                    // image={nativeImageSource}
                            coordinate={this.state.origin}
                        >

                            <Image style={{
                                width:35,
                                height:35
                            }} source={nativeImageSource} />

                        </MapView.Marker>
                        
                        <MapView.Marker
                            coordinate={params.destination}
                        />
                        {
                            this.state.destination.latitude != 0 && this.state.origin.latitude ? (<MapViewDirections
                                origin={this.state.origin}
                                region={this.state.origin}
                                destination={params.destination}
                                apikey={GOOGLE_API_KEY}

                                // showsUserLocation={true}
                                strokeWidth={4}
                                strokeColor="hotpink"
                            />) : null
                        }
                    </MapView>) : null
                }
            </View>
        )
    }
}
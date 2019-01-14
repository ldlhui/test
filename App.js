
/**
 * @imports
 */
import { PermissionsAndroid } from 'react-native';
import React, { Component } from 'react';
import {ScrollView ,View, Text, TextInput, TouchableOpacity, Alert,StyleSheet, Dimensions, Button} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FlipView from 'react-native-flip-view';
import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, 
  TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } 
    from 'react-native-maps-navigation';
import OptionGroup from 'react-native-optiongroup';
import Styles, {AppColors, AppFonts} from './styles/AppStyles';
import MapStyles from './styles/MapStyles';
import Geocoder from 'react-native-geocoder';
// Geocoder.fallbackToGoogle('AIzaSyA1aRU1Y0jYPXue6s2aWupkEngzikkAayk');
// import React from 'react';
// import { StyleSheet, Dimensions, Button } from 'react-native';

// import {Text, TextInput, TouchableOpacity} from 'react-native';
// import MapView from 'react-native-maps';

// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, 
//   Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } 
//   from 'react-native-maps-navigation';
import MapViewDirections from 'react-native-maps-directions';

// import OptionGroup from 'react-native-optiongroup';
// import FlipView from 'react-native-flip-view';
// import MapStyles from './styles/MapStyles';
// import Styles, {AppColors, AppFonts} from './styles/AppStyles';
const { width, height } = Dimensions.get('window');
var Geolocation = require('Geolocation');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
/**
 * Settings
 * @type {string}
 */

/**
 * You need to fill in a Google API Key that enables the Direction API.
 */
const GOOGLE_API_KEY = 'AIzaSyA1aRU1Y0jYPXue6s2aWupkEngzikkAayk';

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
export default class App extends Component {

    /**
     * @constructor
     * @param props
     */
    constructor(props)
    {
        super(props);
        this.timer = null;
        this.count = 1;
        this.lnlg = "";
        this.state = {
            origin: {latitude: 0, longitude: 0},
            destination: {latitude: 0, longitude: 0},
            navigationMode: NavigationModes.IDLE,
            travelMode: TravelModes.DRIVING,
            isFlipped: false,
            isNavigation: false,
            route: false,
            step: false,
        }


    this.mounted = false;
        
        const granted = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Cool Photo App Camera Permission',
            'message': 'Cool Photo App needs access to your camera ' +
                      'so you can take awesome pictures.'
          }
        )


        const location = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            'title': 'Cool Photo App Camera Permission',
            'message': 'Cool Photo App needs access to your camera ' +
                      'so you can take awesome pictures.'
          }
        )
    }

    /**
     * goDisplayRoute
     * @void
     */
    goDisplayRoute()
    {
        if(!this.validateRoute()) return;

        // There are two ways to display a route - either through the method
        // displayRoute or by setting the props.
        // The difference is that you get instant feedback when using methods vs props.

        if(USE_METHODS) {

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
    watchLocation() {
        let me = this;
        // eslint-disable-next-line no-undef
        this.watchID = navigator.geolocation.watchPosition((location) => {
        //   const myLastPosition = this.state.myPosition;
        //   const myPosition = position.coords;
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;

          this.lnlg += "\n获取第二位置第"+this.count+"次 latitude"
          +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
            if( latitude && longitude){

                this.lnlg += "\n||日志"
                +JSON.stringify(me.state.origin.latitude)+"  "+JSON.stringify(latitude)+"\n";
                if(me.state.origin.latitude != latitude || me.state.origin.longitude != longitude){
                    me.setState({
                    origin: {
                      latitude: latitude, 
                      longitude: longitude
                    }
                  });
                  this.count = this.count+1;
  
                  this.lnlg += "\n获取第二位置第"+this.count+"次 latitude"
                      +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
                  // alert("获取位置第"+this.count+"次"+JSON.stringify(location));
                }
              }
        //   if (!isEqual(myPosition, myLastPosition)) {
        //     this.setState({ myPosition });
        //   }
        }, null, this.props.geolocationOptions);
      }
    /**
     * goNavigateRoute
     * @void
     */
    goNavigateRoute()
    {
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
    validateRoute()
    {
        if(this.state.destination.length >= 3) return true;

        Alert.alert('Address required', 'You need to enter an address first');

        return false;
    }

    getLocation() {
        
        this.lnlg += "\n|12志 ddddd"+"\n";

        Geolocation.getCurrentPosition(
            location => {
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
                this.lnlg += "\n|location"
                    +JSON.stringify(location)+"\n";
                if( latitude && longitude){
                    this.lnlg += "\n|12志"
                        +JSON.stringify(this.state.origin.latitude)+"  "+JSON.stringify(latitude)+"\n";

                    // this.lnlg += "\ns获取位置第"+this.count+"次 latitude"
                    // +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
                    // 
                  if(this.state.origin.latitude != latitude || this.state.origin.longitude != latitude){
                    this.setState({
                      origin: {
                        latitude: latitude, 
                        longitude: longitude
                      }
                    });
                    this.count = this.count+1;
    
                    // this.lnlg += "\n获取位N"+JSON.stringify(location);
                    this.lnlg += "\n获取位置第"+this.count+"次 latitude"
                        +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
                    // alert("获取位置第"+this.count+"次"+JSON.stringify(location));
                  }
                }
            },
            error => {
                this.lnlg += "\n错误日志"
                        +JSON.stringify(error);
                alert("获取位置失败："+ JSON.stringify(error))
            }
            ),{maximumAge:0}

    //   Geolocation.watchPosition((location) => {
    //         latitude = location.coords.latitude;
    //         longitude = location.coords.longitude;
    //         if( latitude && longitude){

    //             this.lnlg += "\n||日志"
    //             +JSON.stringify(this.state.origin.latitude)+"  "+JSON.stringify(latitude)+"\n";
    //             if(this.state.origin.latitude != latitude || this.state.origin.longitude != longitude){
    //               this.setState({
    //                 origin: {
    //                   latitude: latitude, 
    //                   longitude: longitude
    //                 }
    //               });
    //               this.count = this.count+1;
  
    //               this.lnlg += "\n获取第二位置第"+this.count+"次 latitude"
    //                   +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
    //               // alert("获取位置第"+this.count+"次"+JSON.stringify(location));
    //             }
    //           }
    //   },{maximumAge:0}
    //   );
    }

    componentWillMount() {

    // alert(this.watchID);
    this.mounted = false;
      if(this.watchID) navigator.geolocation.clearWatch(this.watchID);
      this.setDestination("Dame St, Dublin 2");
    }

    setDestination(destinationName) {
      
      // alert("---"+JSON.stringify(destinationName));
      // res = Geocoder.getFromLocation(destinationName);
      // alert(JSON.stringify(destinationName))
      Geocoder.geocodeAddress(destinationName).then(res => {

        var position = res[0].position;
        this.setState({
          destination: {
            latitude: position.lat?position.lat:this.state.destination.latitude, 
            longitude: position.lng?position.lng:this.state.destination.longitude
          }
        });
        // res is an Array of geocoding object (see below)
      })
      // this.setState({destinationName,destination:destinationName})
    }

    componentDidMount() {
        // this.mounted = true;
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        // .then(granted => {

        //     this.lnlg += "\n获grantede"+JSON.stringify(granted);

        //     this.lnlg += granted;
        //     if (granted && this.mounted) this.watchLocation();
        // });
        // this.watchLocation();

        const ddd = this.getLocation();
        this.timer = setInterval( () => {this.getLocation()},
            3200
        );
        this.timer2 = setInterval( () => { ddd },
            3200
        );
        // if (Platform.OS === 'android') {
            
        //   } else {
        //     this.watchLocation();
        //   }
        // let me = this;
        // var test = function() {
            // Geolocation.getCurrentPosition(
            //     location => {
            //         latitude = location.coords.latitude;
            //         longitude = location.coords.longitude;
            //         if( latitude && longitude){
            //         //     me.lnlg += "\n||日志"
            //         //         +JSON.stringify(me.state.origin.latitude)+"  "+JSON.stringify(latitude)+"\n";
            //         //   if(me.state.origin.latitude != latitude || me.state.origin.longitude != longitude){
            //         //     me.setState({
            //         //       origin: {
            //         //         latitude: latitude, 
            //         //         longitude: longitude
            //         //       }
            //         //     });
            //         //     me.count = me.count+1;
        
            //         //     me.lnlg += "\n获取位N"+JSON.stringify(location);
            //         //     me.lnlg += "\n获取位置第"+me.count+"次 latitude"
            //         //         +JSON.stringify(latitude)+" longitude"+JSON.stringify(longitude);
            //         //     // alert("获取位置第"+this.count+"次"+JSON.stringify(location));
            //         //   }
            //         }
            //     },
            //     error => {
            //         me.lnlg += "\n错误日志"
            //                 +JSON.stringify(error);
            //       alert("获取位置失败："+ JSON.stringify(error))
            //     }
            //   ),{maximumAge:0}
        // }
        // this.timer = setInterval( "test",
        //   200
        // );
    }
    /**
     * @render
     * @returns {*}
     */
    render()
    {
        this.lnlg +="\nload\n";
        // clearInterval(this.timer);
        // alert(this.watchID == null);
        if(this.watchID != null){
            this.getLocation();
            navigator.geolocation.clearWatch(this.watchID);
        }
        // window.requestAnimationFrame(ddd);
    //   this.getLocation();
      // alert("666"+JSON.stringify(this.state.origin));

      // alert("888"+JSON.stringify(this.state.destination));
      return (
          <View style={Styles.appContainer}>

              {this.state.isNavigation ? null : (
                  <View style={Styles.appHeader}>
                      {/* <Text style={Styles.inputLabel}>Where do you want to go?</Text> */}
                      <View style={Styles.inputContainer}>
                          <TextInput style={Styles.input} onChangeText={destinationName => this.setDestination(destinationName)} 
                          value={this.state.destinationName}/>

                          <TouchableOpacity style={Styles.button} onPress={() => this.getLocation()}>
                              <Text style={Styles.buttonText}>{'\ue961'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={Styles.button} onPress={() => this.goNavigateRoute()}>
                              <Text style={Styles.buttonText}>{'\ue975'}</Text>
                          </TouchableOpacity>

                      </View>
                      <TravelModeBox
                          onChange={travelMode => this.setState({travelMode})}
                          inverseTextColor={AppColors.background}
                      />
                  </View>
               )}
              {
                  this.state.origin.latitude != 0 ?(<MapView
                    // provider={this.props.provider}
                    style={{width: width,
                      height: height,
                      flex: 1,
                    }}
                    // style={}
                    initialRegion={{
                      latitude: this.state.origin.latitude,
                      longitude: this.state.origin.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
    
                    >
                      <MapView.Marker coordinate={this.state.origin}/>
                      <MapView.Marker coordinate={this.state.destination}/>
                      {
                        this.state.destination.latitude!=0 && this.state.origin.latitude ?(<MapViewDirections
                          origin={this.state.origin}
                          region={this.state.origin}
                          destination={this.state.destination}
                          apikey={GOOGLE_API_KEY}
                          strokeWidth={3}
                          strokeColor="hotpink"
                        />):null
                      }
                    </MapView>):null
              }
              

              {/* <View style={Styles.appFooter}>
                  <OptionGroup
                      options={['Map']}
                      onChange={v => this.setState({isFlipped: v == 1})}
                      defaultValue={0}
                      borderColor={AppColors.foreground}
                      inverseTextColor={AppColors.background}
                  />
              </View> */}
              <ScrollView style={Styles.heightText}>
                <Text>
                    {this.lnlg}
                </Text>
              </ScrollView>
          </View>
      )
    }
}
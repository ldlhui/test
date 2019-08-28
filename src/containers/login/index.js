
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
    Platform,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import *as counterAction from '../../action/counterAction';
import Camera from 'react-native-camera';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Svg from "../../../icons/icons";
import { NativeModules } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { LogIn,sendCode,verifyCode } from "../../api";
import {
  NativeRouter,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-native";
// import console = require('console');

var nativeImageSource = require('../../../icons/aaa.png');
const { width, height } = Dimensions.get('window');

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.phoneNumber = "";
        this.verifyCode = "";
        this.name  = "";
        this.state = {
            index: 0,
            hideImage: false,
            routes: [
                { key: 'first', title: 'Uncollected \n Orders' },
                { key: 'second', title: 'Current \n Delivery' },
            ],
            isRecording: false,
            showQrcode: false,

            cameraType: Camera.constants.Type.back,
            cameraType: "",
            dis:false,
            showTime:true,
            tn:0
        };
        global.storage.save({
            key:'showOrders',
            data: false,
            expires: null
        });
    }

    static navigationOptions = {
        header: null
    };

    // gotoLogin(){
    //     login({
    //         //data
    //     },{
    //         //token
    //     }).then((data) => {
    //         // 
    //     });
    // }

    
    //切换前后摄像头
    switchCamera() {
        var state = this.state;

        // if(state.cameraType === Camera.constants.Type.back) {
        //     state.cameraType = Camera.constants.Type.front;
        // }else{
        //     state.cameraType = Camera.constants.Type.back;
        // }

        this.setState(state);
    }

    //拍摄照片
    takePicture() {
        // this.camera.capture()
        // .then(function(data){
        //     alert("拍照成功！图片保存地址：\n"+data.path)
        // })
        // .catch(err => console.error(err));
    }

    parseData(e) {
        // console.log('Barcode: ' + e.data);
        // console.log('Type: ' + e.type);
    }
    onSuccess(e) {
        // alert(JSON.stringify(this.props.history));
        // this.props.navigation.push('pages');

        // alert(JSON.stringify(e.data));
        let storeInfo = e.data;

        global.dm.shopId = storeInfo.shopId ;
        global.storage.save({
            key:'dm',
            data: global.dm,
            expires: null
        });
        // let Name = storeInfo.name+"\n"+storeInfo.phone;
        // alert( Name  );
        global.storeInfo = JSON.parse(storeInfo);
        global.storage.save({
            key: 'storeInfo',
            data: global.storeInfo,
            expires: null
        });
        global.storage.save({
            key: 'showOrders',
            data: false,
            expires: null
        });
        global.storage.save({
            key: 'ShiftOhters',
            data: false,
            expires: null
        });
        this.props.history.push('/pages')
    //    return <Redirect to="/pages" />

    }

    componentDidMount(){

        

        global.storage.load({
            key: 'dm'
        }).then(dmData => {
            global.dm = dmData;

            if(dmData) {

                global.storage.load({
                    key: 'storeInfo'
                }).then(data => {
                    global.storeInfo = data;
                    if(data){
                        
                        this.props.history.push('/pages')
                    }
                })
            }

            
        })


        // global.storage.save({
        //     key:'cookie',
        //     data: global.cookie,
        //     expires: null
        // });

        // if(!global.cookie) {
        //     global.storage.load({
        //         key: 'storeInfo'
        //     }).then(data => {
        //         global.cookie = data;
        //     })
        // }
    }
    asd(){
        
        // new Date().format('HH:mm:ss');
        // time =  new Date().getTime().Format("hh:mm:ss");

    }
    render() {

        global.storage.save({
            key:'token',
            data: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdGF0aWNfdXNlci1bXSIsImV4cCI6MTU3OTk2MzI0OX0.y2OlhGPQDYgY8bOFALjTVpiD2N-2RAOJLi3ePXGboZmWQYOBrsS9r-PJFOR-fPuVYLZJXFFtkzMGiDwbrM1Zvw",
            expires: null
        });

        scanArea = (
            <View style={styles.rectangleContainer}>
                <View style={styles.rectangle} />
            </View>
        )

        const qrcode =  <QRCodeScanner
            onRead={this.onSuccess.bind(this)}
            topContent={
                <Text style={styles.centerText}>
                </Text>
            }

            bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                </TouchableOpacity>
            }

            cameraStyle={{
                width: 250,
                height: 200
            }}
        />

        return (<View>
            {
                this.state.showQrcode == false ? (
                    <View>
                        {/* <WebView
                            originWhitelist={['*']}
                            source={{uri: 'file:///android_assets/pages/qr.html'}}
                        /> */}
                        <View style={{height:80,marginTop:50,width:width,
                                flexDirection: 'row',justifyContent:"center"}}>
                                <Image style={{
                                    width:width*.6,
                                    height:80
                                }} source={nativeImageSource} />
                        </View>
                    </View>
                ):null
            }
            
            {
                this.state.hideImage == false ? (
                    <View style={{flexDirection: 'row',justifyContent:"center",marginTop:50,height:40}}>
                        <Text style={{fontSize:16,fontWeight:"bold"}}>Please Choose Your Country</Text>
                    </View>):null
            }

            { this.state.hideImage == false ? (
                <View style={{flexDirection: 'row',height:150,justifyContent:"center"}}>
                    <View style={{justifyContent:"center",marginRight:10}}>
                        <TouchableHighlight
                            onPress = {()=>{
                                this.setState({
                                        local:"irl",
                                        hideImage:true
                                })
                            }}
                        >
                            <Svg key={`key-1`} 
                                icon={"irl-large-360x216"} 
                                fill="#000000"
                                style={{width:128,height:80}}
                            />
                        </TouchableHighlight>
                    </View>
                    <View style={{justifyContent:"center",marginLeft:10}}>
                        <TouchableHighlight
                            onPress = {()=>{ 
                                this.setState({
                                    local:"uk",
                                    hideImage:true
                                })
                            }}
                        >
                            <Svg key={`key-1`} 
                                icon={"uk-large-360x216"} 
                                fill="#000000"
                                style={{width:128,height:80}}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
            ):null}
            {
                this.state.showQrcode ? (
                    <View>
                        <View style={{flexDirection: 'row'}}>
                        <TouchableHighlight
                            onPress = {()=>{
                                //qrqrqr 
                                // {
                                //     "name": "Pizza Town",
                                //     "eircode": "D05 K8Y6",
                                //     "address": "138 SPRINGDALE ROAD DUBLIN 5 D05 K8Y6",
                                //     "latitude": 35.785094,
                                //     "longitude": 139.663175,
                                //     "feeBase": null,
                                //     "feePerKm": null,
                                //     "phone": "01-23231232",
                                //     "shopId": "001bbb"
                                //   }
                                this.setState({
                                    showName: true,
                                    showQrcode: false
                                })
                            }}
                        >
                            <Text style={{
                                fontSize: 27,
                                paddingLeft:20,
                                fontFamily:"iconfont",
                                color: "#000000",
                                paddingTop: 10
                            }}>
                                &#xe624;
                            </Text>
                        </TouchableHighlight>
                            <Text
                                style={{
                                    fontWeight:"bold",
                                    fontSize: 27,
                                    paddingTop: 5,
                                    paddingLeft: 20
                                }}
                            >
                                Scan Store QR Code
                            </Text>
                        </View>
                        <ScrollView style={{
                            paddingTop: height-(height-20),
                            paddingLeft: (width-250)*.5,
                        }}
                        // onScrollChanged={e=>alert(JSON.stringify(e))}
                        >
                            {qrcode}
                        </ScrollView>
                    </View>
                ):null
            }
            {/* <ScrollView style={{
                paddingTop: height-(height-20),
                // paddingLeft: (width-250)*.5,
            }}
            >
                {qrcode}
            </ScrollView> */}
            { this.state.local && this.state.showQrcode == false ? (
                <View>
                    <View style={{flexDirection: 'row',marginTop:30,justifyContent:"center"}}>
                        <View style={{
                            borderWidth: 2,
                            borderRightWidth: 0,
                            borderColor: "#f0695a",
                            borderLeftTopRadius: 5,
                            borderLeftButtomRadius: 5,
                            width:70,
                            paddingLeft:5,
                            flexDirection: 'row'
                        }}>
                            { this.state.local=="irl" ? (<Svg key={`key-1`} 
                                    icon={"irl-large-360x216"} 
                                    fill="#000000"
                                    style={{width:50,height:50}}
                                />):(<Svg 
                                    key={`key-1`} 
                                    icon={"uk-large-360x216"} 
                                    fill="#000000"
                                    style={{width:50,height:50}}
                                />)
                            }
                            <View style={{paddingTop:15}}>
                                {this.state.local == "irl" ?
                                (<Text>+353</Text>):
                                (<Text style={{paddingTop:5}}>+44</Text>)}
                            </View>
                           
                        </View>
                        <View style={{
                            borderWidth:2,
                            borderLeftWidth:0,
                            borderRightTopRadius: 5,
                            borderRightButtomRadius: 5,
                            borderColor: "#f0695a",
                            width: width * 0.7 - 70,
                            flexDirection: 'row',
                            paddingLeft:25
                        }}>
                            <TextInput style={{width: width * 0.6}}
                                onChangeText={data => this.phoneNumber = data}
                            />
                        </View>
                    </View>
                    <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent:"center"
                        }}>
                        <View style={[{width:width*.7,height:25},styles.loginAction]}>
                        
                        {this.state.showTime?(<Button
                                title="Send Login Code"
                                color={Platform.OS === 'android' ? "#f0695a": "#ffffff"}
                                barStyle={{backgroundColor:"#f0695a"}}
                                onPress={() => { 
                                    if(this.phoneNumber === "110110110"){
                                        alert("your code is 000000")
                                    }
                                    sendCode({                                        
                                        phone: this.phoneNumber
                                    }).then((data) => {
                                        // alert(JSON.stringify(global.cookie));
                                        // alert(JSON.stringify(data));
                                        this.setState({
                                            showTime: false,
                                            tn:30
                                            // local: false
                                        })

                                        setInterval(()=>{
                                            this.setState({
                                                tn:this.state.tn>0?this.state.tn-1:0
                                            })
                                        }, 1200);
                                        
                                        setTimeout(()=>{
                                            this.setState({
                                                showTime: true,
                                                // local: false
                                            })
                                        }, 30000);
                                    });
                                }}
                                buttonStyle={{
                                    height:25,
                                    shadowColor:"#ffffff"
                                }}
                            />):(<Button
                                title={"wait for " + this.state.tn +"s" }
                                color="#d1d3d2"
                                onPress={() => { 
                                    // sendCode({                                        
                                    //     phone: this.phoneNumber
                                    // }).then((data) => {
                                    //     // alert(JSON.stringify(global.cookie));
                                        
                                    //     // alert(JSON.stringify(data));
                                    //     this.setState({
                                    //         showTime: true,
                                    //         // local: false
                                    //     })
                                        
                                    // });
                                }}
                                buttonStyle={{
                                    height:25,
                                    shadowColor:"#ffffff"
                                }}
                            />)}
                            {/* <TouchableHighlight>
                                
                            </TouchableHighlight>  */}
                        </View>
                    </View>
                </View>):null
            }


            { this.state.local && this.state.showQrcode == false ? (
                <View>
                    <View style={{flexDirection: 'row',marginTop:30,justifyContent:"center"}}>
                        <View style={{
                            borderWidth:2,
                            borderRightTopRadius: 5,
                            borderRightButtomRadius: 5,
                            borderColor: "#f0695a",
                            width: width * 0.7,
                            flexDirection: "row",
                            justifyContent: "center",
                            paddingLeft:5
                        }}>
                            <TextInput style = {{width: width * 0.6,
                                height: 45,
                            }}
                                onChangeText = {data => this.verifyCode = data}
                                placeholder = "Login Code"
                            />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent:"center"
                    }}>
                        <View style={{width:width*.7,height:Platform.OS === 'android' ? 25: 35,

                            backgroundColor:Platform.OS === 'android' ? '': "#f0695a"
                        }}>
                            <TouchableHighlight>
                                <Button
                                    title="Login"
                                    color={Platform.OS === 'android' ? "#f0695a": "#ffffff"}
                                    onPress={() => {
                                        // if(!global.cookie) {
                                        //     return false;
                                        // }
                                        // global.cookier = global.cookie
                                        // global.storage.save({
                                        //     key:'cookie',
                                        //     data: global.cookie,
                                        //     expires: null
                                        // });
                                        verifyCode({
                                            "status": "offline",
                                            "phone": this.phoneNumber,
                                            "email": null,
                                            "verifyCode": this.verifyCode
                                        }).then((data) => {
                                            // alert("verifyCode"+JSON.stringify(data));
                                            // alert("bfbfbf"+data.data);

                                            if(data.data!=null){
                                                global.dm = data.data;
                                                global.storage.save({
                                                    key:'dm',
                                                    data: data.data,
                                                    expires: null
                                                });
                                                this.setState({
                                                    showName:true,
                                                    local:false
                                                })
                                            }else{
                                                Alert.alert('Login faild',data.msg);
                                            }
                                        });
                                    }}
                                    buttonStyle={{
                                        height:25,
                                        shadowColor:"#ffffff"
                                    }}
                                />
                            </TouchableHighlight> 
                        </View>
                    </View>
                </View>):null
            }

            { this.state.showName && this.state.showQrcode == false ? (
                <View>
                    <View style={{flexDirection: 'row',marginTop:30,justifyContent:"center"}}>
                        <View style={{
                            borderWidth:2,
                            borderRightTopRadius: 5,
                            borderRightButtomRadius: 5,
                            borderColor: "#f0695a",
                            width: width * 0.7,
                            flexDirection: "row",
                            justifyContent: "center",
                            paddingLeft: 5
                        }}>
                            <TextInput style = {{width: width * 0.6,
                            height:45
                        }}
                                onChangeText = {data => this.name = data}
                                placeholder = "Your Name"
                            />
                        </View>
                    </View>
                    <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent:"center"
                        }}>
                        <View style={{width:width*.7,height:25}}>
                            <TouchableHighlight>
                                <Button
                                    title="Next"
                                    color="#f0695a"
                                    onPress={() => { 
                                        // this.onSuccess()asd
                                        global.dm.name = this.name ;
                                        global.storage.save({
                                            key:'dm',
                                            data: global.dm,
                                            expires: null
                                        });
                                        LogIn({
                                            "name":  this.name,
                                            "phone": this.phoneNumber,
                                            "status": "online",
                                            "latitude": 0.0,
                                            "longitude": 0.0,
                                        }).then((data) => {
                                            // alert(JSON.stringify(data));
                                            this.setState({showQrcode:true})
                                        })
                                    }}
                                    buttonStyle={{
                                        height:25,
                                        shadowColor:"#ffffff"
                                    }}
                                />
                            </TouchableHighlight> 
                        </View>
                    </View>
                </View>):null
            }
        </View>)
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
)(MainPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginAction:{
        height:Platform.OS === 'android' ? 25: 35,
        backgroundColor:Platform.OS === 'android' ? '': "#f0695a",
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

    }
});
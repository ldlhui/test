
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Button,
    TouchableHighlight,
    WebView,
    Animated,
    TouchableNativeFeedback,
    Linking,
    ScrollView,
    DeviceEventEmitter,
    Platform
} from 'react-native';
import { Overlay } from 'react-native-elements';

import moment from 'moment';
const { width, height } = Dimensions.get('window');
import AppStyles from "./style";
// import { Text, View} from 'react-native';
// import PopUp from "../common/popup";
// import {
//     StackNavigator,
//     TabNavigator
// } from 'react-navigation';

import Svg from "../../../icons/icons";
import { OrderQuery, DailySum,Update,startShift } from "../../api";

import LineBtn from "../lineBtn";

import Spinner from 'react-native-loading-spinner-overlay';
/**
 * @app
 */
class ChinaTown extends React.Component {

    /**
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.token = null;

        let initialVisibility = 1;

        const initialOffset = {
            x: this._getScrollAmount(1, 1),
            y: 0,
        }

        this.state = {
            index: 0,
            orderSize: 1,
            notif: null,
            payload: null,
            newOtherOrderData: null,
            showOtherOrders: false,
            windex:1,
            visibility: new Animated.Value(initialVisibility),
            scrollAmount: new Animated.Value(0),
            initialOffset,
            isVisible: false,
            sid:0,
            leftData:true,
            back: false,
            spinner: false,
            alerm: false,
            scrollViewScrollDirection: ""
        }
        this.oData = null;
        this.pageNum = 0;
        this._panResponder = null;
        this.scrollViewStartOffsetX = 0
    }

    onPressLearnMore() {

    }
    showDailog(item, _this) {
        _this.setState({
            alerm: true,
            item: item
        })

        let info = "";
        //  !item.orderPaidStatus ? "Did you pay sotre.  "+item.driverPaid:"";

        // if( !item.orderPaidStatus ) info =  "Did you pay store €"+item.driverPaid;
        // if( !item.orderPaidStatus ) info = "Did the store pay you €"+item.storePaid;
        // Alert.alert('', 'Please ensure the order will be  \n picked up on time .\n \n You have 20 seconds to cancel the order \n without receiving negative feedback.' ,
        //     
        // );
        setTimeout(function () { 
            _this.setState({ alerm: false }) 
            _this.updateData(item, _this);
        }, 2000);this.confirm

    }
    updateData(item, _this) {
        _this.setState({
            isVisible: true
        })
        setTimeout(function () { _this.setState({ isVisible: false }) }, 10000);
        Update({
            "shopId": item.shopModel.shopId,
            orderId:item.orderId,
            updateStatus: "accepted",
            status: item.status,
            driverModel: {
                driverId: global.dm.driverId,
            },
            shopModel:{
                shopId:item.shopModel.shopId
            }
        }).then((data) => {
            this.props.addDirverNumber(1);
            _this.getData()
        });
    }

    _getScrollAmount = (i) => {
        const tabWidth = width;
        const centerDistance = tabWidth * (i + 1 / 2);
        const scrollAmount = centerDistance - width / 2;

        return this._normalizeScrollValue(scrollAmount);
    };

    _normalizeScrollValue = (value, size) => {
        const tabWidth = width;
        const tabBarWidth = Math.max(
            tabWidth * size,
            width
        );
        const maxDistance = tabBarWidth - width;

        return Math.max(Math.min(value, maxDistance), 0);
    };


    startShift(){

        var a = moment().format('HH:mm:ss')
        global.storage.save({
            key:'ShiftOhters',
            data: true,
            expires: null
        });
        var d = new Date();

        global.storage.save({
            key: 'ShiftOhtersTime',
            data: a,
            expires: null
        });
        startShift({
            status: "onOthers",
            driverId: global.dm.driverId
        }).then((otherData) => {
            this.getData();
        })
    }

    async getData(data) {
        global.storage.load({
            key: 'location'
        }).then(locations => {
                OrderQuery({
                    status: "new",
                    type: "others",
                    shopModel: { 
                        shopId: global.storeInfo.shopId,
                        distance: null,
                    },
                    driverModel: {
                        latitude: locations.latitude,
                        longitude: locations.longitude,
                        name: global.dm.name,
                        driverId: global.dm.driverId,
                        allowDistance:"20"
                    }
                }).then((data) => {
                    this.props.onRightNumber(data.data.length);

                    this.oData = data.data;
                    this.setState({
                        newOtherOrderData: data,
                        orderSize: data.data.length
                    })
                    global.storage.save({
                        key: 'ShiftOhters',
                        data: true,
                        expires: null
                    });
                });
            }
            , error => {

            });
        this.setState({
            showOtherOrders: true
        })
    }


    async componentDidMount() {
        global.storage.load({
            key: 'ShiftOhters'
        }).then(ret => {
            if (!this.state.showOtherOrders && ret == true) {
                this.setState({
                    showOtherOrders: ret
                })
                this.getData();
            }
        })
    }

    _rederOtherData = (item, index) => {

        // let windex = this.state.windex;
        let _this = this;
        let swi = (width - 8) / 2;    
        let windex = (this.state.windex-1)*5;
        return <View style={[AppStyles.mainTabContainer, { 
                width: width,
                height:height-240}]}>
                <ScrollView 
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    pagingEnabled={true}
                    horizontal={false}
                    style={{
                        flex: 1,
                        flexDirection: 'column'
                    }}
                >
                    <View style={{ height: 100 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',
                        width: width - 8,
                        borderLeftWidth: 3,
                        borderLeftColor: "#ffffff"
                    }}>
                            <View style={[{ width: swi }, AppStyles.middleButton,
                                { height: 100, backgroundColor: '#f0695a'
                            }]}>
                                <View style={{
                                    borderWidth: 2,
                                    borderColor: "#f0695a", height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                }}>
                                    <View style={{ flexDirection: 'row', height: 25 }}>
                                        <Text style={styles.iconStyle}>&#xe606;</Text>
                                        <Text style={[styles.lineFont, { color: "#ffffff" }]}> {item.shopModel.name} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', height: 25 }}>
                                        <Text style={styles.iconStyle}>&#xe609;</Text>
                                        <Text style={[styles.lineFont, { color: "#ffffff" }]}> {item.shopModel.phone} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', minHeight: 25 }}>
                                        <Text style={styles.iconStyle}>&#xe607;</Text>
                                        <Text style={[styles.lineFont, { color: "#ffffff", width: width * .8 - 30 }]}>
                                            {item.shopModel.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[{ width: swi+1 }, AppStyles.middleButton,
                            { height: 100,  backgroundColor: '#f0695a', borderRightColor: "#f0695a" ,
                            borderRightWidth: 1}]}>
                                <TouchableHighlight
                                    onPress={() => { Linking.openURL(`tel:` + item.shopModel.phone) }}
                                >
                                    <View style={{
                                        flexDirection: 'row', justifyContent:"center", 
                                        borderColor: "#f0695a", height: (width / 2 - 8) * 0.42,
                                        paddingLeft: 5, fontWeight: "bold"
                                    }}>
                                        <Text style={[{
                                            borderRadius: 60,
                                            width: 60,
                                            height: 60,
                                            fontSize: 60,
                                            padding: 0,
                                            color: '#ffffff',
                                            fontFamily: 'iconfont'
                                        }]}>&#xe60a;</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1 }}>
                    </View>
                    <View style={AppStyles.middleButton}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: width }}>

                            <View style={[AppStyles.middleButtonLeft, { width: width / 2 - 8 }, AppStyles.middleButton, { height: (width / 2 - 8) * 0.42 }]}>
                                <TouchableHighlight
                                    onPress={() => {
                                        // this.props.navigation.navigate('Chat', {
                                        //     destination: {
                                        //         latitude: item.shopModel.latitude,
                                        //         longitude: item.shopModel.longitude
                                        //     }
                                        // })
                                        var path = {
                                            pathname: '/Chat',
                                            state: {
                                                index: index + 1,
                                                destination: {
                                                    latitude: item.shopModel.latitude,
                                                    longitude: item.shopModel.longitude
                                                },
                                                data: item
                                            }
                                        }
                                        this.props.history.push(path);
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row', justifyContent: "space-between", borderWidth: 2,
                                        borderColor: "#f0695a", height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                    }}>
                                        <View>
                                            <Text style={styles.activeFont}>Route to</Text>
                                            <Text style={styles.activeFont}>Store</Text>
                                        </View>
                                        <View style={[{
                                            borderRadius: 45,
                                            backgroundColor: "#f0695a",
                                            width: 45,
                                            height: 45,
                                            margin: 5,
                                            fontSize: 25
                                        }, styles.center]}>
                                            <Text style={styles.iconStyle}>&#xe602;</Text>
                                        </View>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                            <View style={[AppStyles.middleButtonRight, { width: width / 2 - 8 }, AppStyles.middleButton,
                            { height: (width / 2 - 8) * 0.42 }]}>
                                <TouchableHighlight
                                    onPress={() => {
                                        var path = {
                                            pathname: '/Chat',
                                            state: {
                                                index: index + 1,
                                                destination: {
                                                    latitude: item.latitude,
                                                    longitude: item.longitude
                                                },
                                                data: item
                                            }
                                        }
                                        this.props.history.push(path);
                                        // this.props.navigation.navigate('Chat', {
                                        //     destination: {
                                        //         latitude: item.latitude,
                                        //         longitude: item.longitude
                                        //     }
                                        // })

                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row', justifyContent: "space-between", borderWidth: 2,
                                        borderColor: "#f0695a", height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                    }}>
                                        <View>
                                            <Text style={styles.activeFont}>Route to</Text>
                                            <Text style={styles.activeFont}>Customer</Text>
                                        </View>
                                        <View style={[{
                                            borderRadius: 45,
                                            backgroundColor: "#f0695a",
                                            width: 45,
                                            height: 45,
                                            margin: 5,
                                            fontSize: 25
                                        }, styles.center]}>
                                            <Text style={styles.iconStyle}>&#xe602;</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>

                    <View style={[AppStyles.middleButton, { marginTop: 5 }]}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: width }}>
                            <View style={[AppStyles.middleButtonLeft, { width: width / 2 - 8 },
                            AppStyles.middleButton, { height: (width / 2 - 8) * 0.42,
                                borderBottomColor: "#f7f7f7", borderBottomWidth: 2 }]}>
                                {/* <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat') }}
                                >
                                </TouchableHighlight> */}
                                <View style={{
                                    flexDirection: 'row', justifyContent: "space-between",
                                    height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                }}>
                                    <View>
                                        <Text style={styles.activeFont}>Pick Up </Text>
                                        <Text style={[styles.activeFont, { fontWeight: "normal" }]}>
                                            In
                                            {
                                                (item.pickUpEnd -
                                                item.pickUpStart)/ 60000
                                            }
                                            Mins</Text>
                                    </View>
                                </View>
                            </View>
                            {
                                item.driverPaidStatus ? (<View style={[AppStyles.middleButtonRight,
                                { width: width / 2 - 8 }, AppStyles.middleButton,
                                {
                                    height: (width / 2 - 8) * 0.42,
                                    backgroundColor: "#f0695a",
                                    paddingLeft: 15,
                                    paddingTop: 5
                                }]}>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: "space-between",
                                        height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                    }}>
                                        <View>
                                            <Text style={[styles.activeFont, { color: "#ffffff" }]}>Due to Store</Text>
                                            <Text style={[styles.activeFont, { color: "#ffffff" }]}>€{item.driverPaid}</Text>
                                        </View>
                                    </View>
                                </View>) : (<View style={[AppStyles.middleButtonRight,
                                { width: width / 2 - 8 }, AppStyles.middleButton,
                                {
                                    height: (width / 2 - 8) * 0.42,
                                    backgroundColor: "#62a55d",
                                    paddingLeft: 15,
                                    paddingTop: 5
                                }]}>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: "space-between",
                                        height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                    }}>
                                        <View>
                                            <Text style={[styles.activeFont, { color: "#ffffff" }]}>
                                                Due to You
                                            </Text>
                                            <Text style={[styles.activeFont, { color: "#ffffff" }]}>
                                                €{item.storePaid}
                                            </Text>
                                        </View>
                                    </View>
                                </View>)
                            }
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", flexDirection: 'row', marginTop: 5 }}>
                        <Text style={[styles.iconStyle, { color: "#ff544f" }]}>&#xe604;</Text>
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ width: width * .85 }}>
                                {item.address}
                            </Text>
                        </View>
                    </View>
                    <View style={{ width: width - 16, height: 5 }}></View>
                    <View style={{ width: width - 16, height: 2, backgroundColor: "#f7f7f7" }}></View>
                    <View style={{
                        flex: 1, flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: width - 16, height: 36, paddingLeft: 15, paddingRight: 15
                    }}>
                        <View style={{ height: 36, paddingTop: 8 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.time} Mins 
                            ({item.distance} KM)</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 25, fontWeight: "bold", color: "#ff544f" }}>
                            €{item.deliverFee}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* <View style={{
                    flexDirection: 'row',
                    width:width,
                    justifyContent:"center"
                }}>
                    <LineBtn item={item} width={width*.7} title={"Accept"} showDailog={(item)=>{
                        this.showDailog(item, _this);
                        // this.updateData(item, _this);
                    }}>
                    </LineBtn>
                </View> */}
                <View style={{ flexDirection: 'row', width: width, justifyContent: "center" }}>

                    <Text style={{
                        color: "#f0695a",
                        fontFamily: 'iconfont'
                    }}>
                        &#xe6bc;
                    </Text>
                    <Text style={{
                        width: 80,
                        justifyContent: "center",
                        textAlign: "center"
                    }}>
                        {windex+index + 1} to {this.state.orderSize}
                    </Text>
                    <Text style={{
                        color: "#f0695a",
                        fontFamily: 'iconfont'
                    }}>
                        &#xe62d;
                    </Text>

                </View>
            </View>
    }


    backScoll() {
        let mainData = this.oData;

        let windex = (this.state.windex - 1) * 5;

        let data = this.oData.length / 5;
        if (data < 1) return false;
        let dataL = parseInt(data);
        if (data > dataL) dataL = dataL + 1;

        let sw = this.state.windex - 1;

        if(sw==0) return false;
        if (sw < dataL) {
            let cData = [mainData[windex - 5], mainData[windex - 4], mainData[windex - 3], mainData[windex - 2], mainData[windex - 1]];

            this.setState({
                newOtherOrderData: {
                    data: cData
                },
                windex: this.state.windex - 1
            })
        }

    }

    goScoll() {
        // let mainData = this.state.newOtherOrderData.data;
        let mainData = this.oData;

        let windex = (this.state.windex + 1) * 5;

        let data = this.oData.length / 5;

        // let data = this.state.newOtherOrderData.data.length/5;
        let dataL = parseInt(data);
        if (data > dataL) dataL = dataL + 1;

        let sw = this.state.windex + 1;

        if (sw < dataL) {
            let cData = [];
            if (data > dataL) {
                // let Data1 = null,Data2= null,Data3= null,Data4= null,Data5= null

                cData = [];
                if (mainData[windex + 1]) cData[0] = mainData[windex + 1];

                if (mainData[windex + 2]) cData[1] = mainData[windex + 2];

                if (mainData[windex + 3]) cData[2] = mainData[windex + 3];

                if (mainData[windex + 4]) cData[3] = mainData[windex + 4];

                if (mainData[windex + 5]) cData[4] = mainData[windex + 5];



            } else {
                cData = [mainData[windex + 1], mainData[windex + 2], mainData[windex + 3], mainData[windex + 4], mainData[windex + 5]];

            }

            this.setState({
                newOtherOrderData: {
                    data: cData
                },
                windex: this.state.windex + 1
            })
        }
    }
 


    /**
     * @render
     * @returns {*}
     */
    render() {
        
        let initialOffset = {
            x: 0,
            y: 0,
        }

        var _this = this;
        let param = null
        const { state } = this.props.location;
        if (state) param = state;

        let max = width * 4;


        let pageData = [];
        let DataSize = 0;
        if(this.state.newOtherOrderData) {
            DataSize = this.state.newOtherOrderData.data.length/5;
            for(let i = 0; i < DataSize;i++){
                pageData.push({
                    index:i
                })
            }
        }

        if(this.state.back){
            initialOffset.x=max
        }

        if(this.state.scrollViewScrollDirection==="up"){

            if(this.scrollViewStartOffsetX<1500&& this.scrollViewStartOffsetX>=1200) {
                this.pageNum= 3
            }
            if(this.scrollViewStartOffsetX<1200&& this.scrollViewStartOffsetX>=900) {
                this.pageNum= 2
            }
            if(this.scrollViewStartOffsetX<900&& this.scrollViewStartOffsetX>=500) {
                this.pageNum= 1
            }
            if(this.scrollViewStartOffsetX<500) {
                this.pageNum= 0
            }

        }
        if(this.state.scrollViewScrollDirection==="down"){
            if(this.scrollViewStartOffsetX<0) {
                this.pageNum= 1
            }
            if(this.scrollViewStartOffsetX<375&&this.scrollViewStartOffsetX>=0) {
                this.pageNum= 1
            }

            if(this.scrollViewStartOffsetX<750&&this.scrollViewStartOffsetX>=375) {
                this.pageNum= 2
            }

            if(this.scrollViewStartOffsetX<1125&&this.scrollViewStartOffsetX>=750) {
                this.pageNum= 3
            }

            if(this.scrollViewStartOffsetX>=1125) {
                this.pageNum= 4
            }
        }
        
        return (<View style={{width:width,height:height-170}}>
                {
                    this.state.alerm ? (
                        <View style={{
                            width: width,
                            height: height,
                            backgroundColor:'rgba(0, 0, 0, 0.7)',
                            textAlign:"center",
                            position:"absolute",
                            zIndex: 1000,
                            top: -100,
                            alignItems:'center',
                            paddingTop:height*.45
                        }}>
                            <View
                                style={{
                                    width: width,
                                    flexDirection: 'row',
                                    justifyContent:"center"
                                }}
                            >
                                <Text style={{
                                    color:"#ffffff"
                                }}>
                                    Please ensure the order will be 
                                </Text>
                            </View>
                            <View style={{
                                    width: width,
                                    flexDirection: 'row',
                                    justifyContent:"center"
                                }}
                            >
                                <Text style={{
                                    color:"#ffffff"
                                }}>
                                    picked up on time .
                                </Text>
                            </View>
                            <View style={{
                                    width: width,
                                    flexDirection: 'row',
                                    justifyContent:"center"
                                }}
                            >
                                <Text style={{
                                    color:"#ffffff",
                                    fontWeight:"bold"
                                }}>
                                    You have 20 seconds to cancel the order
                                </Text>
                            </View>

                            <View style={{
                                    width: width,
                                    flexDirection: 'row',
                                    justifyContent:"center"
                                }}
                            >
                                <Text style={{
                                    color:"#ffffff",
                                    fontWeight:"bold"
                                }}>
                                    without receiving negative feedback.
                                </Text>
                            </View>
                        </View>
                    ):null
                }
                {
                    this.state.spinner ?(
                        <View style={{backgroundColor:"#ffffff",width: width, 
                                zIndex:1000,
                                textAlign:"center",
                                justifyContent:"center",
                                position:"absolute",height: height - 170}}>
                            <View style={{
                                width: width,
                                textAlign:"center",
                                justifyContent:"center",
                                height: height - 170
                            }}>
                                <Text style={{
                                    width: width,
                                    textAlign:"center",
                                    fontFamily: 'iconfont'
                                }}>
                                    &#xe62c;
                                </Text>
                                <Text style={{
                                    width: width,
                                    textAlign:"center"
                                }}>
                                    Loading...
                                </Text>
                            </View>
                        </View>):null
                }
                {
                    this.state.showOtherOrders ? (
                        this.state.newOtherOrderData ?
                        <View style={styles.scroll}>
                            <View>
                                {
                                    pageData.map((data, index) => 
                                    data.index == this.state.sid ? 
                                        <ScrollView
                                            horizontal
                                            keyboardShouldPersistTaps="handled"
                                            bounces={true}
                                            alwaysBounceHorizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            automaticallyAdjustContentInsets={false}
                                            scrollTo={{ x: Platform.OS === 'ios' ? 0: 1000, y: 0 }}
                                            pagingEnabled={true}
                                            contentOffset={{ x: Platform.OS === 'ios' ? 0: 1000, y: 0 }}
                                            removeClippedSubviews
                                            alwaysBounce={true}
                                            bouncesZoom={true}
                                            ref='_scrollView'
                                            onPanResponderStart={false}
                                            onMoveShouldSetResponderCapture={()=>false}
                                            onStartShouldSetResponderCapture={()=>false}
                                            onLayout={() => {
                                                if(this.state.back){
                                                    this.refs._scrollView.scrollTo({ x: initialOffset.x });
                                                }
                                                setTimeout(()=>this.setState({
                                                    spinner: false                                                    
                                                }), 500);
                                                
                                            }}
                                            
                                            onScrollEndDrag={(event) => {
                                                if (event.nativeEvent.contentOffset.x <= 0 && this.state.sid!=0 ) {
                                                    this.setState({
                                                        sid: this.state.sid-1,
                                                        back: this.state.sid,
                                                        spinner: true
                                                    });
                                                }

                                                if (parseInt(event.nativeEvent.contentOffset.x) >= parseInt(max) && this.state.sid<DataSize-1) {
                                                    this.setState({
                                                        sid: this.state.sid+1,
                                                        back: false,
                                                        spinner: true
                                                    });
                                                }
                                            }}
                                        >
                                            {this.state.newOtherOrderData.data.map((data, index) => 
                                                 index >= this.state.sid*5 && index < (this.state.sid+1)*5
                                                 &&data!=null ?  this._rederOtherData(data, index, _this):null)}
                                            {/* {this.state.newOrderData.data.map((data, index) => 
                                                this._rederData(data, index, _this))} */}
                                        </ScrollView>:null
                                    )
                                }
                                {this.state.newOtherOrderData&&this.state.newOtherOrderData.data.length>0?(<TouchableHighlight>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: width,
                                        height: 100,
                                        justifyContent: "center"
                                    }}>
                                        <LineBtn item={this.state.newOtherOrderData.data[this.pageNum+(this.state.sid*5)]} 
                                            width={width * .7} setCE={(data)=>{
                                                // this.setCE(data, _this)
                                            }} showDailog={(item) => {
                                                this.showDailog(item, _this);
                                            }}
                                            title={"Accept"}
                                        >
                                        </LineBtn>
                                    </View>
                                </TouchableHighlight>):null}
                                
                            </View>
                        </View> : null
                            // <View style={styles.scroll}>
                            //     <Animated.ScrollView
                            //         horizontal
                            //         keyboardShouldPersistTaps="handled"
                            //         bounces={true}
                            //         alwaysBounceHorizontal={true}
                            //         scrollsToTop={true}
                            //         showsHorizontalScrollIndicator={false}
                            //         automaticallyAdjustContentInsets={false}
                            //         // canCancelContentTouches={true}
                            //         // overScrollMode="never"
                            //         scrollTo={{ x: 0, y: 0 }}
                            //         pagingEnabled={true}
                            //         contentOffset={initialOffset}
                            //         // onScroll={this.handleScroll.bind(this)}
                            //         // refreshControl={data=>alert(data)}
                            //         removeClippedSubviews
                            //         alwaysBounce={true}
                            //         bouncesZoom={true}
                            //         ref='_scrollView'
                            //         onScrollEndDrag={(event) => {
                            //             // alert(JSON.stringify(event.nativeEvent.contentOffset.x));
                            //             if(event.nativeEvent.velocity.x >= 0 )this.backScoll();
                            //             if(event.nativeEvent.velocity.x < 0 ) {
                            //                 this.goScoll();
                            //             }
                            //         }}
                            //     >
                            //         {JSON.parse(JSON.stringify(this.state.newOtherOrderData))
                            //             .data.map((data,index) => this._rederOtherData(data,index))}
                            //     </Animated.ScrollView> */}
                            // </View> 
                            // : null
                    ) : (
                            <View>
                                <View style={{
                                    marginTop: 50,
                                    width: width,
                                    justifyContent: "center",
                                    textAlign: "center"
                                }}>
                                    <Text style={{
                                        width: width,
                                        justifyContent: "center",
                                        textAlign: "center"
                                    }}>
                                        Work as a store driver start here
                                    </Text>

                                    <View style={{marginTop: 60}}>

                                        <LineBtn item={{}} width={width - 16} title={"Start Shift"} 
                                            showDailog={(item) => {
                                            this.startShift();
                                        }}>
                                        </LineBtn>

                                    </View>
                                    {/* <View style={{
                                        marginTop: 60, width: width - 16, margin: 8, flexDirection: 'row',
                                        backgroundColor: "#739e5e",
                                        borderRadius: 50
                                    }}
                                    >
                                        <Svg key={`key-1`} icon={"greenslider-arrow-144x144"}
                                            fill="#000000"
                                            style={{ width: 50, height: 50 }} />
                                        <TouchableHighlight
                                            onPress={() => {
                                                this.startShift()
                                            }}

                                            style={{
                                                width: width * .6,
                                                flex: 0, height: 50,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 38, fontWeight: "bold", color: "#FFFFFF" }}>Start Shift</Text>
                                        </TouchableHighlight>
                                    </View> */}

                                </View>
                            </View>
                        )
                }
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
export default ChinaTown;
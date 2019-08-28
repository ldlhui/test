
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
    DeviceEventEmitter,
    ScrollView,
    Alert,
    Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');
import AppStyles from "./style";
// import { Text, View} from 'react-native';
// import PopUp from "../common/popup";
// import {
//     StackNavigator,
//     TabNavigator
// } from 'react-navigation';

import Svg from "../../../icons/icons";

import { OrderQuery, DailySum, Update, punish } from "../../api";

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
            showOrders: true,
            windex:1,
            visibility: new Animated.Value(initialVisibility),
            scrollAmount: new Animated.Value(0),
            initialOffset,
            sid:0,
            leftData:true,
            back: false,
            spinner: false,
            scrollViewScrollDirection: ""
        }
        this.pageNum = 0;
        this.oData = null;
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

    getData(data) {
        global.storage.load({
            key: 'location'
        }).then(locations => {
                OrderQuery({
                    status: "accepted",
                    // shopModel: { shopId: "001bbb" },
                    driverModel: {
                        latitude: locations.latitude,
                        longitude: locations.longitude,
                        name: global.dm.name,
                        driverId: global.dm.driverId
                    }
                }).then((data) => {
                    this.props.onTitleNumber(data.data.length);
                    OrderQuery({
                        status: "collected",
                        shopModel: { shopId: global.storeInfo.shopId },
                        driverModel: {
                            latitude: locations.latitude,
                            longitude: locations.longitude,
                            name: global.dm.name,
                            driverId: global.dm.driverId
                        }
                    }).then((otherData) => {
                        this.props.onRightNumber(otherData.data.length);
                        // this.props.fucn.asd([data.data.length, otherData.data.length]);
                        // DeviceEventEmitter.emit('msg', {
                        //     deliveredNumber:  [data.data.length,otherData.data.length]
                        // });
                    });

                    this.oData = data.data;
                    this.setState({
                        newOtherOrderData: data,
                        orderSize: data.data.length
                    })
                });
            }
            , error => {

            });
    }
    onPressLearnMore() {

    }

    showDailog(item, _this) {
        _this.setState({
            // isVisible: true,
            item: item
        })
        // Alert.alert(item)
        // return false;
        let info = "";
        item.driverPaidStatus ?  info = "Did you pay sotre. €"+item.driverPaid:
        info = "Did the store pay you. €"+item.storePaid
        Alert.alert('',''+ info ,
        [
            {text:"Yes", onPress:()=>{
                this.updateData(item, _this,"Yes")
            }},
            // {text:"No", onPress:this.updateData(item, _this,"No")},
            {text:"No", onPress:()=>{

            }},
        ]
        );
    }
    showCancelDailog(item, _this) {
        _this.setState({
            // isVisible: true,
            item: item
        })

        // let info = "";
        // item.driverPaidStatus ? "Did you pay sotre. €"+item.driverPaid:
        // "Did the store pay you. €"+item.storePaid
        Alert.alert('','You will receive negative feedback  \n if you  cancel this order. \n \n Are you sure you want to cancel ?  ',
        [
            {text:"Yes, \n Cancel It", onPress:()=>{
                this.cancelData(item, _this,"Yes");
            }},
            // {text:"No", onPress:this.updateData(item, _this,"No")},
            {text:"No,  \n Keep It ", onPress:()=>{

            }},
        ]
        );
    }


    cancelData(item, _this, type) {
        let sDate = item.updateTime+":123";
        // var date = new Date(sDate);
        let sDateArr = sDate.split(" ");
        let yy = sDateArr[0].replace(/-/g, '/');
        let sDateArry = sDateArr[0].split("-");

        // alert(sDateArr[1]);
        let sDateArrM = sDateArr[1].split(":");
        let deta = new Date(sDateArry[0],sDateArry[1],sDateArry[2],sDateArrM[0],sDateArrM[1],sDateArrM[2]).getTime();
        let dd = yy+" "+sDateArr[1];
        let nowDate = new Date().getTime();

        if((nowDate-deta)/1000>20) {
            punish({
                driverId: global.dm.driverId
            }).then((data) => {
                Update({
                    orderId: item.orderId,
                    updateStatus: "new",
                    status: item.status,
                    type: 'others',
                    driverModel: {
                        driverId: global.dm.driverId
                    }
                }).then((data) => {
                    // DeviceEventEmitter.emit('DelNumberEmt', {
                    //     data: true
                    // });
                    _this.getData()
                });
            });
        } else {
            Update({
                orderId: item.orderId,
                updateStatus: "new",
                status: item.status,
                type: 'others',
                driverModel: {
                    driverId: global.dm.driverId
                }
            }).then((data) => {
                // DeviceEventEmitter.emit('DelNumberEmt', {
                //     data: true
                // });
                _this.getData()
            });
        }
        // alert(new Date(dd));
// var date = new Date(sDate.replace(/-/g, '/'));
//         alert(sDate);
//         alert(date);
        // 
    }

    updateData(item, _this, type) {
        Update({
            orderId: item.orderId,
            updateStatus: "collected",
            status: item.status,
            type: 'others',
            driverModel: {
                driverId: global.dm.driverId
            }
        }).then((data) => {
            // DeviceEventEmitter.emit('DelNumberEmt', {
            //     data: true
            // });
            _this.getData()
        });
    }

    _rederOtherData = (item, index,length) => {
        
        let _this = this;

        let swi = (width - 8) / 2;    
        let windex = (this.state.windex-1)*5;
        return (
            <View style={[AppStyles.mainTabContainer, {
                width: width,
                height: height - 235,
                flex: 1,
                flexDirection: 'column'
            }]}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        height:  height - 180
                    }}
                >
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        // keyboardShouldPersistTaps='never'
                        showsVerticalScrollIndicator={true}
                        scrollEnabled={true}
                        pagingEnabled={true}
                        horizontal={false}
                        style={{
                            flex: 1,
                            flexDirection: 'column'
                        }}
                    >
                        {/* <View style={{ height: height * .5, minHeight: 310 }}> */}
                        <View style={{ height: 100 }}>
                            <View style={{ flex: 1, flexDirection: 'row',
                                justifyContent: 'space-between', width: width ,
                                // backgroundColor: '#f0695a'
                            }}>
                                <View style={[AppStyles.middleButtonLeft, AppStyles.middleButton,
                                { height: 100, backgroundColor: '#f0695a' },{
                                    borderRightWidth: 3,
                                    borderRightColor: "#ffffff",
                                    borderLeftWidth: 3,
                                    borderLeftColor: "#ffffff",
                                    // paddingLeft:2,
                                    width: width
                                }]}>
                                    {/* <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat') }}
                                >
                                </TouchableHighlight> */}

                                    <View style={{
                                        borderWidth: 2,
                                        borderColor: "#f0695a", height: (width / 2 - 8) * 0.42, paddingLeft: 5,
                                        fontWeight: "bold"
                                    }}>
                                        <View style={{ flexDirection: 'row', height: 25 }}>
                                            <Text style={styles.iconStyle}>&#xe606;</Text>
                                            <Text style={[styles.lineFont, { color: "#ffffff" }]}>{item.shopModel.name}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', height: 25 }}>
                                            <Text style={styles.iconStyle}>&#xe609;</Text>
                                            <Text style={[styles.lineFont, { color: "#ffffff" }]}>{item.shopModel.phone}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', minHeight: 25 }}>
                                            <Text style={styles.iconStyle}>&#xe607;</Text>
                                            <Text style={[styles.lineFont, { color: "#ffffff", width: width * .8 - 30 }]}>
                                                {/* 1 main Street,Ashbourn,Co.Meath A86 ND42 */}
                                                {item.shopModel.address}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[AppStyles.middleButton,{
                            // borderRightWidth: 2,
                            // borderRightColor: "#f0695a",
                            // borderLeftWidth: 0,
                            // borderLeftColor: "#f0695a",
                            width: width-6,
                            justifyContent: 'center',
                            borderRightWidth: 3, 
                            borderLeftWidth: 3,
                            borderRightColor: "#ffffff",
                            borderLeftColor: "#ffffff",
                            // paddingLeft:3
                        }]}>
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'space-between',
                                width: width-6,
                                
                                backgroundColor: "#f0695a", 
                            }}>
                                <View style={[{ width: swi }, 
                                AppStyles.middleButton,
                                { height: (width / 2 - 8) * 0.42 
                                    // ,
                                    // borderRightWidth: 0,
                                    // borderLeftWidth: 0,
                                    // borderRightColor: "#ffffff",
                                    // borderLeftColor: "#ffffff"
                                }]}>
                                    <TouchableHighlight
                                        // onPress={() => { this.props.navigation.push('Chat') }}
                                        onPress={() => {
                                            var path = {
                                                pathname:'/map',
                                                state:{
                                                    destination: {
                                                        latitude: item.latitude,
                                                        longitude: item.longitude
                                                    },
                                                    pathname:'map',
                                                    data:item
                                                }
                                            }
                                            this.props.history.push(path);
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                        }}>

                                            <View style={[{
                                                borderRadius: 45,
                                                backgroundColor: "#ffffff",
                                                width: 45,
                                                height: 45,
                                                margin: 5,
                                                fontSize: 45
                                            }, styles.center]}>
                                                <Text style={[styles.iconStyle, { fontSize: 32, color: "#f0695a" }]}>&#xe602;</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.activeFont, {
                                                    color: "#ffffff",
                                                    fontSize: 20, paddingTop: 12
                                                }]}>Direction</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={[ { width:swi}, AppStyles.middleButton,
                                { height: (width / 2 - 8) * 0.42 }]}>
                                    {/* {item.shopModel.phone} */}
                                    <TouchableHighlight
                                        onPress={() => { Linking.openURL(`tel:` + item.shopModel.phone) }}
                                    // onPress={() => { this.props.navigation.push('Chat') }}
                                    >
                                        <View style={{
                                            flexDirection: 'row', borderWidth: 2,
                                            borderColor: "#f0695a", height: (width / 2 - 8) * 0.42, paddingLeft: 5, fontWeight: "bold"
                                        }}>
                                            <View style={[{
                                                borderRadius: 45,
                                                backgroundColor: "#f0695a",
                                                width: 45,
                                                height: 45,
                                                margin: 5,
                                                fontSize: 45
                                            }, styles.center]}>
                                                <Text style={[styles.iconStyle, { fontSize: 45 }]}>&#xe609;</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.activeFont, {
                                                    color: "#ffffff",
                                                    fontSize: 20, paddingTop: 12
                                                }]}>Call Store</Text>
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
                                            <Text style={styles.activeFont}>Pick Up</Text>
                                            <Text style={[styles.activeFont, { fontWeight: "normal" }]}>In 
                                            
                                                {" "}
                                                {
                                                    (item.pickUpEnd - item.pickUpStart) / 60000
                                                }
                                                {" "}
                                            
                                             Mins</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    item.orderPaidStatus ? (<View style={[AppStyles.middleButtonRight,
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
                                                <Text style={[styles.activeFont, { color: "#ffffff" }]}>Due to store</Text>
                                                <Text style={[styles.activeFont, { color: "#ffffff" }]}>€{item.storePaid }</Text>
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
                                                <Text style={[styles.activeFont, { color: "#ffffff" }]}>Due</Text>
                                                <Text style={[styles.activeFont, { color: "#ffffff" }]}>€{item.driverPaid}</Text>
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
                        <View style={{ width: width - 16, height: 1 }}></View>
                        <View style={{ width: width - 16, height: 2, backgroundColor: "#f7f7f7" }}></View>
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: width - 16, height: 46, paddingLeft: 15, paddingRight: 15
                        }}>
                            <View style={{ height: 45, paddingTop: 2 }}>

                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.orderId}</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold"}}>{item.time} Mins ({item.distance} KM)</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 25, fontWeight: "bold", color: "#ff544f" }}>€{item.deliverFee}</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ width: width - 16, height: 5 }}></View>
                </View>

                {/* <View style={{
                    flexDirection: 'row',
                    width:width,
                    justifyContent:"center"
                }}>
                        <LineBtn item={item} width={width*.7}   showDailog={(item)=>{
                            this.showDailog(item, _this);
                        }}>
                        </LineBtn>
                </View> */}
                <View
                    style={{
                        width: width - 16,
                        height: 50
                    }}
                >
                    <TouchableHighlight
                        onPress={() => {

                            this.showCancelDailog(item, _this)

                            // Update({
                            //     orderId:item.orderId,
                            //     updateStatus: "new",
                            //     status: item.status,
                            //     driverModel: {
                            //         driverId: "d001"   
                            //     }
                            // }).then((data) => {
                            //     this.getData()
                            // });
                        }}

                        style={{
                            width: width,
                            flex: 0, height: 25,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <Text
                                style={{
                                    fontSize: 20, fontWeight: "bold", color: "#000000",
                                    width: 80,
                                    textAlign: "center"
                                }}>Cancel</Text>
                            <Text style={{ fontSize: 15, fontFamily: 'iconfont', paddingTop: 5 }}>&#xe625;</Text>
                        </View>
                    </TouchableHighlight>


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
                            {windex+index + 1} to {length}
                        </Text>
                        <Text style={{
                            color: "#f0695a",
                            fontFamily: 'iconfont'
                        }}>
                            &#xe62d;
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    async componentDidMount() {

        this.getData();
    }


    backScoll() {
        // this.setState({
        //     newOtherOrderData:{
        //         data: null
        //     }
        // })
        let mainData = this.oData;

        let windex = (this.state.windex-1)*5;

        let data =  this.oData.length/5;
        if(data<1) return false;
        let dataL = parseInt(data);
        if(data>dataL) dataL = dataL+1;

        let sw = this.state.windex-1;

        if(sw==0) return false;
        if(sw<dataL) {
            let cData = [mainData[windex-5],mainData[windex-4],mainData[windex-3],mainData[windex-2],mainData[windex-1]];

            this.setState({
                newOtherOrderData:{
                    data: cData
                },
                windex: this.state.windex-1
            })
        }
    }

    goScoll() {
        // let mainData = this.state.newOtherOrderData.data;
        let mainData = this.oData;

        let windex = (this.state.windex+1)*5;

        let data = this.oData.length/5;

        // let data = this.state.newOtherOrderData.data.length/5;
        let dataL = parseInt(data);

        if(data>dataL) dataL = dataL+1;

        let sw = this.state.windex+1;
        if(sw<dataL) {
            let cData = [];
            if(data>dataL) {
                // let Data1 = null,Data2= null,Data3= null,Data4= null,Data5= null

                cData = [];
                if(mainData[windex+1]) cData[0]=mainData[windex+1];

                if(mainData[windex+2]) cData[1]=mainData[windex+2];

                if(mainData[windex+3]) cData[2]=mainData[windex+3];

                if(mainData[windex+4]) cData[3]=mainData[windex+4];

                if(mainData[windex+5]) cData[4]=mainData[windex+5];



            } else {
                cData = [mainData[windex+1],mainData[windex+2],mainData[windex+3],mainData[windex+4],mainData[windex+5]];

            }

            this.setState({
                newOtherOrderData:{
                    data: cData
                },
                windex: this.state.windex+1
            })
        }
    }


    // backScoll() {
    //     let mainData = this.oData;

    //     let windex = this.state.windex;

    //     let sw = this.state.windex;

    //     this.s = sw;
    //     if(sw-1 < 0) return false;

    //     let cData = [mainData[windex-1]];
    //         this.setState({
    //             newOtherOrderData:{
    //                 data: cData
    //             },
    //             windex: this.state.windex-1
    //         })

    // }

    // goScoll() {
    //     let mainData = this.oData;

    //     let windex = this.state.windex+1;

    //     let data = this.oData.length;

    //     let sw = this.state.windex;

    //     this.s = sw;
    //     if(sw<data) {
    //         let cData = [mainData[windex]];

    //         this.setState({
    //             newOtherOrderData:{
    //                 data: cData
    //             },
    //             windex: windex
    //         })
    //     }
    // }


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
        // alert(JSON.stringify(this.props));

        return (
            <View style={{width:width,height:height-170,
                marginTop:  Platform.OS === 'ios' ? -5 :0}}>
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
                    this.state.newOtherOrderData ?
                        <View style={styles.scroll}>
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
                                        onLayout={() => {
                                            if(this.state.back){
                                                this.refs._scrollView.scrollTo({ x: initialOffset.x });
                                            }
                                            setTimeout(()=>this.setState({
                                                spinner: false                                                    
                                            }), 500);
                                            
                                        }}
                                        
                                        onScrollEndDrag={(event) => {
                                            if (event.nativeEvent.contentOffset.x == 0 && this.state.sid!=0 ) {
                                                this.setState({
                                                    sid: this.state.sid-1,
                                                    back: this.state.sid,
                                                    spinner: true
                                                });
                                            }

                                            if (parseInt(event.nativeEvent.contentOffset.x) == parseInt(max) && this.state.sid<DataSize-1) {
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
                                                &&data!=null ?  this._rederOtherData(data, index,this.oData.length, _this):null)}
                                        {/* {this.state.newOrderData.data.map((data, index) => 
                                            this._rederData(data, index, _this))} */}
                                    </ScrollView>:null
                                )
                            }
                            <TouchableHighlight>
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
                                            title={"Collected"}
                                        >
                                        </LineBtn>
                                    </View>
                                </TouchableHighlight>
                            {/* <Animated.ScrollView
                                horizontal
                                keyboardShouldPersistTaps="handled"
                                bounces={true}
                                alwaysBounceHorizontal={true}
                                scrollsToTop={true}
                                showsHorizontalScrollIndicator={false}
                                automaticallyAdjustContentInsets={false}
                                // canCancelContentTouches={true}
                                // overScrollMode="never"
                                scrollTo={{x:0,y:0}}
                                pagingEnabled={true}
                                contentOffset={initialOffset}
                                // onScroll={this.handleScroll.bind(this)}
                                // refreshControl={data=>alert(data)}
                                removeClippedSubviews
                                alwaysBounce={true}
                                bouncesZoom={true}
                                ref='_scrollView'
                                onScrollEndDrag={(event) => {
                                   
                                    if(event.nativeEvent.velocity.x >= 0 )this.backScoll();
                                    if(event.nativeEvent.velocity.x < 0 ){
                                        this.goScoll();
                                    }
                                }}
                            >
                                {this.state.newOtherOrderData.data.map((data, index) => 
                                       index < 1&&data!=null ? this._rederOtherData(data, index,this.oData.length):null)}
                                // {/* {this.state.newOtherOrderData.data.map((data, index) => 
                                //     this._rederOtherData(data, index,this.state.newOtherOrderData.data.length))} 
                            </Animated.ScrollView> */}
                        </View> : null
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

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Animated,
    ScrollView,
    TouchableNativeFeedback,
    Linking,
    Alert,
    DeviceEventEmitter,
    InteractionManager,
    NativeModules,
    PanResponder,TouchableOpacity,
    Platform
} from 'react-native';

import moment from 'moment';
const { width, height } = Dimensions.get('window');
import AppStyles from "./style";

import Svg from "../../../icons/icons";

import { OrderQuery, Update, startShift, newOrderCount } from "../../api";

import LineBtn from "../lineBtn";


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

        this.listingData = false;
        this.count = 1;
        this.Vdata = 0;
        this.state = {
            index: 0,
            viewIndex: 0,
            orderSize: 1,
            notif: null,
            payload: null,
            newOrderData: null,
            showOrders: false,
            windex: 1,
            visibility: new Animated.Value(initialVisibility),
            scrollAmount: new Animated.Value(0),
            initialOffset,
            isVisible: false,
            item: null,
            listingData: null,
            loadingData: "",
            s: "",
            e: "",
            sid:0,
            leftData:true,
            back: false,
            scrollEnabled:true,
            spinner: false,
            scrollViewScrollDirection: "",
            // pageNum:""
        }
        this.oData = null;
        this.pageNum = 0;
        this._panResponder = null;
        this.scrollViewStartOffsetX = 0
    }

    componentWillMount() {

        this._panResponder = PanResponder.create({
            // onStartShouldSetPanResponder: () => true,

            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onResponderTerminationRequest: ($e,$gs)=>true,

            // onStartShouldSetPanResponderCapture: ()=> true
        })
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

    startShift() {
        var a = moment().format('HH:mm:ss')
        var d = new Date();
        global.showOrders = true;
        global.storage.save({
            key: 'showOrders',
            data: true,
            expires: null
        });
        global.storage.save({
            key: 'showOrdersTime',
            data: a,
            expires: null
        });
        let _this = this;
        startShift({
            status: "onCurrent",
            driverId: global.dm.driverId
        }).then((otherData) => {
            _this.getData();
        })
    }

    getData() {
        let s = new Date().getTime();
        let e = 0;
        global.storage.load({
            key: 'location'
        }).then(locations => {
            OrderQuery({
                status: 'new', type: 'current',
                shopModel: { 
                    shopId: global.storeInfo.shopId
                },
                driverModel: {
                    latitude: locations.latitude,
                    longitude: locations.longitude,
                    name: global.dm.name,
                    driverId: global.dm.driverId
                }
            }).then((data) => {
                this.oData = data.data;
                e = new Date().getTime();
                this.setState({
                    s: s,
                    e: e
                })

                global.storage.load({
                    key: 'ShiftOhters'
                }).then(ret => {
                    // console.log(ret.userid);
                    if (ret) {

                        OrderQuery({
                            status: "new",
                            type: "current",
                            shopModel: { shopId: global.storeInfo.shopId},
                            driverModel: {
                                latitude: locations.latitude,
                                longitude: locations.longitude,
                                name: global.dm.name,
                                driverId: global.dm.driverId,
                                allowDistance:"20"
                            }
                        }).then((otherData) => {
                            newOrderCount({
                                status: "new",
                                type: "others",
                                driverModel: {
                                    latitude: locations.latitude,
                                    longitude: locations.longitude,
                                    driverId: global.dm.driverId,
                                    allowDistance:"20"
                                },
                                shopModel: { shopId: global.storeInfo.shopId}
                            }).then((otherData) => {
                                // alert(JSON.stringify(otherData));
                                this.props.onRightNumber(otherData.data.length);
                            })
                            
                            if(data.data!=null) {
                                this.props.onTitleNumber(data.data.length);
                            }
                            if(otherData.data!=null) {
                                this.props.onRightNumber(otherData.data.length);
                            }
                        })
                    } else {
                        this.props.onTitleNumber(data.data.length);
                    }
                }).catch((err) => {
                    this.props.onTitleNumber(data.data.length);
                });


                global.storage.save({
                    key: 'showOrders',
                    data: true,
                    expires: null
                });

                this.setState({
                    newOrderData: data,
                    loadingData: "loaded",
                    orderSize: data.data.length
                })
            });
        }
            , error => {

            }
        );
        this.setState({
            showOrders: true
        })
    }

    componentDidMount() {

        // this.setState({
        //     spinner: true
        // })
        
        if(Platform.OS === "android") {
            // this.refs._scrollView.scrollTo({x: 1440,y:1440, animated: false});
            NativeModules.ToastExample.show("asd", 0, (data) => {
                data = JSON.parse(data);
                global.storage.save({
                    key: 'location',
                    data: data,
                    expires: null
                });
            });
        }else {
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

        InteractionManager.runAfterInteractions(() => {
            // this.setState({showOrders: false});
        });

        global.storage.load({
            key: 'showOrders'
        }).then(ret => {
            if (!this.state.showOrders && ret == true) {
                this.setState({
                    showOrders: ret
                })
                setTimeout(() => {
                    this.getData();
                }, 20);
            }
        }).catch((err) => {
            if(global.showOrders) this.getData();
        });
    }

    showDailog(item, _this) {
        _this.setState({
            scrollEnabled: true,
            item: item
        })

        let info = "";
        //  !item.orderPaidStatus ? "Did you pay sotre.  "+item.driverPaid:"";

        if (!item.orderPaidStatus) info = "Did you pay store €" + item.driverPaid;
        if (!item.orderPaidStatus) info = "Did the store pay you €" + item.storePaid;
        Alert.alert('', 'Did you collect all delivery items? \n ' + info,
            [
                {
                    text: "Yes", onPress: () => {
                        this.updateData(item, _this, "Yes");
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
    updateData(item, _this, type) {
        Update({
            orderId: item.orderId,
            updateStatus: "collected",
            status: "new",
            type: 'current',
            driverModel: {
                driverId: global.dm.driverId
            }
        }).then((data) => {
            DeviceEventEmitter.emit('dirver', {
                dirver: 1
            });
            this.props.addDirverNumber(1);
            _this.getData()
        });
    }

    returnData(data) {
        this.Vdata = data;
        this.setState({ viewIndex: data });
    }

    // handleScroll: function(event: Object) {
    //     console.log(event.nativeEvent.contentOffset.y);
    //    },
    handleScroll(event) {
        // alert(JSON.stringify(event.nativeEvent));
    }

    setCE(data,_this) {

        // _this.setState({ scrollEnabled: false });
        
    }

    _rederData = (item, index, _this) => {
        let swi = width / 2 - 8;
        let windex = (this.state.windex-1)*5;
        return <View key={index} style={[AppStyles.mainTabContainer, {
            width: width
        }]}>
            <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='never'
                showsVerticalScrollIndicator={true}
                scrollEnabled={this.state.scrollEnabled}
                pagingEnabled={true}
                horizontal={false}
                style={{
                    height: height - 300,
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                <View style={{ height: 10 }}>
                </View>
                <View style={AppStyles.middleButton}>
                    <View style={{
                        flex: 1, flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: width
                    }}>
                        <View style={[AppStyles.middleButtonLeft,
                         { width: width / 2 - 8 }, AppStyles.middleButton,
                         { 
                            height: (width / 2 - 8) * 0.42,
                            borderLeftWidth: 4 
                         }]}>
                            <TouchableHighlight
                                onPress={() => {
                                    var path = {
                                        pathname: '/Chat',
                                        state: {
                                            returnData: _this.returnData.bind(_this),
                                            index: index + 1,
                                            destination: {
                                                latitude: item.latitude,
                                                longitude: item.longitude
                                            },
                                            data: item
                                        }
                                    }
                                    this.props.history.push(path);
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row', justifyContent: "space-between", borderWidth: 2,
                                    borderColor: "#ff544f", height: (width / 2 - 8) * 0.42, paddingLeft: 5, 
                                    fontWeight: "bold"
                                }}>
                                    <View>
                                        <Text style={styles.activeFont}>Route to</Text>
                                        <Text style={styles.activeFont}>Customer</Text>
                                    </View>
                                    <View style={[{
                                        borderRadius: 45,
                                        backgroundColor: "#ff544f",
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
                        <View style={[AppStyles.middleButtonRight, {
                            width: width / 2 - 8,
                            flexDirection: 'row', justifyContent: "space-between"
                        },
                        AppStyles.middleButton,
                        {
                            marginLeft: 4
                            // borderLeftWidth: 4,
                            // borderLeftColor: "#ffffff",
                        }
                        ]}>
                            <View
                                style={{width:swi*.6}}
                            >
                                <Text style={styles.activeFont}>Pick Up </Text>
                                <Text style={[styles.activeFont, { fontSize: 15 }]}>In
                                    {" "}
                                    {
                                        (item.pickUpEnd - item.pickUpStart) / 60000
                                    }
                                    {" "} Mins
                                </Text>
                            </View>
                            <View style={[{
                                backgroundColor: "#f0695a", padding: 5,
                                width: swi * .35
                            }, AppStyles.middleButton, styles.center]}>
                                <TouchableHighlight
                                    onPress={() => { Linking.openURL(`tel:` + item.phone) }}
                                    style={{ backgroundColor: "#f0695a",
                                    borderRadius: 45 }}
                                >
                                    <Text style={[{
                                        borderRadius: 35,
                                        borderColor: "#f0695a",
                                        borderWidth: 1,
                                        overflow: 'hidden',
                                        width: 45,
                                        height: 45,
                                        fontSize: 45,
                                        padding: 0,
                                        backgroundColor: "#ffffff",
                                        color: '#f0695a',
                                        fontFamily: 'iconfont'
                                    }]}>&#xe60a;</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: "center", flexDirection: 'row', marginTop: 15 }}>
                    <Text style={[styles.iconStyle, { color: "#ff544f" }]}>&#xe604;</Text>
                    <View style={{ paddingLeft: 5 }}>
                        <Text style={{ width: width * .85 }}>
                            {item.address}
                        </Text>
                    </View>
                </View>
                <View style={{ width: width - 16, margin: 8, height: 1, backgroundColor: "#f7f7f7" }}></View>
                <View style={{
                    flex: 1, flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width - 16, margin: 8, height: 50, paddingLeft: 15, paddingRight: 15
                }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.orderId}</Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.time} Mins ({item.distance} KM)</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#ff544f" }}>€{item.deliverFee.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
            

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
                    {/* {index + 1} to {this.state.orderSize} */}
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
        // alert(dataL);
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
                this.pageNum= 0
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


        var _this = this;
        let param = null
        const { state } = this.props.location;
        if (state) param = state;

        let max = width * 4;


        let pageData = [];
        let DataSize = 0
        if(this.state.newOrderData&&this.state.newOrderData.data) {
            DataSize = this.state.newOrderData.data.length/5;
            for(let i = 0; i < DataSize;i++){
                pageData.push({
                    index:i
                })
            }
        }

        if(this.state.back){
            initialOffset.x=max
        }

        return (<View style={{ width: width, height: height - 170,position:"relative" }}>
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
                this.state.showOrders ? (
                    this.state.newOrderData ?
                        <View style={styles.scroll}>
                            <View>
                                {
                                    pageData.map((data, index) => 
                                    data.index == this.state.sid ? 
                                        <ScrollView
                                            nestedScrollEnabled = {true}
                                                // pointerEvents={"box-none"}
                                            // {...this._panResponder.panHandlers}
                                            disableScrollViewPanResponder={true}
                                            horizontal
                                            keyboardShouldPersistTaps="handled"
                                            bounces={true}
                                            alwaysBounceHorizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            automaticallyAdjustContentInsets={false}
                                            scrollTo={{ x: Platform.OS === 'ios' ? 0: 1000, y: 0 }}
                                            pagingEnabled={true}
                                            contentOffset={{x: Platform.OS === 'ios' ? 0: 1000,y:0}}
                                            // removeClippedSubviews
                                            enableScroll={true}

                                            scrollEnabled={this.state.scrollEnabled}
                                            alwaysBounce={true}
                                            bouncesZoom={true}
                                            ref='_scrollView'
                                            onLayout={() => {
                                                if(this.state.back){
                                                    this.refs._scrollView.scrollTo({ x: initialOffset.x });
                                                }
                                                setTimeout(()=>this.setState({
                                                    spinner: false     
                                                }), 300);
                                            }}
                                            // scrollEventThrottle={12}
                                            onMomentumScrollEnd = {(event)=>{{
                                                const offsetX = event.nativeEvent.contentOffset.x;
                                                // this.scrollViewStartOffsetX
                                                // alert(event.nativeEvent.contentOff set.x+", max:"+max+", scrollViewStartOffsetX:"+this.scrollViewStartOffsetX);
                                                if (this.scrollViewStartOffsetX > offsetX&&this.scrollViewStartOffsetX<max) {
                                                    //手势往下滑动，ScrollView组件往上滚动
                                                    //console.log('手势往下滑动，ScrollView组件往上滚动');
                                                    this.scrollViewScrollDirection = 0;
                                                    this.setState({
                                                        scrollViewScrollDirection: "up"
                                                    });
                                                } else if (this.scrollViewStartOffsetX < offsetX&&this.scrollViewStartOffsetX<max&&this.state.scrollViewScrollDirection!=4) {
                                                    //手势往上滑动，ScrollView组件往下滚动
                                                    //console.log('手势往上滑动，ScrollView组件往下滚动');
                                                    this.scrollViewScrollDirection = 1;
                                                    this.setState({
                                                        scrollViewScrollDirection: "down"
                                                        // this.state.scrollViewScrollDirection+1
                                                    });
                                                }
                                            }}}

                                            onScrollEndDrag={(event) => {
                                                this.scrollViewStartOffsetX = event.nativeEvent.contentOffset.x;
                                                if (event.nativeEvent.contentOffset.x <= 0 && this.state.sid!=0 ) {
                                                    this.setState({
                                                        sid: this.state.sid-1,
                                                        back: this.state.sid,
                                                        spinner: true
                                                    });
                                                    this.pageNum=4;

                                                    this.scrollViewStartOffsetX = 1500
                                                }
                                                
                                                // let x = parseInt(event.nativeEvent.contentOffset.x);
                                                // let ss = "max2:"+parseInt(max)+"-x:"+parseInt(x);
                                                // alert(ss);
                                                if (parseInt(event.nativeEvent.contentOffset.x) >= parseInt(max) && this.state.sid<DataSize-1) {
                                                    this.setState({
                                                        sid: this.state.sid+1,
                                                        back: false,
                                                        spinner: true
                                                    });
                                                    this.scrollViewStartOffsetX = -1
                                                    this.pageNum=0;
                                                }
                                            }}
                                        >
                                            
                                            {this.state.newOrderData&&this.state.newOrderData.data?this.state.newOrderData.data.map((data, index) => 
                                                 index >= this.state.sid*5 && index < (this.state.sid+1)*5
                                                 &&data!=null ?  this._rederData(data, index, _this):null):""}
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
                                        <LineBtn item={this.state.newOrderData.data[this.pageNum+(this.state.sid*5)]} 
                                            width={width * .7} setCE={(data)=>{
                                                // this.setCE(data, _this)
                                            }} showDailog={(item) => {
                                                this.showDailog(item, _this);
                                            }}
                                        >
                                        </LineBtn>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View> : null
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

                                    <LineBtn item={{}} width={width - 16} setCE={()=>{}} title={"Start Shift"} showDailog={(item) => {
                                        this.startShift();
                                    }}>
                                    </LineBtn>

                                </View>

                            </View>
                        </View>
                    )
            }
        </View>
        )
    }
}
const styles = StyleSheet.create({
    iconStyle: {
        color: '#ffffff',
        fontFamily: 'iconfont',
        fontSize: 20
    },
    scroll: {
        overflow: 'scroll'
    },
    activeFont: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000"
    },
    center: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    }
})
// export default StackNavigator({
//     Main: {screen: ChinaTown}
//   });
export default ChinaTown;

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
    ListView,
    ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');
import AppStyles from "./style";
import Svg from "../../../icons/icons";

import EndBtn from "../endBtn";

import { OrderQuery, DailySum,Update,
    endShiftCurrent,easyDishDelivered } from "../../api";


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

        this.state = {
            newOtherOrderData: null,
            showOrders: false,
            totalData: null,
            showOrdersTime: null
        }
    }

    onPressLearnMore() {

    }

    getData() {
        // let token = global.storage.load({
        //     key: 'token'
        // })
        global.storage.load({
            key: 'location'
        }).then(locations => {
            OrderQuery({
                status: "delivered",
                shopModel: { shopId: global.storeInfo.shopId  },
                driverModel: {
                    latitude: locations.latitude,
                    longitude: locations.longitude,
                    name: global.dm.name,
                    driverId: global.dm.driverId
                },
                type: "current"
            }).then((data) => {
                // alert("333"+JSON.stringify(data))

                this.props.onTitleNumber(data.data.length);
                easyDishDelivered({
                    type: "others",
                    status: "delivered",
                    shopModel: { shopId: global.storeInfo.shopId },
                    driverModel: {
                        name: global.dm.name,
                        driverId: global.dm.driverId,
                    }
                }).then((otherData) => {
                    
                        // alert("222"+JSON.stringify(otherData));
                    DailySum({
                        shopId: global.storeInfo.shopId,
                        driverId: global.dm.driverId,
                        type: "current",
                    }).then((data) => {
                        // alert(JSON.stringify(data))
                        this.setState({
                            totalData: data.data
                        })
                    });
                    if(otherData.data)
                    this.props.onRightNumber(otherData.data.length);
                });
                this.setState({
                    newOtherOrderData: data.data,
                    orderSize: data.data.length
                })
            });
        })
        


        this.setState({
            showOrders: true
        })
    }


    _renderRow = (item) => {

        let orderTimeArr = item.deliveredTime? item.deliveredTime.split(","):false;
        let orderTime = "";
        let orderDate = "";
        try {    
            if(orderTimeArr) {
                orderTime = orderTimeArr[0];
                orderDate = orderTimeArr[1];
            }
        } catch (error) {
            
        }

        return (
            <View style={[AppStyles.middleButton, {
                flexDirection: 'row',
                width: width - 4, height: 140,
                justifyContent: 'space-between',
                marginLeft: 2,
                marginRight: 2,
                marginBottom: 10,
                backgroundColor: '#ffffff',
                justifyContent: "center"
            }]}>
                <View style={{
                    justifyContent: "flex-start",
                    width: (width - 16) * .6,
                    height: 100,
                    backgroundColor: '#ffffff'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width: width * .5,
                        justifyContent: 'space-between',
                        padding: 10
                    }}>
                        <View
                            style={{
                                borderRightWidth: 1,
                                paddingRight:5,
                                borderColor:"#d6d8d8"
                            }}
                        >
                            <Text
                            numberOfLines={2} 
                            style={{
                                color: "#000000",
                                fontSize: 16,
                                fontWeight: "bold",
                                width: 80
                            }}>{item.orderId}</Text>
                            <Text>{item.distance} KM</Text>
                        </View>
                        <View 
                            style={{
                                paddingLeft:5
                            }}
                        >
                            <Text style={{
                                color: "#000000",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>{orderTime}</Text>
                            <Text>{orderDate}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderTopWidth:1,
                            borderColor:"#d6d8d8"
                        }}
                    >
                        <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                            <Text>
                                Driving Time:
                                <Text>{item.time} Mins</Text>
                            </Text>
                            <Text>{item.address}</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: (width - 16) * .4,
                    height: 120,
                    backgroundColor: item.orderPaidStatus||item.driverPaidStatus?'#f0695a':"#62a55d",
                    padding: 10
                }}>
                    <View
                        style={{
                            paddingLeft:5,
                            borderRightWidth: 1,
                            borderColor: "#ffffff",
                            width: (width - 16) * .2 - 8,
                            padding: 4
                        }}
                    >
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#ffffff",
                            height: 70,
                            paddingTop: 20
                        }}>
                            <Text>
                                {
                                    item.orderPaidStatus||item.driverPaidStatus ? "Paid" : "Due"
                                }
                            </Text>
                            <Text>
                                {
                                    !item.orderPaidStatus&&!item.driverPaidStatus ? item.driverPaid : ""
                                }
                            </Text>
                        </Text>
                    </View>
                    <View style={{ 
                        textAlign: "right",
                        width: (width - 16) * .2 - 8,
                        padding: 4
                    }}>
                        <Text style={{
                            fontSize: 16, textAlign: "right",
                            color: "#ffffff"
                        }}>{item.driverPaid}</Text>
                        <Text style={{
                            fontSize: 16, textAlign: "right",
                            color: "#ffffff"
                        }}>{item.deliverFee}</Text>
                        <Text style={{
                            borderTopWidth:1,
                            fontSize: 16, textAlign: "right",
                            color: "#ffffff",
                            borderColor: "#ffffff"
                        }}>€{item.price}</Text>
                    </View>
                </View>
            </View>
        )
    }


    endShift(item, _this) {

        global.storage.save({
            key: 'showOrders',
            data: false,
            expires: null
        });

        endShiftCurrent({
            status: "offline",
            updateStatus:"finished",
            driverId: global.dm.driverId
        }).then((data) => {
            // alert("111"+JSON.stringify(data));
            _this.getData()
        })
    }
    componentDidMount() {
        global.storage.load({
            key: 'showOrdersTime'
        }).then(data => {
            this.setState({
                showOrdersTime: data
            })
        })
        this.getData();
    }

    
    /**
     * @render
     * @returns {*}
     */
    render() {

        let contentHeight = height-650;
        let mainHeight = height-400;
        let _this = this;

        var ds = new Date();
        
        return (<View style={[{ width: width, 
            height:height-170,
            backgroundColor: "#d8d9da" }]}>
            {/* <Text>
                {
                    JSON.stringify(this.state.newOtherOrderData)
                }
            </Text> */}

            {
                this.state.newOtherOrderData && this.state.newOtherOrderData.length>0 ? (
                    <ScrollView style={{ height: contentHeight,minHeight: mainHeight}}>
                        {/* <ListView
                            dataSource={this.state.newOtherOrderData}
                            renderRow={this._renderRow}
                        /> */}

                        {JSON.parse(JSON.stringify(this.state.newOtherOrderData)).map((data,index) =>
                            this._renderRow(data,index))}
                    </ScrollView>
                ) : null
            }
            {this.state.totalData?(
            <View style={{
                width: width,
                height:150,
                // top: 240,
                // position: 'absolute',
                zIndex: 1,
                marginLeft: 8,
                marginTop: 4,
                marginRight: 8,
                paddingRight: 4,
                backgroundColor:"#ffffff",
                justifyContent:"center"
            }}
            >
                <View
                    style={{
                        width: width - 16,
                        backgroundColor:"#ffffff",
                        paddingLeft:8
                    }}
                >
                    <Text style={{
                        fontSize: 16,
                        textAlign: "left",
                        fontWeight: "bold",
                        color: "#000000"
                    }}>Total</Text>
                </View>
                <View style={{
                    textAlign: "center", 
                    width: width - 16,
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor:"#ffffff",
                    justifyContent:"center"
                }}>
                    <View style={{ borderRightWidth: 1, borderRightColor: "#aeaeae" }}>
                        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: "flex-end" }}>
                            <Text style={{
                                fontSize: 16, textAlign: "right",
                                fontWeight: "bold",
                                color: "#000000"
                            }}>Order Cost</Text>
                            <Text style={{
                                fontSize: 16,
                                color: "#000000"
                            }}>(Excl.Delivery):</Text>
                            <Text style={{
                                fontSize: 16,
                                color: "#000000"
                            }}>€{this.state.totalData.orderCost}</Text>
                        </View>
                        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: "flex-end" }}>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                fontWeight: "bold",
                                color: "#000000"
                            }}>Delivery Charge:</Text>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                color: "#000000"
                            }}>€{this.state.totalData.deliveryCharge}</Text>
                        </View>
                        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row',
                            justifyContent: "flex-end" }}>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                fontWeight: "bold",
                                color: "#000000"
                            }}>Due:</Text>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                color: "#000000"
                            }}>€{this.state.totalData.due}</Text>
                        </View>
                    </View>
                    <View style={{}}>
                        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row',
                            justifyContent: "flex-start" }}>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                fontWeight: "bold",
                                color: "#aeaeae"
                            }}>QTY:</Text>
                            <Text style={{
                                fontSize: 16,
                                color: "#aeaeae"
                            }}>{this.state.totalData.driverPaidCount}</Text>
                        </View>
                        <View style={{ paddingLeft: 5, paddingRight: 5, height: 20, flexDirection: 'row', justifyContent: "flex-end" }}>

                        </View>
                        <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent:  "flex-start" }}>
                            <Text style={{
                                fontSize: 16, textAlign: "left",
                                fontWeight: "bold",
                                color: "#aeaeae"
                            }}>QTY:</Text>
                            <Text style={{
                                fontSize: 16,
                                color: "#aeaeae", textAlign: "left",
                            }}>{this.state.totalData.storePaidCount}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 5}}></View>
            </View>):null}
            <View style={{
                    flexDirection: 'row',
                    justifyContent: "flex-start",
                    // bottom: 10,
                    // position: 'absolute',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width:width * .5,
                        justifyContent:"center"
                    }}>
                        <EndBtn item={{}} width={width*.45} fontSize={18} title={"End Shift"} showDailog={(item)=>{
                            this.endShift(item, _this);
                        }}>
                        </EndBtn>
                    </View>
                    {/* <View style={{
                        width: width * .5, flexDirection: 'row',
                        backgroundColor: "#f0695a",
                        borderRadius: 50
                    }}
                        // onPress={() => { this.props.navigation.push('Chat') }}
                    >

                        <Svg key={`key-1`} icon={"redslider-arrow-144x144"}
                            fill="#000000"
                            style={{ width: 50, height: 50 }}
                        />

                        {/* <View style={{backgroundColor:"#ffffff",borderRadius:50}}>
                                <Text style={[{fontSize:50,color:"#f0695a",
                                    fontFamily:'iconfont'}]}>&#xe603;</Text>
                            </View> */}
                        {/* <View>
                            <TouchableHighlight
                                onPress={() => { this.props.navigation.push('Chat') }}
                                style={{
                                    flex: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{
                                    fontSize: 23, fontWeight: "bold",
                                    paddingTop: 10,
                                    paddingLeft: 5,
                                    color: "#FFFFFF"
                                }}>End Shift</Text>
                            </TouchableHighlight>
                        </View>*/}
                    {/* </View>   */}
                    <View style={{ paddingLeft: 20 }}>
                        <View style={{ backgroundColor: "#f5f5f5", padding: 5, paddingLeft: 10, paddingRight: 10 }}>
                            <View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "#000000"
                                }}>Shift Started </Text>
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "#000000"
                                }}>
                                {/* {this.state.showOrdersTime} */}
                                    {this.state.showOrdersTime ? this.state.showOrdersTime:""}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
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

export default ChinaTown;
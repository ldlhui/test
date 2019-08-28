
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

import { OrderQuery, Update, endShift, easyDishDelivered, DailySum } from "../../api";


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
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([{ a: "asd" }, { a: "asd" }, { a: "asd" }]),
            showOrdersTime: null,
            newOtherOrderData: null,
            totalData: null
        }
    }

    onPressLearnMore() {

    }

    componentDidMount() {
        this.getData();
        global.storage.load({
            key: 'ShiftOhtersTime'
        }).then(data => {
            this.setState({
                showOrdersTime: data
            })
        })
    }


    getData() {

        // alert("1");
        // let token = global.storage.load({
        //     key: 'token'
        // })
        easyDishDelivered({
            type: "others",
            status: "delivered",
            // shopModel: { shopId: "t001"},
            shopModel: { shopId: global.storeInfo.shopId },
            driverModel: {
                // name: "asd",
                name: global.dm.name,
                // driverId: "0834355300"
                driverId: global.dm.driverId
            }
        }).then((data) => {
            // alert(JSON.stringify(data));
            DailySum({
                shopId: global.storeInfo.shopId,
                driverId: global.dm.driverId,
                type: "others",
            }).then((data) => {
                // alert(JSON.stringify(data))
                this.setState({
                    totalData: data.data
                })
            });
            this.props.onRightNumber(data.data.length);
            this.setState({
                newOtherOrderData: data.data,
                orderSize: data.data.length
            })
        });

        // DailySum({
        //     shopId: "jb00001",
        //     driverId: "0001",
        //     type: "current",
        // }).then((data) => {
        //     // alert(JSON.stringify(data))
        //     this.setState({
        //         totalData: data.data
        //     })
        // });

        this.setState({
            showOrders: true
        })
    }

    endShift() {

        global.storage.save({
            key: 'ShiftOhters',
            data: false,
            expires: null
        });

        endShiftOthers({
            status: "offline",
            updateStatus: "finished",
            driverId: global.dm.driverId
        }).then((otherData) => {
            // alert(JSON.stringify(otherData));

            this.getData()
        })

        // this.getData();
    }

    _renderRow = (rdata, index) => {

        return (
            <View>
                {
                    rdata.orderModels.map((data, index) => {

                        let rowData = data;
                        let orderTime = "";
                        let orderDate = "";
                        let orderTimeArr = "";

                        if (rowData.deliveredTime) {
                            orderTimeArr = rowData.deliveredTime.split(",");
                            if (orderTimeArr) {
                                orderTime = orderTimeArr[0];
                                orderDate = orderTimeArr[1];
                            }
                        }

                        return <View style={[AppStyles.middleButton, {
                            flexDirection: 'row',
                            width: width - 16, height: 120,
                            justifyContent: 'space-between',
                            marginLeft: 8,
                            marginRight: 8,
                            marginBottom: 8,
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
                                            paddingRight: 5,
                                            borderColor: "#d6d8d8"
                                        }}
                                    >
                                        <Text style={{
                                            color: "#000000",
                                            fontSize: 16,
                                            fontWeight: "bold"
                                        }}>{data.orderId}</Text>
                                        <Text>{data.distance} KM</Text>
                                    </View>
                                    <View >
                                        <Text style={{
                                            color: "#000000",
                                            fontSize: 16,
                                            fontWeight: "bold"
                                        }}>
                                            {orderTime}
                                        </Text>
                                        <Text>
                                            {orderDate} </Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                                        <Text>
                                            Driving Time:
                                            <Text> {rowData.time}  Mins</Text>
                                        </Text>
                                        <Text>{rowData.address}  </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: (width - 16) * .4,
                                height: 100,
                                backgroundColor: '#f0695a',
                                padding: 10
                            }}>
                                <View style={{ textAlign: "center" }}>
                                    <View style={{
                                        fontSize: 14, textAlign: "center",
                                        flexDirection: 'row', color: "#ffffff"
                                    }}>

                                        <Text style={{
                                            fontSize: 14, textAlign: "center", fontWeight: "bold",
                                            color: "#ffffff"
                                        }}>Driver paid:</Text>
                                        <Text style={{
                                            fontSize: 14, textAlign: "center",
                                            color: "#ffffff"
                                        }}>€{rowData.driverPaid ? rowData.driverPaid : ""} </Text>
                                    </View>

                                    <View style={{
                                        fontSize: 14, textAlign: "center", flexDirection: 'row',
                                        color: "#ffffff"
                                    }}>

                                        <Text style={{
                                            fontSize: 14, textAlign: "center", fontWeight: "bold",
                                            color: "#ffffff"
                                        }}>Delivery: </Text>
                                        <Text style={{
                                            fontSize: 14, textAlign: "center",
                                            color: "#ffffff"
                                        }}>€{rowData.deliverFee}</Text>
                                    </View>

                                    <View style={{
                                        fontSize: 14, textAlign: "center", flexDirection: 'row',
                                        color: "#ffffff"
                                    }}>

                                        <Text style={{
                                            fontSize: 14, textAlign: "center", fontWeight: "bold",
                                            color: "#ffffff"
                                        }}>Total Cost: </Text>
                                        <Text style={{
                                            fontSize: 14, textAlign: "center",
                                            color: "#ffffff"
                                        }}>€{rowData.price}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    })
                }
            </View>

        )
    }



    // endShift(item, _this) {

    //     global.storage.save({
    //         key: 'ShiftOhters',
    //         data: false,
    //         expires: null
    //     });

    //     endShift({
    //         status: "onOthers",
    //         driverId: global.dm.driverId,
    //         updateStatus:"finished"
    //     }).then((otherData) => {
    //         _this.getData()
    //     })
    // }
    /**
     * @render
     * @returns {*}
     */
    render() {
        let _this = this;
        var d = new Date();
        return (
            <View style={[
                // AppStyles.mainTabContainer, 
                { width: width, height: height - 170 }]}>
                {/* <View>
                    <Text>
                        {JSON.stringify(this.state.newOtherOrderData)}

                        {JSON.stringify(this.state.newOtherOrderData.length)}
                    </Text>
                </View> */}
                <ScrollView>
                    {
                        this.state.newOtherOrderData != null && this.state.newOtherOrderData.length > 0 ? this.state.newOtherOrderData.map((data, index) => {
                            return <View>
                                <View style={{ height: 45 }}>
                                    <View style={{
                                        flex: 1, flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        height: 45, width: width - 8
                                    }}
                                    >
                                        <View style={[{ width: width - 8 }, AppStyles.middleButton,
                                        { height: 45, backgroundColor: '#f0695a' }]}>
                                            <View style={{
                                                borderWidth: 2,
                                                borderColor: "#f0695a",
                                                height: 45,
                                                paddingLeft: 5,
                                                fontWeight: "bold",
                                                flexDirection: 'row',
                                                justifyContent: "space-between"
                                            }}>
                                                <View style={{ height: 35 }}>
                                                    <Text style={[styles.lineFont, { color: "#ffffff" }]}>{data.name}</Text>
                                                    <Text style={[styles.lineFont, { color: "#ffffff" }]}>{data.phone}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', height: 35 }}>
                                                    <Text style={[styles.lineFont, {
                                                        color: "#ffffff",
                                                        width: width * .5 - 10
                                                    }]}>{data.address}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this._renderRow(data, index)
                                }
                            </View>
                        }) : null
                    }

                    {this.state.totalData ? (
                        <View style={{
                            width: width,
                            height: 150,
                            // top: 240,
                            // position: 'absolute',
                            zIndex: 1,
                            marginLeft: 8,
                            marginTop: 4,
                            marginRight: 8,
                            paddingRight: 4,
                            backgroundColor: "#ffffff",
                            justifyContent: "center"
                        }}
                        >
                            <View
                                style={{
                                    width: width - 16,
                                    backgroundColor: "#ffffff",
                                    paddingLeft: 8
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
                                backgroundColor: "#ffffff",
                                justifyContent: "center"
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
                                    <View style={{
                                        paddingLeft: 5, paddingRight: 5, flexDirection: 'row',
                                        justifyContent: "flex-end"
                                    }}>
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
                                    <View style={{
                                        paddingLeft: 5, paddingRight: 5, flexDirection: 'row',
                                        justifyContent: "flex-start"
                                    }}>
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
                                    <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: "flex-start" }}>
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
                            <View style={{ height: 5 }}></View>
                        </View>) : null}
                </ScrollView>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: "flex-start",
                    padding: 5
                }}>
                    <View style={{
                        flexDirection: 'row',
                        width: width * .5,
                        justifyContent: "center"
                    }}>
                        <EndBtn item={{}} width={width * .45} fontSize={18} title={"End Shift"} showDailog={(item) => {
                            this.endShift(item, _this);
                        }}>
                        </EndBtn>
                    </View>
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
                                    {this.state.showOrdersTime ? this.state.showOrdersTime : ""}
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
// export default StackNavigator({
//     Main: {screen: ChinaTown}
//   });
export default ChinaTown;
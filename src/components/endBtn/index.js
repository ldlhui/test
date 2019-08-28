
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
    PanResponder
} from 'react-native';

const { width, height } = Dimensions.get('window');
import AppStyles from "../chinaTown/style";

import Svg from "../../../icons/icons";


import { OrderQuery, Update, startShift } from "../../api";
/**
 * @app
 */
class Index extends React.Component {

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

            visibility: new Animated.Value(initialVisibility),
            scrollAmount: new Animated.Value(0),
            initialOffset,
            isVisible: false,
            item: null,
            listingData: null,
            loadingData: "",
            s: "",
            e: "",
            left: 0,
            isTouch: false
        }

        this._left = 0;
        this._containerWidth = null;
        this._touchBlockInfo = null;

        // 滑动块剩余的空间
        this._touchSpace = null;

        // gs.dx的步进
        this._step = 0;
        this._panResponder = null;
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


    componentWillMount() {

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                //   this._top = this.state.top
                this._left = this.state.left
                //   this.setState({bg: 'red'})
            },
            onPanResponderMove: (evt, gs) => {
                //   console.log(gs.dx+' '+gs.dy)

                let w = this._left + gs.dx;
                let m = this.props.width;
                let pw = parseInt(w);
                //    alert(pw == pmw);
                let mw = m * .8
                let pmw = parseInt(mw);
                let mmw = parseInt(mw * .9);
                if (pw >= mmw) {
                    // alert(m);
                    // this.props.showDailog(this.props.item);
                    // this.setState({
                    //     // top: this._top+gs.dy,
                    //     left: 0
                    // })
                } else {
                    if (w > 0 && w <= mw) {
                        this.setState({
                            // top: this._top+gs.dy,
                            left: this._left + gs.dx,
                            pw: pw,
                            pmw: mmw
                        })
                    }
                }
                //   alert(this.props.item);


            },
            onPanResponderRelease: (evt, gs, item) => {
                let w = this._left + gs.dx;
                let m = this.props.width;
                let pw = parseInt(w);
                //    alert(pw == pmw);
                let mw = m * .8
                let pmw = parseInt(mw);
                let mmw = parseInt(mw * .9);
                if (pw >= mmw) {
                    // alert(m);
                    this.props.showDailog(this.props.item);
                    this.setState({
                        // top: this._top+gs.dy,
                        left: 0
                    })
                }
                // if(w>mw)alert(this.props.item);
                // this.setState({
                //     // bg: 'white',
                //     // top: this._top+gs.dy,
                //     left: this._left+gs.dx
                // })
            }
        })
    }

    /**
     * @render
     * @returns {*}
     */
    render() {

        var _this = this;
        let param = null
        // const { state } = this.props.location;
        // alert(JSON.stringify(state));
        // if(state) param = state;

        let item = "dd";
        // alert(JSON.stringify(this.state.viewIndex));
        return (<View style={{
            marginTop: 10, width: this.props.width, margin: 8, flexDirection: 'row',
            backgroundColor: "#f0695a",
            borderRadius: 50,
            position: "relative",
        }}

            elevation={1}
            onLayout={(e) => { this._touchBlockInfo = e.nativeEvent.layout }}
        >
            <View
                {...this._panResponder.panHandlers}
                style={[styles.rect, {
                    position: "absolute",
                    "backgroundColor": this.state.bg,
                    "top": this.state.top,
                    "left": this.state.left,
                    zIndex: 100,
                }]}
            >
                <Svg key={`key-1`} icon={"redslider-arrow-144x144"}
                    fill="#000000"
                    style={{ width: 50, height: 50 }}
                />
            </View>
            <TouchableHighlight
                // onPress={() => {
                // this.showDailog(item, _this);
                // }}
                style={{
                    width: this.props.width,
                    flex: 0, height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 20
                }}
            >
                <Text
                    style={{ fontSize: this.props.fontSize ? this.props.fontSize : 38, fontWeight: "bold", color: "#FFFFFF" }}>{this.props.title ? this.props.title : "Collect"}</Text>
            </TouchableHighlight>
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

export default Index;
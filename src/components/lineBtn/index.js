
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
    PanResponder,
    WebView
} from 'react-native';

const { width, height } = Dimensions.get('window');
import AppStyles from "../chinaTown/style";

import Svg from "../../../icons/icons";


import { OrderQuery, Update ,startShift } from "../../api";
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
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> true,
            // onMoveShouldSetResponderCapture: ()=> true,
            // onStartShouldSetPanResponderCapture: ()=> true,
            // onPanResponderTerminatinRequest: ($e,$gs)=>false,
            onPressIn:()=>{
              alert("1234")  
            },
            onPanResponderGrant: ()=>{
            //   this._top = this.state.top
            //   this.props.setCE(false);
              this._left = this.state.left
            //   this.setState({bg: 'red'})
            },
            onPanResponderMove: (evt,gs)=>{
            //   console.log(gs.dx+' '+gs.dy)
              
              let w = this._left+gs.dx;
              let m = this.props.width;
              let pw = parseInt(w);
            //    alert(pw == pmw);
              let mw = m*.8
              let pmw = parseInt(mw);
              let mmw = parseInt(mw*.9);
              if(pw>=mmw) {
                // alert(m);
                // this.props.showDailog(this.props.item);
                // this.setState({
                //     // top: this._top+gs.dy,
                //     left: 0
                // })
              }else{
                if(w>0&&w<=mw){
                    this.setState({
                        // top: this._top+gs.dy,
                        left: this._left+gs.dx,
                        pw:pw,
                        pmw:mmw
                    })
                  }
              }
            //   alert(this.props.item);
              

            },
            onPanResponderRelease: (evt,gs,item)=>{
                let w = this._left+gs.dx;
                let m = this.props.width;
                let pw = parseInt(w);
                //    alert(pw == pmw);
                // this.props.setCE(true);
                let mw = m*.8
                let pmw = parseInt(mw);
                let mmw = parseInt(mw*.9);
                if(pw>=mmw) {
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
        // return (
        //     <View 
        //         style={{
        //             width:width,
        //             height:100
        //         }}
        //     >
        //         <WebView
        //         style={{
        //             width: 300,
        //             height:100
        //         }}
        //         scrollEnabled={false} 
        //         javaScriptEnabled={true}  
        //         injectedJavaScript={'插入到h5页面中的js代码'}
        //         onMessage={event => {
        //             alert(event);
        //             this.props.showDailog(this.props.item);
        //         }}
        //         source={require('./lintbtn.html')}
        //     ></WebView> 
        //     </View>
        // );
      
        // alert(JSON.stringify(this.state.viewIndex));
        return (
            <TouchableHighlight
            onPressIn={()=>{
                    // alert("sd5")
                    // this.setState({
                    //     scrollEnabled: false
                    // })
                }}
                onLongPress={()=>{
                    // alert("6a6a6a6a")
                    // this.setState({
                    //     scrollEnabled: false
                    // })
                }}
                // onPressIn={()=>{
                //     this.props.setCE(false);
                // }}
                // onLongPress={()=>{
                //     this.props.setCE(false);
                // }}
                // style={{
                //     backgroundColor:"#000000"
                // }}
            >
                <View    
                    {...this._panResponder.panHandlers}
                    style={{
                        marginTop: 10, width: this.props.width, margin: 8, flexDirection: 'row',
                        backgroundColor: "#739e5e",
                        borderRadius: 50,
                        // position:"relative",
                        height: 50
                    }}

                    elevation={1}
                    onLayout={ (e) => {this._touchBlockInfo = e.nativeEvent.layout} }
                >

                    
                    <TouchableHighlight
                        
                        pointerEvents={"auto"}
                        style={[styles.rect,{
                            position:"absolute",
                            // "backgroundColor": "#ffffff",
                            "backgroundColor": this.state.bg,
                            "top": this.state.top,
                            "left": this.state.left,
                            zIndex: 1000,
                        }]}
                    >
                        <Svg key={`key-1`} icon={"greenslider-arrow-144x144"}
                            fill="#000000"
                            style={{ width: 50, height: 50 }} />
                    </TouchableHighlight>

                    <TouchableHighlight
                        // onPress={() => {
                            // this.showDailog(item, _this);
                        // }}

                        // onPressIn={()=>{
                        //     alert("5236236");
                        //     this.props.setCE(false);
                        // }}
                        onPress={()=>{
                            alert("aaaaaa");
                        }}
                        style={{
                            width: this.props.width,
                            flex: 0, height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft:20
                        }}
                    >
                        <Text
                            style={{ fontSize: 28, fontWeight: "bold", color: "#FFFFFF" }}>{this.props.title ? this.props.title :"Collect"}</Text>
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
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
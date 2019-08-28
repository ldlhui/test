
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    InteractionManager,
    TouchableHighlight,
    Button,
    Image
} from 'react-native';

import { connect } from 'react-redux'; // 引入connect函数
import { NavigationActions } from 'react-navigation';
import *as counterAction from '../../action/counterAction';

// import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import AppStyles from "../../../styles/AppStyles";
// import Uncollected from "../../components/uncollected";
// import Collected from "../../components/collected3b";

import MyTabBar from '../../unitl/MyTabBar';
import Svg from "../../../icons/icons";
var nativeImageSource = require('../../../icons/aaa.png');
// import Navtab from "../../unitl/navtab";
const { width, height } = Dimensions.get('window');
class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'Uncollected \n Orders' },
                { key: 'second', title: 'Current \n Delivery' },
            ],
            titleNumber: [0, 0],
            deliveredNumber: [0, 0],
            driverTitleNumber: [0, 0],
            newOtherOrderData: null,
            newRightOrderData: null,
            rightorderSize:0,
            orderSize:0,
            leftNumber: 0,
            rightNumber: 0,
            isFocused:true
        };
    }

    static navigationOptions = {    
        header: null
    };

    changeTab = data => {
        this.setState({
            isFocused:data
        })
    }


    setLeftNumber = data => {
        this.setState({
            leftNumber: data
        })
    }
    setRightNumber = data => {
        this.setState({
            rightNumber: data
        })
    }


    _renderTabBar = props => (
        <TabBar {...props} style={styles.tabbar}
            titleStyle={AppStyles.header}
            titleContent={"Accepted Orders"}
            titleNumber={props.titleNumber}
            NumberStyle={AppStyles.NumberStyle}
            scrollEnabled={false}
            onTabPress={(data) => { this.setState({ index: data }) }}
            labelStyle={styles.label} />
    );

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // this.setState({showOrders: false});
        });
    }

    logout() {
        this.props.navigation.dispatch(resetAction)
    }

    setTitleNumber = data => {
        // this.setState({
        //     driverTitleNumber: data
        // })
        global.storage.save({
            key: 'driverData',
            data: data,
            expires: null
        });
    }

    render() {

        global.driver = [this.state.leftNumber,this.state.rightNumber];
        return (<View style={{ width: width, height: height }}>
            <View style={{height:height-70,width: width}}>
                <View style={{height:80,marginTop:50,width: width,
                    flexDirection: 'row',justifyContent:"center",
                    textAlign:"center",
                    justifyContent:"center"
                }}>
                    {/* <Svg key={`key-1`} 
                        icon={"easydish-logo-558x176"} 
                        fill="#000000"
                    /> */}
                    <Image style={{
                        width: width*.6,
                        height: 80
                    }} source={nativeImageSource} />
                </View>
                <View style={{height:30}}>

                </View>
                <View style={{width:width,
                    flexDirection: 'row',
                    justifyContent: "center"
                }}>
                    <Text
                        style={{
                            fontFamily: "iconfont",
                            color: "#f0695a",
                            fontSize: 20
                        }}
                    >
                        &#xe61f;
                    </Text>

                    <Text
                        style={{
                            marginLeft: 5,
                            fontFamily: "iconfont",
                            color: "#000000",
                            fontSize: 20,
                            minWidth: 80
                        }}
                    >
                        {global.dm.name}
                    </Text>

                    <Text
                        style={{
                            marginLeft: 5,
                            fontFamily: "iconfont",
                            color:"#f0695a",
                            fontSize: 20
                        }}
                    >
                        &#xe608;
                    </Text>

                    <Text
                        style={{
                            marginLeft: 5,
                            fontFamily: "iconfont",
                            color: "#000000",
                            fontSize: 20
                        }}
                    >
                        {global.dm.phone}
                    </Text>

                </View>

                <View style={{
                    marginTop: 10,
                    marginLeft: 4,
                    width: width-8,
                    
                    height:150,
                    borderTopColor: "#f0695a",
                    borderTopWidth: 1,
                    borderLeftColor: "#ffffff",
                    borderLeftWidth: 4
                    // ,
                    // borderRightColor: "#ffffff",
                    // borderRightWidth: 4
                }}></View>


                <View style={{
                    width:width,height:25,
                    justifyContent:"center",textAlign:"center",
                    paddingLeft: width*.2,
                    paddingRight: width*.2
                }}>
                    <TouchableHighlight>
                        <Button
                            title="Login Out"
                            color="#f0695a"
                            onPress={() => {
                                var path = {
                                    pathname: '/'
                                }

                                global.storage.save({
                                    key: 'dm',
                                    data: false,
                                    expires: null
                                });
                                global.storage.save({
                                    key: 'showOrders',
                                    data: false,
                                    expires: null
                                });

                                global.storage.save({
                                    key: 'showOrdersTime',
                                    data: null,
                                    expires: null
                                });

                                global.storage.save({
                                    key: 'ShiftOhters',
                                    data: false,
                                    expires: null
                                });
                                
                                global.storage.save({
                                    key: 'ShiftOhtersTime',
                                    data: null,
                                    expires: null
                                });

                                this.props.history.push(path);
                            }}
                            buttonStyle={{
                                height:25,
                                shadowColor:"#ffffff"
                            }}
                        />
                    </TouchableHighlight>
                </View>
            </View>
            <MyTabBar
                tabs={
                    ["Home", "driver", "map", "delivered", "user"]
                }
                {...this.props}
                titleNumber={this.state.titleNumber}
                deliveredNumber={this.state.deliveredNumber}
                driverTitleNumber={this.state.driverTitleNumber}

                activeTab={"user"}
                goToPage={(data) => {
                    this.setState({
                        activeTab: data
                    })
                    if(data != "User") this.props.history.push('/' + data);
                    // this.props.navigation.push(data);
                    // this.props.history.push('/' + data);
                }}
            >
            </MyTabBar>
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
    tabbar: {
        backgroundColor: '#ffffff',
        shadowColor: '#ff544f',
    },
    label: {
        color: '#ffffff',
        fontWeight: '400',
        textAlign: 'left',

        justifyContent: "flex-start",
        // textAlignVertical:"left",
        alignItems: "flex-start",
    },
});
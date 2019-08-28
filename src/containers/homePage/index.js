
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    TouchableHighlight,
    Platform
} from 'react-native';

import { connect } from 'react-redux'; // 引入connect函数
import { NavigationActions } from 'react-navigation';
import *as Actions from '../../action/counterAction';

import { bindActionCreators } from 'redux'
import { TabView, TabBar,SceneMap } from 'react-native-tab-view';
// import { SceneMap } from "./SceneMap";

import AppStyles from "../../../styles/AppStyles";
import FirstRoute from "../../components/chinaTown";
import SecondRoute from "../../components/otherStore";
import Navtab from "../../unitl/navtab";

import { OrderQuery, DailySum, Update, newOrderCount } from "../../api";
// import firebase from 'react-native-firebase';
// import type { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';

import MyTabBar from '../../unitl/MyTabBar';
// import { platform } from 'os';

const { width, height } = Dimensions.get('window');
const mapStatesToProps = state => ({
    count: state.counter.count
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'China Town' },
                { key: 'second', title: 'EasyDish' },
            ],
            leftNumber: 0,
            rightNumber: 0,
            deliveredNumber: [0, 0],
            driverTitleNumber: [0, 0],
            isFocused:true,
        };
        //TODO
        // global.storeInfo = {
        //     Name:'current Shop \n 123567789'
        // }
        
    }

    static navigationOptions = {    
        header: null
    };

    _renderTabBar = props => (
        <TabBar {...props} style={styles.tabbar}
            titleStyle={AppStyles.header}
            titleContent={"Easy Dish"}
            titleNumber={props.titleNumber}
            NumberStyle={AppStyles.NumberStyle}
            scrollEnabled={false}
            onTabPress={(data) => { this.setState({ index: data }) }}
            labelStyle={styles.label} 
        />
    );

    // logout() {
    //     this.props.navigation.dispatch(resetAction)
    // }

    async componentDidMount() {

        global.storage.load({
            key: 'driverData'
        }).then(data => {
            this.setState({
                driverTitleNumber: data
            })
        })
    }

    // setTitleNumber = data => {
    //     // alert("c2123"+ JSON.stringify(data));
    //     this.setState({
    //         titleNumber: data
    //     })
    //     global.storage.save({
    //         key: 'chinaT',
    //         data: data,
    //         expires: null
    //     });
    // }
    setLeftNumber = data => {
        // alert("c2123"+ JSON.stringify(data));
        this.setState({
            leftNumber: data
        })
        // global.storage.save({
        //     key: 'chinaT',
        //     data: data,
        //     expires: null
        // });
    }
    setRightNumber = data => {
        // alert("c22"+ JSON.stringify(data));
        this.setState({
            rightNumber: data
        })
        // global.storage.save({
        //     key: 'chinaT',
        //     data: data,
        //     expires: null
        // });
    }

    setDirverNumber = data => {
        // alert("c22"+ JSON.stringify(data));
        this.setState({
            driverTitleNumber: data
        })
    }
    addDirverNumber = data => {
        // alert("c22"+ JSON.stringify(data));
        this.setState({
            driverTitleNumber: this.state.driverTitleNumber+data
        })
    }
    changeTab = data => {
        this.setState({
            isFocused:data
        })
    }

    render() {
        global.Home = [this.state.leftNumber,this.state.rightNumber];
        return (<View style={{ width: width, height: height }}>
            <Navtab
                navigationState={this.state}
                titleContent={"New Orders"}
                // titleStyle={AppStyles.header}
                leftTitle={global.storeInfo?global.storeInfo.name+"\n"+global.storeInfo.phone:""}
                rightTitle={"EasyDish"}

                leftNumber={this.state.leftNumber}
                rightNumber={this.state.rightNumber}
                NumberStyle={AppStyles.NumberStyle}
                toChange={this.changeTab.bind(this)}
                layout={{ width: Dimensions.get('window').width, height: 20 }}
                tabStyle={{}}
                isFocused={this.state.isFocused}
            >
            </Navtab>
            {/* <View style={{ width: width, height: height - 70 }}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                            first: FirstRoute,
                            second: SecondRoute,
                        },
                        {...this.props},
                        {asd:(data)=>{
                            this.setTitleNumber(data)
                        }}
                    )}
                    titleNumber={[0,0]}
                    navigation={this.props.navigation}
                    renderTabBar={this._renderTabBar}
                    onTitleNumber={()=>this.setTitleNumber.bind(this)}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width, height: 20 }}
                />
            </View> */}
                {this.state.isFocused?(<FirstRoute
                    {...this.props}
                    onTitleNumber={this.setLeftNumber.bind(this)}
                    onRightNumber={this.setRightNumber.bind(this)}
                    addDirverNumber={this.addDirverNumber.bind(this)}
                >
                </FirstRoute>):(<View
                    style={{
                        marginTop:  Platform.OS === 'ios' ? -5 : 0
                    }}
                >
                <SecondRoute
                    {...this.props}
                    onRightNumber={this.setRightNumber.bind(this)}
                    addDirverNumber={this.addDirverNumber.bind(this)}
                >
                </SecondRoute>
            </View>)}
            <MyTabBar
                tabs={
                    ["Home", "driver", "map", "delivered", "user"]
                }
                {...this.props}
                titleNumber={[this.state.leftNumber,this.state.rightNumber]}
                deliveredNumber={this.state.deliveredNumber}
                driverTitleNumber={this.state.driverTitleNumber}

                activeTab={"Home"}
                goToPage={(data) => {
                    this.setState({
                        activeTab: data
                    })

                    if(data != "Home") this.props.history.push('/' + data);
                    // this.props.navigation.push(data);
                }}
            >
            </MyTabBar>
        </View>)
    }
}

export default MainPage;

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
        alignItems: "flex-start",
    },
});
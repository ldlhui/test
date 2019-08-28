
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';

import { connect } from 'react-redux'; // 引入connect函数
import { NavigationActions } from 'react-navigation';
import *as counterAction from '../../action/counterAction';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AppStyles from "../../../styles/AppStyles";
import JibunnOreder from "../../components/jibunnOrder";
import Collected from "../../components/collected";

const { width, height } = Dimensions.get('window');

import { OrderQuery, DailySum,easyDishDelivered } from "../../api";

import Navtab from "../../unitl/navtab";

import MyTabBar from '../../unitl/MyTabBar';
class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'China Town \n 01 987 6543' },
                { key: 'second', title: 'Easy Dish \n Driver' },
            ],
            leftNumber: 0,
            rightNumber: 0,
            titleNumber:[0,0],
            deliveredNumber: [0, 0],
            driverTitleNumber: [0, 0],
            isFocused: true,
            menuShow: false
        };
    }

    static navigationOptions = {    
        header: null
    };

    _renderTabBar = props => (
        <TabBar {...props} style={styles.tabbar}
        titleStyle={AppStyles.header}
        titleContent={"Delivered Orders"}
        titleNumber={props.titleNumber}
        NumberStyle={AppStyles.NumberStyle}
        scrollEnabled={false}
        onTabPress={(data)=>{this.setState({index:data})}}
        labelStyle={styles.label} />
    );

    logout() {
        this.props.navigation.dispatch(resetAction)
    }

    changeTab = data => {
        this.setState({
            isFocused:data
        })
    }

    getData() {
        // global.storage.load({
        //     key: 'location'
        // }).then(locations => {
            
        // })

        OrderQuery({
            status: "delivered",
            type:"current",
            // shopModel: { shopId: "001bbb" },
            driverModel: {
                latitude: locations.latitude,
                longitude: locations.longitude,
                name: global.dm.name,
                driverId: global.dm.driverId
            }
        }).then((data) => {

                this.setState({
                    deliveredNumber: [data.data.length,0]
                })
            // easyDishDelivered({
            //     type: "others",
            //     status: "delivered",
            //     shopModel: { shopId: global.storeInfo.shopId },
            //     driverModel: {
            //         name: global.dm.name,
            //         driverId: global.dm.driverId
            //     }
            // }).then((otherData) => {

            //     // DeviceEventEmitter.emit('msg', {
            //     //     deliveredNumber:  [data.data.length,otherData.data.length]
            //     // });

            //     this.setState({
            //         deliveredNumber: [data.data.length,otherData.data.length]
            //     })
            // });
        });
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
    componentDidMount() {

        // this.getData();
        global.storage.load({
            key: 'chinaT'
        }).then(data => {
            this.setState({
                titleNumber: data
            })
        })

        global.storage.load({
            key: 'driverData'
        }).then(data => {
            this.setState({
                driverTitleNumber: data
            })
        })
    }


    render() {
        global.delivered = [this.state.leftNumber,this.state.rightNumber];

        return (<View style={{ width: width, height: height  }}>
            <Navtab
                navigationState={this.state}
                titleContent={"Delivered Orders"}
                // titleStyle={AppStyles.header}
                leftTitle={global.storeInfo?global.storeInfo.name+"\n"+global.storeInfo.phone:""}
                rightTitle={"EasyDish"}
                rightBtn={true}
                toMenu={()=>{
                    this.setState({
                        menuShow: !this.state.menuShow
                    })
                }}
                leftNumber={this.state.leftNumber}
                rightNumber={this.state.rightNumber}
                NumberStyle={AppStyles.NumberStyle}
                toChange={this.changeTab.bind(this)}
                layout={{ width: Dimensions.get('window').width, height: 20 }}
                tabStyle={{}}
                isFocused={this.state.isFocused}
            >
            </Navtab>
            {
                this.state.menuShow?(<View
                    style={{
                        position:"absolute",
                        right: 10,
                        top: 25,
                        width:180,
                        height:80,
                        backgroundColor:"#ffffff",
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: "#f5f5f5",
                        zIndex:1000
                    }}
                >
                    <TouchableHighlight
                        onPress={() => {
                            var path = {
                                pathname: '/currentHistory',
                            }
                            this.props.history.push(path);
                        }}
                    >
                        <Text
                            style={{
                                padding: 10,
                                borderBottomColor: "#f5f5f5",
                                borderBottomWidth:1,
                                textAlign:"center"
                            }}
                        >
                            Store Driver Histore 
                        </Text>
                    </TouchableHighlight>
                    
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate.push("otherHistory");
                        }}
                    >
                        <Text
                            style={{
                                padding: 10,
                                borderBottomColor: "#f5f5f5",
                                borderBottomWidth:1,
                                textAlign:"center",
                                color:"#f0695a"
                            }}
                        >
                            EasyDish Driver Histore
                        </Text>
                    </TouchableHighlight>
                </View>):null
            }
            {this.state.isFocused?(<JibunnOreder
                {...this.props}
                onTitleNumber={this.setLeftNumber.bind(this)}
                onRightNumber={this.setRightNumber.bind(this)}
            >
            </JibunnOreder>):(<Collected
                {...this.props}
                onRightNumber={this.setRightNumber.bind(this)}
            >
            </Collected>)}
            {/* <View style={{ width: width, height: height - 70 }}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: JibunnOreder,
                        second: Collected,
                    })}
                    titleNumber={this.state.deliveredNumber}
                    navigation={this.props.navigation}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width,height:15}}
                />
            </View> */}
            <MyTabBar
                tabs={
                    ["Home", "driver", "map", "delivered", "user"]
                }
                {...this.props}
                titleNumber={this.state.titleNumber}
                deliveredNumber={[this.state.leftNumber,this.state.rightNumber]}
                driverTitleNumber={this.state.driverTitleNumber}

                activeTab={"delivered"}
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
        shadowColor: '#f0695a',
    },
    label: {
        color: '#ffffff',
        fontWeight: '400',
        textAlign:'left',
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },
});

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import { connect } from 'react-redux'; // 引入connect函数
import { NavigationActions } from 'react-navigation';
import *as counterAction from '../../action/counterAction';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import AppStyles from "../../../styles/AppStyles";
import Uncollected from "../../components/uncollected";
import Collected from "../../components/collected3b";

import MyTabBar from '../../unitl/MyTabBar';
import Navtab from "../../unitl/navtab";
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

        let arrData = [this.state.leftNumber,this.state.rightNumber];
        global.driver = [this.state.leftNumber,this.state.rightNumber];

        return (<View style={{ width: width, height: height }}>
            <Navtab
                navigationState={this.state}
                titleContent="Accepted Orders"
                // titleStyle={AppStyles.header}
                leftTitle={"Uncollected \n Orders"}
                rightTitle={"Current \n Delivery"}

                leftNumber={this.state.leftNumber}
                rightNumber={this.state.rightNumber}
                NumberStyle={AppStyles.NumberStyle}
                toChange={this.changeTab.bind(this)}
                layout={{ width: Dimensions.get('window').width, height: 20 }}
                tabStyle={{}}
                isFocused={this.state.isFocused}
            >
            </Navtab>
            {this.state.isFocused?(<Uncollected
                {...this.props}
                onTitleNumber={this.setLeftNumber.bind(this)}
                onRightNumber={this.setRightNumber.bind(this)}
            >
            </Uncollected>):(<Collected
                {...this.props}
                onRightNumber={this.setRightNumber.bind(this)}
            >
            </Collected>)}
            <MyTabBar
                tabs={
                    ["Home", "driver", "map", "delivered", "user"]
                }
                {...this.props}
                titleNumber={this.state.titleNumber}
                deliveredNumber={this.state.deliveredNumber}
                driverTitleNumber={arrData}

                activeTab={"driver"}
                goToPage={(data) => {
                    this.setState({
                        activeTab: data
                    })
                    if(data != "driver") this.props.history.push('/' + data);
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
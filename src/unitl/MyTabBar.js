import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewPropTypes,
    DeviceEventEmitter
} from 'react-native';

import {
    Badge
} from 'teaset';


/**
 * 2018-11-10
 * chenlw
 * work：自定义ScrollableTabViewPage的TabBar
 */
export default class MyTabBar extends React.Component {

    //未选中的图标
    tabUnselectedIcons = [
        "d1",
        "d2",
    ];
    //选中的图标
    tabSelectedIcons = [
        "d12",
        "d22",
    ];


    constructor(props) {
        super(props);

        this.state = {
            dirver: this.props.driverTitleNumber,
            title: this.props.titleNumber
        }
    }

    static defaultProps = {
        activeTextColor: 'navy',
        inactiveTextColor: 'black',
        backgroundColor: null,
    };

    componentWillMount() {
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('dirver', (data) => {
            if (data) {
                if (data.dirver)
                    this.setState({
                        dirver:  this.state.dirver+ data.dirver
                    });
            }
        });
    }

    /**
     * 是否显示该Tab
     * @param {*} pageIndex 
     */
    isRenderTab(pageIndex) {
        let hideTabIndexSet = this.props.hideTabIndexSet;
        if (hideTabIndexSet) {
            return !hideTabIndexSet.has(pageIndex);
        }
        return true;
    }

    render() {

        let activeTab = this.props.activeTab;

        let titleNumber = this.state.title;

        let driverTitleNumber = this.state.dirver;
        
        let deliveredNumber = this.props.deliveredNumber;
        if( activeTab !="Home" ) {
            titleNumber = global.Home
        }

        if( activeTab !="driver" ) {
            driverTitleNumber = global.driver
        }

        if( activeTab !="delivered" ) {
            deliveredNumber = global.delivered
        }

        // alert(deliveredNumber);

        return (
            <View style={[styles.tabs, { backgroundColor: this.props.backgroundColor }, this.props.style]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.props.tabs.map((name, pageIndex) => {
                        if (this.isRenderTab(pageIndex)) {
                            //判断是否渲染该页面
                            let isTabActive = this.props.activeTab == name;
                            if(this.props.activeTab=="test" &&  name == "Home"){
                                isTabActive = true;
                            }
                            if(this.props.activeTab=="ChinaTown" &&  name == "Home"){
                                isTabActive = true;
                            }
                            let number = name == "ChinaTown" || name == "Home" ? titleNumber :
                                name == "driver" ? driverTitleNumber :
                                    name == "deliveredNumber" ? deliveredNumber : null
                            return this.renderTab(name, pageIndex,
                                isTabActive, this.props.goToPage, number);
                        }
                    })}
                </View>
            </View>
        );
    }


    renderTab(name, pageIndex, isTabActive, onPressHandler, number) {
        const { activeTextColor, inactiveTextColor, textStyle } = this.props;
        // ["Home","driver","map","delivered","user"]
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {

                        if (name == "Home") {
                            onPressHandler("ChinaTown")
                        }

                        if (name != "map"&&  name != "Home") {
                            onPressHandler(name)
                        }
                    }}>
                    <View style={[styles.tab, this.props.tabStyle]}>
                        {
                            this.renderTabBadge(name)
                        }
                        {
                            number&&number!=0 ? (
                                <View style={this.props.NumberStyle}>
                                    <View style={{
                                        borderColor: "#f0695a",
                                        width: 15,
                                        height: 15,
                                        borderRadius: 15,
                                        position: 'absolute',
                                        fontWeight: "bold",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        backgroundColor: "#FFFFFF",
                                    }}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: "bold",
                                            color: "#f0695a"
                                        }}>{
                                            number[0]+number[1]
                                        }</Text></View>
                                </View>
                            ) : null
                        }
                        {/* <View>
                            <Text>{name}</Text>
                        </View> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                this.renderTabIcon(pageIndex, isTabActive)
                            }

                            {
                                name == "ChinaTown" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe616;
                                    </Text> : null
                            }
                            {
                                name == "ChinaTown" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe618;
                                    </Text> : null
                            }

                            {
                                name == "Home" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe616;
                                    </Text> : null
                            }
                            {
                                name == "Home" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe618;
                                    </Text> : null
                            }
                            {
                                name == "driver" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe61a;
                                    </Text> : null
                            }
                            {
                                name == "driver" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe617;
                                    </Text> : null
                            }

                            {
                                name == "map" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe61d;
                                    </Text> : null
                            }
                            {
                                name == "map" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe61b;
                                    </Text> : null
                            }

                            {
                                name == "delivered" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe619;
                                    </Text> : null
                            }
                            {
                                name == "delivered" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe615;
                                    </Text> : null
                            }

                            {
                                name == "user" && !isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20,
                                        color: "#d8d9da"
                                    }}>
                                        &#xe61e;
                                    </Text> : null
                            }
                            {
                                name == "user" && isTabActive ?
                                    <Text style={{
                                        fontFamily: "iconfont",
                                        fontSize: 20
                                    }}>
                                        &#xe61c;
                                    </Text> : null
                            }

                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    /**
     显示Tab的图标
     * require指令不支持变量类型
     * @param {*} pageIndex 
     * @param {*} isTabActive 
     */
    renderTabIcon(pageIndex, isTabActive) {
        if (isTabActive) {
            return <Image source={this.tabSelectedIcons[pageIndex]}></Image>;;
        } else {
            return <Image source={this.tabUnselectedIcons[pageIndex]}></Image>;;
        }
    }

    /**
     * 显示消息红点
     * @param {*} pageName 
     */
    renderTabBadge(pageName) {
        switch (pageName) {
            case "消息":
                return <Badge style={{ position: 'absolute', right: 5, top: 5, }} count={10} />;
            case "我的":
                return <Badge style={{ position: 'absolute', right: 5, top: 5, }} count={12} />;
        }
        return null;
    }

}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        borderWidth: 2,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
});
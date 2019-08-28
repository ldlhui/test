import React from 'react';
import {
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MessagePage from './pages/MessagePage';
import MinePage from './pages/MinePage';

import MyTabBar from './MyTabBar';

export default class MainPageTab extends React.Component {

    constructor(props) {
        super(props);

        /**
         * 实现隐藏特定页面的功能：把要隐藏的页面下标加入hideTabIndexSet就可以实现，比如要隐藏消息页面，就hideTabIndexSet.add(0);
         * 注意：
         * （1）要将这个属性传递到自定义tabBar的props，这样自定义tabBar组件才能读取数据。
         * （2）同时要修改ScrollableTabView组件的初始化页面下标，不然显示的页面就有可能错误。
         */
        const hideTabIndexSet = new Set();
        //hideTabIndexSet.add(0);

        //初始化页面的下标
        const initialPage = 0;

        this.state = {
            activeIndex: 0,
            hideTabIndexSet: hideTabIndexSet,
            initialPage: initialPage,
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#d81e06" }} />
                <ScrollableTabView
                    initialPage={this.state.initialPage}   //初始化页面的下标，从0开始
                    tabBarPosition={"bottom"}           //导航栏的位置
                    tabBarBackgroundColor={"#fff"}      //导航栏的背景色
                    tabBarActiveTextColor={"#d81e06"}   //选中tab页面的字体颜色
                    tabBarInactiveTextColor={"#515151"} //非选中tab页面的字体颜色
                    scrollWithoutAnimation={true}   //true，不使用页面切换动画
                    //locked={true}   //true表示不允许滑动
                    renderTabBar={() => {
                        //渲染自定义的tabBar
                        return <MyTabBar hideTabIndexSet={this.state.hideTabIndexSet}></MyTabBar>
                    }}
                    onChangeTab={(tab) => {
                        this.setState({ activeIndex: tab.i });
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>消息页面</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>我的页面</Text>
                    </View>
                </ScrollableTabView>
            </View>
        );
    }
}

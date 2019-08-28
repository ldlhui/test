import React from 'react';
import {
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MessagePage from './pages/MessagePage';
import MinePage from './pages/MinePage';

export default class MainPageTab extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
        }
    }

    render() {
        let initialPage = 0;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#6a91f8" }} />
                <ScrollableTabView
                    initialPage={initialPage}   //初始化页面的下标，从0开始
                    tabBarPosition={"bottom"}
                    tabBarBackgroundColor={"#fff"}
                    tabBarActiveTextColor={"#6a91f8"}
                    tabBarInactiveTextColor={"#7b7b7b"}
                    scrollWithoutAnimation={true}   //不使用页面切换动画
                    //locked={true}   //true表示不允许滑动
                    onChangeTab={(tab) => {
                        this.setState({ activeIndex: tab.i });
                    }}>
                    <MessagePage tabLabel="消息"></MessagePage>
                    <MinePage tabLabel="我的"></MinePage>
                </ScrollableTabView>
            </View>
        );
    }
}

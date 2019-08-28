/* @flow */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    NativeModules,
    StyleSheet,
    View,
    ScrollView,
    Platform,
    I18nManager,
    Text,
    Dimensions,
    DeviceEventEmitter,
    TouchableHighlight
} from 'react-native';
// import TouchableItem from './TouchableItem';
// import { SceneRendererPropType } from './PropTypes';
// import type { Scene, SceneRendererProps } from './TypeDefinitions';
import type {
    ViewStyleProp,
        TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

const { width, height } = Dimensions.get('window');

export default class TabBar extends React.Component {
    constructor(props: Props<T>) {
        super(props);
        let initialVisibility = 1;

        if (this.props.scrollEnabled) {
            const tabWidth = this._getTabWidth(this.props);
            if (!tabWidth) {
                initialVisibility = 0;
            }
        }

        const initialOffset =
            this.props.scrollEnabled && this.props.layout.width
                ? {
                    x: this._getScrollAmount(
                        this.props,
                        this.props.navigationState.index
                    ),
                    y: 0,
                }
                : undefined;

        this.state = {
            visibility: new Animated.Value(initialVisibility),
            scrollAmount: new Animated.Value(0),
            initialOffset,
            deliveredNumber: [0, 0],

            titleNumber: [0, 0],
        };
    }

    _getTabWidth = props => {
        const { layout, navigationState, tabStyle } = props;
        const flattened = StyleSheet.flatten(tabStyle);

        if (flattened) {
            switch (typeof flattened.width) {
                case 'number':
                    return flattened.width;
                case 'string':
                    if (flattened.width.endsWith('%')) {
                        const width = parseFloat(flattened.width);
                        if (Number.isFinite(width)) {
                            return layout.width * (width / 100);
                        }
                    }
            }
        }

        if (props.scrollEnabled) {
            return (layout.width / 5) * 2;
        }

        return layout.width / navigationState.routes.length;
    };

    render() {
        const { position, navigationState, scrollEnabled, tabStyle, bounces } = this.props;
        const { routes } = navigationState;
        const tabWidth = this._getTabWidth(this.props);
        const tabBarWidth = tabWidth * routes.length;

        // Prepend '-1', so there are always at least 2 items in inputRange
        const inputRange = [-1, ...routes.map((x, i) => i)];
        const translateX = Animated.multiply(this.state.scrollAmount, -1);


        const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
        const isFocused = this.props.isFocused;
        const sW = width - 12;
        return (
            <View style={{
                height: 98
            }}>
                <View style={[this.props.titleStyle,{
                        flexDirection: 'row',
                        justifyContent: "center"
                    }]}>
                    <Text style={{
                        fontSize: 24, color: "#000000",
                        fontWeight: "bold",
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlignVertical: 'center'
                    }}>
                        {this.props.titleContent}
                    </Text>
                    {
                        this.props.rightBtn?(
                        <TouchableHighlight
                            underlayColor='#fff'
                            onPress={() => {
                                // alert("123");
                                this.props.toMenu()
                            }}
                            style={{

                                position:"absolute",
                                textAlign:"right",
                                right: 10,
                                top: 5,
                            }}
                        >
                            <Text 
                            style={{
                                fontFamily: 'iconfont',
                                fontSize: 24
                            }}
                        >
                            &#xeaf1;
                        </Text>
                        </TouchableHighlight>):null
                    }
                </View>
                <View style={{
                    height: 50
                }}>
                    <View style={[styles.container,
                    {
                        width: width - 8, flexDirection: 'row'
                    }]}>
                        <TouchableHighlight
                            underlayColor='#fff'
                            onPress={() => {
                                // alert("123");
                                this.props.toChange(true)
                            }}
                        >
                            <View
                                // onPress={() => {
                                //     alert("123");
                                //     // this.props.toChange(true)
                                // }}
                                style={[
                                    styles.tabItem,
                                    tabStyle,
                                    passedTabStyle,
                                    isFocused ? styles.Active : styles.inActive,
                                    styles.container,
                                    {
                                        textAlign: 'left',
                                        justifyContent: "flex-start",
                                        // textAlignVertical:"left",
                                        alignItems: "flex-start",
                                        width: sW / 2, height: 50,
                                        position: 'relative'
                                    }
                                ]}
                            >
                                <TouchableHighlight
                                    underlayColor='#fff'
                                    onPress={() => {
                                        // alert("123");
                                        this.props.toChange(true)
                                    }}
                                >
                                    <Text style={{ color: "#ffffff" }}>{this.props.leftTitle}</Text>
                                </TouchableHighlight>

                                <View style={[this.props.NumberStyle]}>
                                    <View style={{
                                        borderColor: "#f0695a",
                                        width: 25,
                                        height: 25,
                                        borderRadius: 25,
                                        position: 'absolute',
                                        fontWeight: "bold",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        backgroundColor: "#FFFFFF"
                                    }}>

                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: "bold",
                                            color: "#f0695a"
                                        }}>
                                            {this.props.leftNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor='#fff'
                            onPress={() => {
                                this.props.toChange(false)
                            }}
                        >
                            <View
                                style={[
                                    styles.tabItem,
                                    tabStyle,
                                    passedTabStyle,
                                    !isFocused ? styles.Active : styles.inActive,
                                    styles.container,
                                    {
                                        textAlign: 'left',
                                        justifyContent: "flex-start",
                                        // textAlignVertical:"left",
                                        alignItems: "flex-start",
                                        width: sW / 2, height: 50,
                                        position: 'relative',
                                    }
                                ]}
                            >
                                <Text style={{ color: "#ffffff" }}>{this.props.rightTitle}</Text>
                                <View style={[this.props.NumberStyle]}>
                                    <View style={{
                                        borderColor: "#f0695a",
                                        width: 25,
                                        height: 25,
                                        borderRadius: 25,
                                        position: 'absolute',
                                        fontWeight: "bold",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        backgroundColor: "#FFFFFF"
                                    }}>

                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: "bold",
                                            color: "#f0695a"
                                        }}>
                                            {this.props.rightNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{
                    backgroundColor: "#f0695a",
                    borderLeftWidth: 3, borderLeftColor: "#ffffff",
                    borderRightWidth: 3, borderRightColor: "#ffffff"
                }}>
                    <Text></Text>
                </View>
            </View>)

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        overflow: Platform.OS === 'web' ? 'auto' : 'scroll'
    },
    inActive: {
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: '#acadae',
        borderLeftWidth: 3,
        borderLeftColor: "#acadae",
        borderRightWidth: 3,
        borderRightColor: "#acadae",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    Active: {
        marginLeft: 3,
        marginRight: 3,
        borderLeftWidth: 1,
        borderLeftColor: "#f0695a",
        borderRightWidth: 1,
        borderRightColor: "#f0695a",
        backgroundColor: '#f0695a',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    tabBar: {
        backgroundColor: '#ffffff',
        borderLeftWidth: 5,
        borderLeftColor: "#ffffff",
        borderRightWidth: 5,
        borderRightColor: "#ffffff",
        backgroundColor: '#f0695a',
        zIndex: Platform.OS === 'android' ? 0 : 1,
    },
    tabContent: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    tabLabel: {
        backgroundColor: 'transparent',
        color: 'white',
    },
    tabItem: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    indicator: {
        backgroundColor: '#eeeeee',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: 2,
    }
});

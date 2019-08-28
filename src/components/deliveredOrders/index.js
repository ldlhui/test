
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Button,
    TouchableHighlight,
    WebView
} from 'react-native';

const { width, height } = Dimensions.get('window');
import AppStyles from "./style";

import Svg from "../../../icons/icons";

/**
 * @app
 */
class ChinaTown extends React.Component {

    /**
     * @constructor
     * @param props
     */
    constructor(props)
    {
        super(props);
    }

    onPressLearnMore(){

    }
    /**
     * @render
     * @returns {*}
     */
    render()
    {
      return (
          <View style={[AppStyles.mainTabContainer,{width:width}]}>
                <View>
                    <View style={{height:100}}>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',width:width-8}}>
                            <View style={[AppStyles.middleButtonLeft,{width:width-8},AppStyles.middleButton,
                                {height:100,backgroundColor:'#f0695a' }]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{borderWidth:2,
                                    borderColor:"#f0695a",height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>
                                        <View style={{flexDirection: 'row',height:25}}>
                                            <Text style={styles.iconStyle}>&#xe606;</Text>
                                            <Text style={[styles.lineFont,{color:"#ffffff"}]}> Super Chef Chinese</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',height:25}}>
                                            <Text style={styles.iconStyle}>&#xe609;</Text>
                                            <Text style={[styles.lineFont,{color:"#ffffff"}]}> 01 460 6810</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',minHeight:25}}>
                                            <Text style={styles.iconStyle}>&#xe607;</Text>
                                            <Text style={[styles.lineFont,{color:"#ffffff",width:width*.8-30}]}> 1 main Street,Ashbourn,Co.Meath A86 ND42</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View> 
                        </View>
                    </View>

                    <View style={[AppStyles.middleButton,{marginTop:5}]}>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',width:width}}>
                            <View style={[AppStyles.middleButtonLeft,{width:width/2-8},
                                AppStyles.middleButton,{height:(width/2-8)*0.42,borderBottomColor:"#f7f7f7",borderBottomWidth:2 }]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{flexDirection: 'row',justifyContent:"space-between",
                                        height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>
                                        <View>
                                            <Text style={styles.activeFont}>D0002</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View>  
                            <View style={[AppStyles.middleButtonRight,
                                {width:width/2-8},AppStyles.middleButton,
                                {   
                                    height:(width/2-8)*0.42,
                                    backgroundColor:"#739e5e",
                                    paddingLeft:15,
                                    paddingTop:5
                                }]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{flexDirection: 'row',justifyContent:"space-between",
                                        height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>
                                        <View>
                                            <Text style={[styles.activeFont,{color:"#ffffff"}]}>Due to Store</Text>
                                            <Text style={[styles.activeFont,{color:"#ffffff"}]}>€128.00</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View>  
                        </View>
                    </View>

                    {/* <View style={AppStyles.middleButton}>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',width:width}}>
                            <View style={[AppStyles.middleButtonLeft,{width:width/2-8},AppStyles.middleButton,{height:(width/2-8)*0.42 }]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{flexDirection: 'row',justifyContent:"space-between",borderWidth:2,
                                    borderColor:"#ff544f",height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>
                                        <View style={[{
                                            borderRadius:45,
                                            backgroundColor:"#ff544f",
                                            width:45,
                                            height:45,
                                            margin:5,
                                            fontSize:25
                                        },styles.center]}>
                                            <Text style={styles.iconStyle}>&#xe605;</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.activeFont}>Route to</Text>
                                            <Text style={styles.activeFont}>Customer</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View>  
                            <View style={[AppStyles.middleButtonRight,{width:width/2-7,
                                    flexDirection: 'row',justifyContent:"space-between"},
                                    AppStyles.middleButton]}>
                                <View>
                                    <Text style={styles.activeFont}>Pick Up</Text>
                                    <Text style={[styles.activeFont,{fontSize:15}]}>In 20 Mins</Text>
                                </View>
                                <View style={[{backgroundColor:"#f0695a",padding:5,
                                            width:width*.15},AppStyles.middleButton,styles.center]}>
                                    <Text style={[{
                                            borderRadius:40,
                                            borderColor:"#f0695a",
                                            borderWidth:1,
                                            width:40,
                                            height:40,
                                            fontSize:45,
                                            padding:0,
                                            backgroundColor:"#ffffff",
                                            color: '#f0695a',
                                            fontFamily:'iconfont'
                                        }]}>&#xe60a;</Text>
                                </View>
                            </View>
                        </View>
                    </View> */}


                    <View style={AppStyles.middleButton}>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between',width:width}}>
                            <View style={[AppStyles.middleButtonLeft,{width:width/2-8},AppStyles.middleButton,
                                {height:(width/2-8)*0.35 }]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{flexDirection: 'row',
                                        height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>

                                        <View style={[{
                                                borderRadius:10,
                                                backgroundColor:"#f0695a",
                                                width:46,
                                                height:46,
                                                margin:5,
                                            },styles.center]}>
                                            <Text style={[styles.iconStyle,{fontSize:36,color:"#ffffff"}]}>&#xe602;</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.activeFont,{color:"#f0695a",
                                            fontSize:20,paddingTop:12}]}>Direction</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View>  
                            <View style={[AppStyles.middleButtonRight,{width:width/2-8},AppStyles.middleButton,
                                {height:(width/2-8)*0.42,borderWidth:0}]}>
                                <TouchableHighlight
                                    onPress={() => { this.props.navigation.push('Chat')}}
                                >
                                    <View style={{flexDirection: 'row',height:(width/2-8)*0.42,paddingLeft:5,fontWeight:"bold" }}>
                                        <View style={[{
                                                width:50,
                                                height:50,
                                                margin:5
                                            },styles.center]}>
                                            <Text style={[{
                                                color:"#f0695a",
                                                fontFamily:'iconfont',
                                                fontSize: 50 }]}>&#xe60c;</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.activeFont,{color:"#f0695a",
                                            fontSize:20,paddingTop:12}]}>Call Store</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight> 
                            </View>  
                        </View>
                    </View>




                    <View style={{justifyContent:"center", flexDirection:'row',marginTop:5}}>
                        <Text style={[styles.iconStyle,{color:"#f0695a"}]}>&#xe604;</Text>
                        <View style={{paddingLeft:5}}>
                            <Text style={{width:width*.85}}>Itabasi ku ,Tokyo City, Japan Province, China </Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center", flexDirection:'row',marginTop:2}}>
                        <Text style={[styles.iconStyle,{color:"#f0695a"}]}>&#xe60c;</Text>
                        <View style={{paddingLeft:5}}>
                            <Text style={{width:width*.85}}> 090 6496 0922 </Text>
                        </View>
                    </View>
                    <View style={{width:width-16,margin:4,height:1,backgroundColor:"#f7f7f7"}}></View>
                    <View style={{flex: 1, flexDirection: 'row',
                        justifyContent: 'space-between',
                        width:width-16,height:20,paddingLeft:19,paddingRight:19}}>
                        <View>
                            <Text style={{fontSize:20,fontWeight:"bold"}}>12 Mins (2.3KM)</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:10,width:width-16,margin:8,flexDirection: 'row',
                        backgroundColor:"#739e5e",
                        borderRadius:50}}
                    onPress={() => { this.props.navigation.push('Chat')}}
                >
                    <Svg key={`key-1`} icon={"greenslider-arrow-144x144"} 
                                    fill="#000000"
                                    style={{width:50,height:50}}/>
                    <TouchableHighlight
                    // onPress={() => {this.popUp.show()}}

                    onPress={() => { this.props.navigation.push('Chat')}}
                    style={{
                        width:width*.6,
                        flex:0,height:50,
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                    >
                        <Text 
                        style={{fontSize:38,fontWeight:"bold",color:"#FFFFFF"}}>Collect</Text>
                    </TouchableHighlight>
                </View>
                {/* <PopUp ref={ref => this.popUp = ref}>
                    <TouchableOpacity 
                    onPress={() => { this.popUp.hide() }}
                    // onPress={() => { this.props.navigation.push('Chat')}}
                    style={{ alignItems: 'center', backgroundColor: '#316DE6', height: 45, width: 80, 
                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', marginTop: 0 }}>
                        <Text style={{ color: '#fff' }}>关闭弹框</Text>
                    </TouchableOpacity>
                </PopUp> */}
          </View>
      )
    }
}
const styles = StyleSheet.create({
    iconStyle: {
        color: '#ffffff',
        fontFamily:'iconfont',
        fontSize: 20 
    },
    activeFont: {
        fontSize:24,
        fontWeight:"bold",
        color:"#000000"
    },
    center:{

        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center'
    }
})
// export default StackNavigator({
//     Main: {screen: ChinaTown}
//   });
export default ChinaTown;
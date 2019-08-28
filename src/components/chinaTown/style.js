
/**
 * @imports
 */
import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const softShadow = {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2
}

/**
 * Unified color control
 * @type {{background: string, foreground: string}}
 */
export const AppColors = {
    background: '#c94989',
    foreground: '#ffffff'
};

/**
 * Unified fonts
 * @type {{regular: string, bold: string, light: string}}
 */
export const AppFonts = {
    regular: 'Akkurat-Normal',
    bold: 'Akkurat-Bold',
    light: 'Akkurat-Light'
};

/**
 * @exports
 */
const Styles = StyleSheet.create({

    mainTabContainer: {
        flex: 1,
        // position: "absolute",
        zIndex: 1
    },
    middleButtonRight: {
        justifyContent: "flex-start",
        borderRightWidth: 8,
        borderRightColor: "#ffffff",
    },
    middleButtonLeft: {
        justifyContent: "flex-start",
        borderLeftWidth: 8,
        borderLeftColor: "#ffffff",
    },
    middleButton:{
        height:(width/2-8)*0.42 ,
        // backgroundColor: "#ff544f"
    }
});

export default Styles;
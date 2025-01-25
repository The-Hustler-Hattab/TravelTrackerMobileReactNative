
import React from "react";
import { useTheme } from "../../contexts/ThemeContextProps";
import ColorConstants from "../../constants/ColorConstants";
import { View, Text, StyleSheet } from 'react-native';


import { TextStyle } from 'react-native';

function TextComponent({children, style}: {children: React.ReactNode, style?: TextStyle}): JSX.Element {
    const { theme } = useTheme();
    
    return (
        <Text style={[{ color: theme === 'light' ? ColorConstants.BLACK : ColorConstants.WHITE }, style]}>
        {children}
      </Text>
    );
}

export default TextComponent;
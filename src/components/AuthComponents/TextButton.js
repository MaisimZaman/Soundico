import React from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';
import { FONTS, COLORS } from "../../screens/Authentication/constants";

const TextButton = ({
    contentContainerStyle,
    disabled,
    label,
    labelStyle,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: "#0c0d0d",
                ...contentContainerStyle
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <Text style={{ color: "white", ...FONTS.h3, ...labelStyle }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton;
import React from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';

import { FONTS, SIZES, COLORS } from "../../screens/Authentication/constants"

const FormInput = ({
    containerStyle,
    inputContainerStyle,
    label,
    placeholder,
    inputStyle,
    value = "",
    appendComponent,
    onChange,
    secureTextEntry,
    keyboardType = "default",
    autoCompleteType = "off",
    autoCapitalize = "none",
    maxLength,
}) => {
    return (
        <View style={{ ...containerStyle }}>
            <Text style={{ color: COLORS.gray30, ...FONTS.h3 }}>{label}</Text>

            <View
                style={{
                    flexDirection: 'row',
                    height: 45,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.gray10,
                    ...inputContainerStyle
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        ...FONTS.h3,
                        ...inputStyle
                    }}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCompleteType={autoCompleteType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    onChangeText={(text) => onChange(text)}
                />
                {
                    appendComponent
                }
            </View>
        </View>
    )
}

export default FormInput
import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const ViewScreen = ({ route, navigation }) => {
    const { house } = route.params;
    console.log("selected", house)
    return (
        <View className="flex-1 w-full">
            {/* <Image className=""/> */}
        </View>
    )
}

export default ViewScreen

const styles = StyleSheet.create({})
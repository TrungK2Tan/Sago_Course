import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { PraticeOption } from "../../constant/Option";
import Colors from "../../constant/Colors";

export default function PraticeSection() {
  return (
    <View style={{marginTop:10}}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 25 }}>Pratice</Text>
      <View>
        <FlatList
          numColumns={3}
          data={PraticeOption}
          renderItem={({ item, index }) => (
            <View key={index} style={{ flex: 1, margin: 5, aspectRatio: 1 }}>
              <Image
                source={item?.image}
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 160,
                  borderRadius: 15,
                }}
              />
              <Text style={{
                position:'absolute',
                padding:15,
                fontFamily:'outfit-regular',
                fontSize:15,
                color:Colors.WHITE,
              }}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

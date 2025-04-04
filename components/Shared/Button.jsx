import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";

export default function Button({ text, onPress, type = "fill", loading }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        width: "100%",
        borderRadius: 15,
        marginTop: 15,
        backgroundColor: type === "fill" ? Colors.PRIMARY : Colors.WHITE,
        borderWidth: type === "fill" ? 0 : 1,
        borderColor: Colors.PRIMARY,
      }}
      disabled={loading}
    >
      {!loading ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: type == "fill" ? Colors.WHITE : Colors.PRIMARY,
          }}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          size="small"
          color={type == "fill" ? Colors.WHITE : Colors.PRIMARY}
        />
      )}
    </TouchableOpacity>
  );
}

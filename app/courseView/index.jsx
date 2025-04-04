import { View, Text, FlatList } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Intro from "../../components/CourseView/Intro";
import Colors from "../../constant/Colors";
import Chapters from "../../components/CourseView/Chapters";

export default function courseView() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View
          style={{ backgroundColor: Colors.WHITE, borderRadius: 20, flex: 1 }}
        >
          <Intro course={course} />
          <Chapters course={course} />
        </View>
      }
    />
  );
}

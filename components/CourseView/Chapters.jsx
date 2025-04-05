import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function Chapters({ course }) {
  const router = useRouter();
  const isChapterCompleted = (index) => {
    const completedChapters = course?.completedChapter || [];
    return completedChapters.includes(index);
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>Chapters</Text>
      <FlatList
        data={course?.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterView",
                params: {
                  chapterParams:JSON.stringify(item),
                  docId: course?.docId,
                  chapterIndex: index,
                },
              });
            }}
            style={{
              padding: 15,
              borderRadius: 15,
              marginTop: 10,
              borderWidth: 0.5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Text style={styles.chapterText}>{index + 1}.</Text>
              <Text style={styles.chapterText}>{item?.chapterName}</Text>
            </View>
            {isChapterCompleted(index)?
            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
            : <Ionicons name="play" size={24} color={Colors.PRIMARY} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  chapterText: {
    fontFamily: "outfit-regular",
    fontSize: 18,
  },
});

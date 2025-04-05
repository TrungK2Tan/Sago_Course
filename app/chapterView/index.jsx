import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  const chapters = JSON.parse(chapterParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const GetProgress = (currentPage) => {
    const perc = currentPage / chapters?.content?.length;
    return perc;
  };
  const onChapterComplete = async () => {
    try {
      setLoader(true);

      // Correct way to reference the document
      const courseRef = doc(db, "Courses", docId);

      // Update the document
      await updateDoc(courseRef, {
        completedChapter: arrayUnion(parseInt(chapterIndex)), // Ensure chapterIndex is a number
      });

      setLoader(false);
      router.replace('/courseView/'+docId)
    } catch (error) {
      console.error("Error completing chapter:", error);
      setLoader(false);
      alert("Failed to mark chapter as complete. Please try again.");
    }
  };
  return (
    <View style={{ padding: 25, backgroundColor: Colors.WHITE, flex: 1 }}>
      <Progress.Bar
        progress={GetProgress(currentPage)}
        width={Dimensions.get("screen").width * 0.85}
      />
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
          {chapters?.content[currentPage]?.topic}
        </Text>
        <Text style={{ fontFamily: "outfit-regular", marginTop: 10 }}>
          {chapters?.content[currentPage]?.explain}
        </Text>
        {chapters?.content[currentPage]?.code && (
          <Text
            style={[
              styles.codeExampleText,
              { backgroundColor: Colors.BLACK, color: Colors.WHITE },
            ]}
          >
            {chapters?.content[currentPage]?.code}
          </Text>
        )}
        {/* <Text>Example:</Text> */}
        {chapters?.content[currentPage]?.example && (
          <Text style={styles.codeExampleText}>
            {chapters?.content[currentPage]?.example}
          </Text>
        )}
      </View>
      <View
        style={{ position: "absolute", bottom: 20, width: "100%", left: 25 }}
      >
        {chapters?.content?.length - 1 != currentPage ? (
          <Button
            text={"Next"}
            onPress={() => setCurrentPage(currentPage + 1)}
          />
        ) : (
          <Button
            text={"Finish"}
            onPress={() => onChapterComplete()}
            loading={loader}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  codeExampleText: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    fontFamily: "outfit-regular",
    fontSize: 18,
    marginTop: 10,
  },
});

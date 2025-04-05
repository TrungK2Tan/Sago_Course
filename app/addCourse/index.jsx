import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";
import { GenerateCourseAIModel, GenerateTopicsAIModel } from "../../config/AiModel";
import Prompt from "../../constant/Prompt";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

export default function AddCourse() {
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const router = useRouter();

  const onGenerateTopic = async () => {
    if (!userInput.trim()) {
      alert("Please enter a course idea");
      return;
    }

    setLoading(true);
    try {
      // Get Topic Ideas from AI Model
      const PROMPT = userInput + Prompt.IDEA;
      const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT);
      const topicIdea = JSON.parse(aiResp.response.text());
      setTopics(topicIdea?.course_titles || []);
    } catch (error) {
      console.error("Error generating topics:", error);
      alert("Failed to generate topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopic.find((item) => item === topic);
    if (!isAlreadyExist) {
      setSelectedTopic((prev) => [...prev, topic]);
    } else {
      const topics = selectedTopic.filter((item) => item !== topic);
      setSelectedTopic(topics);
    }
  };

  const isTopicSelected = (topic) => {
    return selectedTopic.includes(topic);
  };

  /**
   * Used to Generate Course using AI Model
   */
  const onGenerateCourse = async () => {
    if (selectedTopic.length === 0) {
      alert("Please select at least one topic");
      return;
    }

    setLoading(true);
    try {
      // Get Course from AI Model
      const PROMPT = selectedTopic.join(", ") + Prompt.COURSE;
      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
      const resp = JSON.parse(aiResp.response.text());
      const courses = resp.courses || [];

      // Save Course info to Database
      const savePromises = courses.map(async (course) => {
        const docId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
        await setDoc(doc(db, "Courses", docId), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email,
          docId: docId,
        });
      });

      await Promise.all(savePromises);
      router.push("/(tabs)/home");
    } catch (err) {
      console.error("Error generating course:", err);
      alert("Failed to generate course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={{ padding: 25, backgroundColor: Colors.WHITE, flex: 1 }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={{ fontFamily: "outfit-bold", fontSize: 30 }}>
        Create New Course
      </Text>
      <Text style={{ fontFamily: "outfit-regular", fontSize: 25 }}>
        What you want to learn today?
      </Text>
      <Text
        style={{
          fontFamily: "outfit-regular",
          fontSize: 20,
          marginTop: 8,
          color: Colors.GRAY,
        }}
      >
        What course you want to create (ex.Learn Python, Digital Marketing,
        10Th Science Chapters, etc,...)
      </Text>
      <TextInput
        placeholder="(Ex.Learn Python, Learn Java,...)"
        style={styles.textInput}
        numberOfLines={3}
        multiline={true}
        value={userInput}
        onChangeText={(value) => setUserInput(value)}
      />
      <Button
        text={"Generate Topic"}
        onPress={onGenerateTopic}
        type="outline"
        loading={loading}
        disabled={loading || !userInput.trim()}
      />

      {topics.length > 0 && (
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={{ fontFamily: "outfit-regular", fontSize: 20 }}>
            Select all topics which you want to add in the course
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 10,
            }}
          >
            {topics.map((item, index) => (
              <Pressable key={index} onPress={() => onTopicSelect(item)}>
                <Text
                  style={{
                    padding: 7,
                    borderWidth: 0.4,
                    borderRadius: 99,
                    paddingHorizontal: 15,
                    backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : null,
                    color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY,
                  }}
                >
                  {index + 1}. {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {selectedTopic.length > 0 && (
        <Button
          text="Generate Course"
          onPress={onGenerateCourse}
          loading={loading}
          disabled={loading}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    alignItems: "flex-start",
    fontSize: 18,
    borderColor: Colors.GRAY,
  },
});
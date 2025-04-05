import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Intro from "./../../../components/CourseView/Intro";
import Colors from "./../../../constant/Colors";
import Chapters from "./../../../components/CourseView/Chapters";
import {db} from "./../../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
export default function courseView() {
  const { courseParams,courseId } = useLocalSearchParams();
  const [course,setCourse] = useState([])
  // const course = JSON.parse(courseParams);
  // console.log(courseId);

  useEffect(() => {
   if(!courseParams){
    GetCourseById();
   }else{
    setCourse(JSON.parse(courseParams));
   }
  }, []);

  const GetCourseById= async()=>{
    const docRef = await getDoc(doc(db,'Courses',courseId));
    const courseData = docRef.data();
    setCourse(courseData);
  }
  return course &&(
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

import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "./../../constant/Colors";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "../../context/UserDetailContext";
export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // Initialize with an empty string
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Only in SignUp.js
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const CreateNewAccount = () => {
    if (!isValidEmail(email)) {
      ToastAndroid.show("Invalid email format", ToastAndroid.SHORT);
      return;
    }

    if (password.length < 6) {
      ToastAndroid.show(
        "Password must be at least 6 characters",
        ToastAndroid.SHORT
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        await SaveUser(user);
        router.replace("/(tabs)/home"); // Redirect after sign-up
      })
      .catch((e) => {
        console.log(e.message);
        ToastAndroid.show("Sign-up failed", ToastAndroid.SHORT);
      });
  };

  const SaveUser = async (user) => {
    const data = {
      fullName: fullName,
      email: email,
      member: false,
      // password: password,
      uid: user?.uid,
    };
    await setDoc(doc(db, "users", email), data);
    setUserDetail(data);
    //Navigate
  };
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        flex: 1,
        padding: 20,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.jpg")}
        style={{ width: 180, height: 180 }}
      />
      <Text style={{ fontSize: 30, fontFamily: "outfit-bold", marginTop: 20 }}>
        Create New Account
      </Text>
      <TextInput
        placeholder="Full Name"
        onChangeText={(value) => setFullName(value)}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TouchableOpacity
        onPress={CreateNewAccount}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 10,
          width: "100%",
          marginTop: 25,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 18,
            textAlign: "center",
            fontFamily: "outfit-regular",
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
      <View
        style={{ flexDirection: "row", marginTop: 20, gap: 5, display: "flex" }}
      >
        <Text style={{ fontFamily: "outfit-regular" }}>
          {" "}
          Already have an account?
        </Text>
        <Pressable onPress={() => router.push("/auth/signIn")}>
          <Text style={{ color: Colors.PRIMARY, fontFamily: "outfit-bold" }}>
            Sign In Here
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginTop: 20,
  },
});

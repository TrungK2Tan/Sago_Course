import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "./../../constant/Colors";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const [loading, setLoading] = useState(false);
  const onSignInClick = () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.SHORT);
      return;
    }
  
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        await getUserDetail();
        setLoading(false);
        router.replace("/(tabs)/home");
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
        ToastAndroid.show("Incorrect Email or Password", ToastAndroid.SHORT);
      });
  };
  
  const getUserDetail = async () => {
    const result = await getDoc(doc(db, "users", email));
    console.log(result.data());
    setUserDetail(result.data());
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
        Welcome Back!
      </Text>
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
        onPress={onSignInClick}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 10,
          width: "100%",
          marginTop: 25,
        }}
      >
        {!loading ? (
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 18,
              textAlign: "center",
              fontFamily: "outfit-regular",
            }}
          >
            SIgn In
          </Text>
        ) : (
          <ActivityIndicator size="large" color={Colors.WHITE} />
        )}
      </TouchableOpacity>
      <View
        style={{ flexDirection: "row", marginTop: 20, gap: 5, display: "flex" }}
      >
        <Text style={{ fontFamily: "outfit-regular" }}>
          {" "}
          You don't have an account?
        </Text>
        <Pressable onPress={() => router.push("/auth/signUp")}>
          <Text style={{ color: Colors.PRIMARY, fontFamily: "outfit-bold" }}>
            Create New Here
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

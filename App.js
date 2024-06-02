import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, FlatList, Button, View, TextInput, Text, Image, SafeAreaView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { app, database, storage } from "./firebase"; // Ensure firebase.js properly exports app, database, and storage
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useCollection } from "react-firebase-hooks/firestore";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListPage">
        <Stack.Screen name="ListPage" component={ListPage} />
        <Stack.Screen name="DetailPage" component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ListPage = ({ navigation }) => {
  const [text, setText] = useState("");
  const [editObj, setEditObj] = useState(null);
  const [values, loading, error] = useCollection(collection(database, "notes"));
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  async function buttonPressed() {
    try {
      await addDoc(collection(database, "notes"), { text });
      setText(""); // Clear the input field after adding the note
    } catch (err) {
      console.log("Error in DB" + err);
    }
  }

  async function deleteDocument(id) {
    try {
      await deleteDoc(doc(database, "notes", id));
    } catch (err) {
      console.log("Error deleting document: " + err);
    }
  }

  function viewUpdateDialog(item) {
    setEditObj(item);
    setText(item.text); // Set the text input with the current note text
  }

  async function saveUpdate() {
    try {
      await updateDoc(doc(database, "notes", editObj.id), { text });
      setText("");
      setEditObj(null);
    } catch (err) {
      console.log("Error updating document: " + err);
    }
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {editObj && (
          <View>
            <TextInput style={styles.textField} value={text} onChangeText={setText} />
            <Text style={styles.text} onPress={saveUpdate}>
              Save
            </Text>
          </View>
        )}
        <TextInput style={styles.textField} onChangeText={setText} value={text} placeholder="Add a word" placeholderTextColor="#999" />
        <Button title="Add Note" onPress={buttonPressed} />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.text} onPress={() => deleteDocument(item.id)}>
                Delete
              </Text>
              <Text style={styles.text} onPress={() => viewUpdateDialog(item)}>
                Update
              </Text>
              <Text style={styles.text} onPress={() => navigation.navigate("DetailPage", { text: item.text })}>
                Go to Detail
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const DetailPage = ({ navigation, route }) => {
  const { text } = route.params;
  const [imagePath, setImagePath] = useState(null);

  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImagePath(result.assets[0].uri);
    }
  }

  async function downloadImage() {
    getDownloadURL(ref(storage, "myimage.jpg"))
      .then((url) => {
        setImagePath(url);
      })
      .catch((error) => {
        alert("Error in download: " + error);
      });
  }

  async function uploadImage() {
    const res = await fetch(imagePath);
    const blob = await res.blob();
    const storageRef = ref(storage, "myimage.jpg");
    uploadBytes(storageRef, blob).then((snapshot) => {
      alert("Image uploaded");
    });
  }

  async function launchCamera() {
    const result = await ImagePicker.requestCameraPermissionsAsync(); // Request camera permissions
    if (result.granted === false) {
      alert("Camera access not provided");
    } else {
      ImagePicker.launchCameraAsync({
        quality: 1, // Highest quality
      })
        .then((response) => {
          if (!response.canceled) {
            setImagePath(response.assets[0].uri);
          }
        })
        .catch((error) => alert("Error with camera" + error));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Image style={{ width: 200, height: 200 }} source={{ uri: imagePath }} />
      <Button title="Pick Image" onPress={launchImagePicker} />
      <Button title="Camera" onPress={launchCamera} />
      <Button title="Download Image" onPress={downloadImage} />
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191C27",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    margin: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#191C27",
  },
  textField: {
    backgroundColor: "#fff",
    minWidth: 200,
    marginTop: "50%",
  },
});

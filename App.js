import { app, database } from './firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, FlatList, Text, View, Image, Button, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCollection} from 'react-firebase-hooks/firestore';

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
  const [text, setText] = useState('');
  const [editObj, setEditObj] = useState(null);
  const [values, loading, error] = useCollection(collection(database, "notes"))
  const data = values?.docs.map((doc) => ({...doc.data(), id: doc.id}))

  async function buttonPressed() {
    try {
   await addDoc(collection(database, "notes"), {
      text: text
    })
  } catch (err) {
    console.log("fejl i DB" + err)
  }
  

  }
  async function deleteDocument(id){
    await deleteDoc(doc(database, "notes", id))

  }
  function viewUpdateDialog(item){
  
    setEditObj(item)

  }
  async function saveUpdate(){
    await updateDoc(doc(database, "notes", editObj.id), {
       text: text
    })
    setText("")
    setEditObj(null)

  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
     { editObj &&
     <View>
        <TextInput  style={styles.textField}   defaultValue={editObj.text} onChangeText={setText}   />
       <Text style={styles.text} onPress={saveUpdate}>save</Text> 

  
      </View>
}

        <TextInput 
          style={styles.textField} 
          onChangeText={setText} 
          //onChangeText={(txt) => setText(txt)}
          value={text}
          placeholder="Add a word" 
          placeholderTextColor="#999" 
        />
        <Button title="Press Me" onPress={buttonPressed} />
        <FlatList 
  data={data}
  renderItem={(note) => 
  <View>
<Text style={styles.text}>{note.item.text}</Text>
<Text style={styles.text} onPress={() => deleteDocument(note.item.id)}>Delete</Text>
<Text style={styles.text} onPress={() => viewUpdateDialog(note.item)}>Update</Text>
 
  </View>
  

}
  />

      </View>
    </SafeAreaView>
  );
}

const DetailPage = ({ navigation, route }) => {
  const {text} = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191C27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    paddingLeft: 150,
    paddingRight: 150,
    borderRadius: 10,
    backgroundColor: '#191C27',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    margin: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#191C27', 
  },
  textField: {
    backgroundColor: '#fff',
    minWidth: 200,
    marginTop: '50%',



    },
    buttonText: {
      color: 'white',
    },
});

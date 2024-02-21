import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, FlatList, Text, View, Image, Button, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
  const [notes, setNotes] = useState([]);

  function buttonPressed() {
    setNotes([...notes, { key: notes.length.toString(), name: text }]);
    setText(''); 
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput 
          style={styles.textField} 
          onChangeText={setText} 
          value={text}
          placeholder="Add a word" 
          placeholderTextColor="#999" 
        />
        <Button title="Press Me" onPress={buttonPressed} />
        <FlatList 
  data={notes}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => navigation.navigate('DetailPage', { text: item.name })}
    >
      <Text style={styles.buttonText}>{item.name.substring(0, 30)}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={item => item.key.toString()} 
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

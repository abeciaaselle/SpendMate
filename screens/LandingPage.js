import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { ImageBackground } from 'react-native';

const LandingPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (name.trim() === '') {
      setError('Please enter your name.');
      return;
    }
    navigation.navigate('Home', { userName: name });
  };

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => {
              setName(text);
              setError('');
            }}
            placeholder="Enter your name"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background to allow the background image to be visible
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  logo: {
    width: 500, // Adjust as needed
    height: 500, // Adjust as needed
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20, // Add padding to give space on the sides
  },
  input: {
    width: windowWidth * 0.8, // Set width to 80% of the screen width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'white', // Set background color for input
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    width: windowWidth * 0.8, // Set width to 80% of the screen width
    backgroundColor: '#3F5D32', // Set background color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
});

export default LandingPage;

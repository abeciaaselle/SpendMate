import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SignupPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields.');
      return;
    }
    // Perform sign up logic here, e.g., API call or local storage update
    // After successful sign up, store user credentials in AsyncStorage
    try {
      await AsyncStorage.setItem('userData', JSON.stringify({ name, email, password }));
      Alert.alert(
        'Account Created',
        'Your account has been successfully created!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LandingPage', { userName: name }),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const goBack = () => {
    navigation.goBack();
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
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => {
              setEmail(text);
              setError('');
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={text => {
              setPassword(text);
              setError('');
            }}
            placeholder="Enter your password"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Back</Text>
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
  backButton: {
    width: windowWidth * 0.8, // Set width to 80% of the screen width
    backgroundColor: '#ccc', // Set background color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
});

export default SignupPage;

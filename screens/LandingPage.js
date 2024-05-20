import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LandingPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user credentials exist in AsyncStorage (user is already signed up)
    checkUserCredentials();
  }, []);

  const checkUserCredentials = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        // User credentials found, navigate to Home screen or perform auto-login
        const { name } = JSON.parse(userData);
        navigation.navigate('Home', { userName: name });
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleStart = () => {
    if (name.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields.');
      return;
    }
    // Perform login logic here
    // Example: Authenticate user using API call or validate against stored credentials
    // If login successful, navigate to Home screen
    navigation.navigate('Home', { userName: name });
  };

  const handleForgotPassword = () => {
    navigation.navigate('RecoveryPage');
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignupPage');
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
            value={password}
            onChangeText={text => {
              setPassword(text);
              setError('');
            }}
            placeholder="Enter your password"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createAccount}>Don't have an account yet? Create one.</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    width: 500,
    height: 500,
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  input: {
    width: windowWidth * 0.8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    width: windowWidth * 0.8,
    backgroundColor: '#3F5D32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#3F5D32',
    marginTop: 10,
  },
  createAccount: {
    color: '#3F5D32',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default LandingPage;
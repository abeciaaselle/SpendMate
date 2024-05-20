import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { ImageBackground } from 'react-native';

const RecoveryPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRecovery = () => {
    if (email.trim() === '') {
      setError('Please enter your email.');
      return;
    }
    // Perform recovery logic here, e.g., API call or local storage update
    // Show an alert indicating that password recovery instructions have been sent to the provided email
    Alert.alert(
      'Password Recovery',
      'Password recovery instructions have been sent to your email.',
      [
        { text: 'OK', onPress: () => navigation.navigate('LandingPage') }
      ],
      { cancelable: false }
    );
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
            value={email}
            onChangeText={text => {
              setEmail(text);
              setError('');
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleRecovery}>
            <Text style={styles.buttonText}>Recover Password</Text>
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

export default RecoveryPage;
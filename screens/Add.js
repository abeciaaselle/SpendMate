import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Clothing', icon: 'tshirt-crew' },
  { name: 'Dining Out', icon: 'food' },
  { name: 'Education', icon: 'school' },
  { name: 'Entertainment', icon: 'gamepad-variant' },
  { name: 'Gifts/Donations', icon: 'gift' },
  { name: 'Groceries', icon: 'cart' },
  { name: 'Health/Medical', icon: 'hospital' },
  { name: 'Insurance', icon: 'shield' },
  { name: 'Miscellaneous', icon: 'plus-circle' },
  { name: 'Personal Care', icon: 'human-male-female' },
  { name: 'Rent/Mortgage', icon: 'home' },
  { name: 'Subscriptions', icon: 'credit-card-plus' },
  { name: 'Transportation', icon: 'bus' },
  { name: 'Travel', icon: 'airplane' },
  { name: 'Utilities', icon: 'water' },
];

const Add = () => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [income, setIncome] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const navigation = useNavigation();

  const handleAddExpense = () => {
    if (selectedCategory) {
      console.log('Added expense:', amount, memo);
      navigation.navigate('Home', {
        category: selectedCategory.name,
        icon: selectedCategory.icon,
        amount,
        memo,
        income: income || 0, // Use 0 if income is not provided
        isExpense: true
      });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowInputs(true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderItem = (category) => (
    <TouchableOpacity style={styles.categoryItem} key={category.name} onPress={() => handleCategorySelect(category)}>
      <View style={styles.categoryBox}>
        <MaterialCommunityIcons name={category.icon} size={20} color="#3F5D32" />
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategories = () => {
    if (Platform.OS === 'android') {
      return categories.map((category, index) => (
        <View style={[styles.categoryColumnAndroid, { width: '45%' }]} key={index}>
          {renderItem(category)}
        </View>
      ));
    } else {
      return categories.map((category, index) => (
        <View style={[styles.categoryColumnWeb, { width: '18%', margin: '0.5%' }]} key={index}>
          {renderItem(category)}
        </View>
      ));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.categoryContainer}>{renderCategories()}</View>
        <Modal visible={showInputs} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={(text) => setAmount(text)}
              placeholder="Amount"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={memo}
              onChangeText={(text) => setMemo(text)}
              placeholder="Memo"
              multiline
            />
            <TextInput
              style={styles.input}
              value={income}
              onChangeText={(text) => setIncome(text)}
              placeholder="Income"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryColumnWeb: {
    width: '18%',
  },
  categoryColumnAndroid: {
    width: '45%',
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    elevation: 2, // Shadow for Android
    shadowColor: '#3F5D32', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 4.00,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: '#3F5D32',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#3F5D32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Add;

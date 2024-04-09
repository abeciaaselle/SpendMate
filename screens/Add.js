import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Transportation', icon: 'bus' },
  { name: 'Groceries', icon: 'cart' },
  { name: 'Utilities', icon: 'water' },
  { name: 'Rent/Mortgage', icon: 'home' },
  { name: 'Dining Out', icon: 'food' },
  { name: 'Entertainment', icon: 'gamepad-variant' },
  { name: 'Clothing', icon: 'tshirt-crew' },
  { name: 'Health/Medical', icon: 'hospital' },
  { name: 'Education', icon: 'school' },
  { name: 'Insurance', icon: 'shield' },
  { name: 'Gifts/Donations', icon: 'gift' },
  { name: 'Personal Care', icon: 'human-male-female' },
  { name: 'Subscriptions', icon: 'credit-card-plus' },
  { name: 'Travel', icon: 'airplane' },
  { name: 'Miscellaneous', icon: 'plus-circle' }
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={[styles.categoryItem, width > 500 ? styles.largeScreen : styles.smallScreen]} onPress={() => handleCategorySelect(category)}>
              <View style={styles.categoryBox}>
                <MaterialCommunityIcons name={category.icon} size={28} color="white" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Modal visible={showInputs} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={text => setAmount(text)}
              placeholder="Amount"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={memo}
              onChangeText={text => setMemo(text)}
              placeholder="Memo"
              multiline
            />
            <TextInput
              style={styles.input}
              value={income}
              onChangeText={text => setIncome(text)}
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
    fontSize: 24,
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
  categoryItem: {
    width: '48%',
    marginBottom: 20,
  },
  largeScreen: {
    width: '23%',
  },
  smallScreen: {
    width: '31%',
  },
  categoryBox: {
    alignItems: 'center',
    backgroundColor: '#3F5D32',
    borderRadius: 5,
    padding: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
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

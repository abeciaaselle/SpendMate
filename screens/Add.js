// Add.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

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
      navigation.navigate('Home', { name: selectedCategory.name, amount, memo, income, isExpense: true });
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
            <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelect(category)}>
              <MaterialCommunityIcons name={category.icon} size={28} color="#3F5D32" />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {showInputs && (
          <>
            <TextInput
              style={styles.calculatorInput}
              value={amount}
              onChangeText={text => setAmount(text)}
              placeholder="0"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={memo}
              onChangeText={text => setMemo(text)}
              placeholder="Add memo"
              multiline
            />
            <TextInput
              style={styles.input}
              value={income}
              onChangeText={text => setIncome(text)}
              placeholder="Monthly Income"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </>
        )}
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
    alignItems: 'center',
    marginBottom: 20,
    width: '48%',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  calculatorInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3F5D32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Add;

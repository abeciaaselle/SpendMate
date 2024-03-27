import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import moment from 'moment';
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

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [userName, setUserName] = useState('');

  const { name, amount, memo, category, income } = route.params || {};

  useEffect(() => {
    if (amount) {
      const newExpense = { category, amount: parseFloat(amount), memo, date: new Date() };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      setTotalExpense(prevTotalExpense => prevTotalExpense + parseFloat(amount));
    }
  }, [amount]);

  useEffect(() => {
    if (income) {
      setTotalIncome(prevTotalIncome => prevTotalIncome + parseFloat(income));
    }
  }, [income]);

  useEffect(() => {
    if (route.params.userName) {
      setUserName(route.params.userName);
    }
  }, [route.params.userName]);

  // Render expense items
  const renderExpenseItems = () => {
    return expenses.map((expense, index) => (
      <View key={index} style={styles.expenseItem}>
        <MaterialCommunityIcons name={getCategoryIcon(expense.category)} size={24} color="#3F5D32" />
        <View style={styles.expenseData}>
          <Text style={styles.expenseLabel}>{expense.category}</Text>
          <Text style={styles.expenseMemo}>{expense.memo}</Text>
          <Text style={styles.expenseTime}>{moment(expense.date).format('HH:mm')}</Text>
        </View>
        <Text style={styles.expenseAmount}>₱{expense.amount.toFixed(2)}</Text>
      </View>
    ));
  };

  // Function to get category icon
  const getCategoryIcon = (categoryName) => {
    const foundCategory = categories.find(cat => cat.name === categoryName);
    return foundCategory ? foundCategory.icon : 'plus-circle';
  };

  const handleAddExpense = () => {
    navigation.navigate('Add');
  };

  // Dynamically set data title with current date
  const currentDate = moment().format('MMMM DD');
  const dataTitle = `Expenses for ${currentDate}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{userName}</Text>
        <View style={styles.dateContainer}>
          <Picker
            selectedValue={selectedMonth}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}>
            <Picker.Item label="January" value="January" />
            <Picker.Item label="February" value="February" />
            <Picker.Item label="March" value="March" />
            <Picker.Item label="April" value="April" />
            <Picker.Item label="May" value="May" />
            <Picker.Item label="June" value="June" />
            <Picker.Item label="July" value="July" />
            <Picker.Item label="August" value="August" />
            <Picker.Item label="September" value="September" />
            <Picker.Item label="October" value="October" />
            <Picker.Item label="November" value="November" />
            <Picker.Item label="December" value="December" />
          </Picker>
          <Picker
            selectedValue={selectedYear}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}>
            <Picker.Item label="2022" value="2022" />
            <Picker.Item label="2023" value="2023" />
            <Picker.Item label="2024" value="2024" />
            {/* Add more years if needed */}
          </Picker>
        </View>
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryData}>
          <Text style={styles.summaryLabel}>Total Expenses:</Text>
          <Text style={styles.summaryValue}>₱{totalExpense.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryData}>
          <Text style={styles.summaryLabel}>Income:</Text>
          <Text style={styles.summaryValue}>₱{totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryData}>
          <Text style={styles.summaryLabel}>Balance:</Text>
          <Text style={styles.summaryValue}>₱{(totalIncome - totalExpense).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>{dataTitle}</Text>
        {renderExpenseItems()}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryData: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
  },
  dataContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  expenseData: {
    flex: 1,
    marginRight: 10,
  },
  expenseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseMemo: {
    fontSize: 14,
    color: '#777777',
  },
  expenseTime: {
    fontSize: 12,
    color: '#777777',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3F5D32',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default HomeScreen;


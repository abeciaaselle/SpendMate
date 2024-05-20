import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, ScrollView, Platform, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { width } = Dimensions.get('window');

// Define categories array
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [userName, setUserName] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const { name, icon, amount, memo, category, income } = route.params || {};

  useEffect(() => {
    if (amount) {
      const newExpense = { id: expenses.length + 1, category, amount: parseFloat(amount), memo, date: new Date() };
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

  useEffect(() => {
    const dateStr = moment(selectedDate).format('YYYY-MM-DD');
    const markedDatesObj = { [dateStr]: { selected: true, marked: true, selectedColor: '#3F5D32' } };
    setMarkedDates(markedDatesObj);
  }, [selectedDate]);

  useEffect(() => {
    const balance = totalIncome - totalExpense;
    if (balance < 0) {
      Alert.alert(
        'Balance Exceeded Income!',
        `Your balance has exceeded your income by ₱${Math.abs(balance).toFixed(2)}.`
      );
    }
  }, [totalIncome, totalExpense]);

  const calculateTotalExpensesForDate = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    return expenses.reduce((total, expense) => {
      const expenseDate = moment(expense.date).format('YYYY-MM-DD');
      if (expenseDate === formattedDate) {
        return total + expense.amount;
      }
      return total;
    }, 0);
  };

  const handleDayPress = (dateString) => {
    const totalExpensesForDate = calculateTotalExpensesForDate(dateString);
    Alert.alert(`Total Expenses for ${dateString}: ₱${totalExpensesForDate.toFixed(2)}`);
  };

  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalVisible(true);
  };

  const confirmDeleteExpense = () => {
    const newExpenses = expenses.filter(exp => exp !== expenseToDelete);
    const deletedAmount = expenseToDelete.amount;
    setExpenses(newExpenses);
    setTotalExpense(prevTotalExpense => prevTotalExpense - deletedAmount);
    setDeleteModalVisible(false);
  };

  const renderExpenseItems = () => {
    return expenses.map((expense, index) => (
      <View key={expense.id + index} style={styles.expenseItem}>
        <MaterialCommunityIcons name={getCategoryIcon(expense.category)} size={24} color="#3F5D32" />
        <View style={styles.expenseData}>
          <Text style={styles.expenseLabel}>{expense.category}</Text>
          <Text style={styles.expenseTime}>{moment(expense.date).format('HH:mm')}</Text>
        </View>
        <Text style={styles.expenseMemo}>{expense.memo || ' '}</Text>
        <Text style={styles.expenseAmount}>{expense.amount < 0 ? '-' : ''}₱{Math.abs(expense.amount).toFixed(2)}</Text>
        <TouchableOpacity onPress={() => handleEditExpense(expense)}>
          <MaterialCommunityIcons name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteExpense(expense)}>
          <MaterialCommunityIcons name="delete" size={20} color="black" />
        </TouchableOpacity>
      </View>
    ));
  };

  const getCategoryIcon = (categoryName) => {
    const foundCategory = categories.find(cat => cat.name === categoryName);
    return foundCategory ? foundCategory.icon : 'plus-circle';
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editAmount) {
      Alert.alert('Please enter amount.');
      return;
    }
    const editedExpenses = expenses.map(exp => {
      if (exp === editExpense) {
        return { ...exp, amount: parseFloat(editAmount) };
      }
      return exp;
    });
    const difference = parseFloat(editAmount) - editExpense.amount;
    setExpenses(editedExpenses);
    setTotalExpense(prevTotalExpense => prevTotalExpense + difference);
    setEditModalVisible(false);
  };

  const addButtonStyle = {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#3F5D32',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  };

  // Store data to AsyncStorage
  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('expenseData', JSON.stringify(expenses));
      } catch (error) {
        console.error('Error storing expense data:', error);
      }
    };

    storeData();

    return () => {
      // Cleanup if needed
    };
  }, [expenses]);

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.backgroundImage}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{userName}</Text>
            <View style={styles.calendarContainer}>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                minDate={'2010-01-01'}
                maxDate={'2050-12-31'}
                onDayPress={(day) => handleDayPress(day.dateString)}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: 'white',
                  selectedDayTextColor: 'white',
                  todayTextColor: 'white',
                  arrowColor: '#000000',
                }}
                style={{ width: width - 40, alignSelf: 'center' }}
              />
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryData}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, { color: 'black' }]}>₱{totalExpense.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryData}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryValue}>₱{totalIncome.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryData}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={[styles.summaryValue, { color: totalIncome - totalExpense < 0 ? 'red' : 'black' }]}>₱{(totalIncome - totalExpense).toFixed(2)}</Text>
            </View>
          </View>

          {Platform.OS === 'android' ? (
            <View style={styles.expenseContainer}>
              <Text style={styles.dataTitle}>Expenses for {moment(selectedDate).format('MMMM DD, YYYY')}</Text>
              {renderExpenseItems()}
            </View>
          ) : (
            <View style={styles.expenseContainer}>
              <Text style={styles.dataTitle}>Expenses for {moment(selectedDate).format('MMMM DD, YYYY')}</Text>
              {renderExpenseItems()}
            </View>
          )}

        </View>
      </ScrollView>

      <TouchableOpacity style={addButtonStyle} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this expense?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={confirmDeleteExpense} style={[styles.modalButton, { backgroundColor: '#3F5D32' }]}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={[styles.modalButton, { backgroundColor: 'green' }]}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Edit Expense Amount:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEditAmount}
              value={editAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSaveEdit} style={[styles.modalButton, { backgroundColor: 'green' }]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#3F5D32' }]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    alignContent: 'center'
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendarContainer: {
    borderRadius: 10,
    backgroundColor: '#3F5D32',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  scrollContainer: {
    flex: 1,
  },
  expenseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    marginBottom: 20,
  },
  dataTitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    flex: 1,
  },
  expenseTime: {
    fontSize: 12,
    color: '#777777',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  addButtonIcon: {
    fontSize: 24,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;

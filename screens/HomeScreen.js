import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

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

  const { name, icon, amount, memo, category, income } = route.params || {};

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

  useEffect(() => {
    const dateStr = moment(selectedDate).format('YYYY-MM-DD');
    const markedDatesObj = { [dateStr]: { selected: true, marked: true, selectedColor: '#3F5D32' } };
    setMarkedDates(markedDatesObj);
  }, [selectedDate]);

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

  const renderExpenseItems = () => {
    return expenses.map((expense, index) => (
      <View key={index} style={styles.expenseItem}>
        <MaterialCommunityIcons name={getCategoryIcon(expense.category)} size={24} color="#3F5D32" />
        <View style={styles.expenseData}>
          <Text style={styles.expenseLabel}>{expense.category}</Text>
          <Text style={styles.expenseTime}>{moment(expense.date).format('HH:mm')}</Text>
        </View>
        <Text style={styles.expenseMemo}>{expense.memo || ' '}</Text>
        <Text style={styles.expenseAmount}>{expense.amount < 0 ? '-' : ''}₱{Math.abs(expense.amount).toFixed(2)}</Text>
      </View>
    ));
  };

  const getCategoryIcon = (categoryName) => {
    const foundCategory = categories.find(cat => cat.name === categoryName);
    return foundCategory ? foundCategory.icon : 'plus-circle';
  };

  const handleAddExpense = () => {
    navigation.navigate('Add');
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
              <Text style={styles.summaryValue}>₱{(totalIncome - totalExpense).toFixed(2)}</Text>
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

      <TouchableOpacity style={addButtonStyle} onPress={handleAddExpense}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>
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
});

export default HomeScreen;
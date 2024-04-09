import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars'; // Import Calendar component
import moment from 'moment';


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
    // Calculate total expenses for the selected date
    const totalExpensesForDate = calculateTotalExpensesForDate(dateString);
    // Display total expenses
    Alert.alert(`Total Expenses for ${dateString}: ₱${totalExpensesForDate.toFixed(2)}`);
  };

  // Render expense items
  const renderExpenseItems = () => {
    const filteredExpenses = expenses.filter(expense => moment(expense.date).isSame(selectedDate, 'day'));
    return filteredExpenses.map((expense, index) => (
      <View key={index} style={styles.expenseItem}>
        <MaterialCommunityIcons name={getCategoryIcon(expense.category)} size={24} color="#3F5D32" />
        <View style={styles.expenseData}>
          <Text style={styles.expenseLabel}>{expense.category}</Text>
          <Text style={styles.expenseTime}>{moment(expense.date).format('HH:mm')}</Text>
        </View>
        <Text style={styles.expenseMemo}>{expense.memo || ' '}</Text>
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

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{userName}</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              minDate={'2010-01-01'} // Adjust minDate as needed
              maxDate={'2050-12-31'} // Adjust maxDate as needed
              onDayPress={(day) => handleDayPress(day.dateString)}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: 'white',
                selectedDayTextColor: 'white',
                todayTextColor: 'white',
                arrowColor: '#000000',
              }}
              style={{ width: width - 40, alignSelf: 'center' }} // Adjust calendar width
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

        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Expenses for {moment(selectedDate).format('MMMM DD, YYYY')}</Text>
          {renderExpenseItems()}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make the container background transparent to let the background image show
    padding: 20,
    alignContent: 'center'
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendarContainer: {
    borderRadius: 10, // Add border radius
    backgroundColor: '#3F5D32', // Add background color
    elevation: 3, // Add elevation for Android
    shadowColor: '#000', // Add shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset for iOS
    shadowOpacity: 0.25, // Add shadow opacity for iOS
    shadowRadius: 3.84, // Add shadow radius for iOS
    overflow: 'hidden', // Ensure the content is clipped to the rounded border
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    alignItems: 'center', // Center horizontally
    paddingHorizontal: 20, // Add horizontal padding
    borderRadius: 10, // Add border radius
    backgroundColor: '#FFFFFF', // Add background color
    elevation: 3, // Add elevation for Android
    shadowColor: '#000', // Add shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset for iOS
    shadowOpacity: 0.25, // Add shadow opacity for iOS
    shadowRadius: 3.84, // Add shadow radius for iOS
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
    borderRadius: 10, // Add border radius
    backgroundColor: '#FFFFFF', // Add background color
    elevation: 3, // Add elevation for Android
    shadowColor: '#000', // Add shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset for iOS
    shadowOpacity: 0.25, // Add shadow opacity for iOS
    shadowRadius: 3.84, // Add shadow radius for iOS
    overflow: 'hidden', 
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
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
  },
  addButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 999, // Ensure the button is above other content
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default HomeScreen;
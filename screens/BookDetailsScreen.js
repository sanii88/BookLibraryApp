import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { useRoute, useIsFocused, useNavigation } from '@react-navigation/native';

const BookDetailsScreen = () => {
  const route = useRoute();
  const { book } = route.params;
  const [isBorrowed, setIsBorrowed] = useState(book.isBorrowed);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        console.log('Fetching borrowed books from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'borrowedBooks'));
        setBorrowedCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    if (isFocused) {
      fetchBorrowedBooks();
    }
  }, [isFocused]);

  const handleBorrow = async () => {
    if (borrowedCount >= 3) {
      Alert.alert('Limit Reached', 'You cannot borrow more than 3 books.');
      return;
    }

    try {
      // Adding book to the borrowedBooks collection
      await addDoc(collection(db, 'borrowedBooks'), {
        bookId: book.id,
        title: book.title,
        author: book.author,
      });

      // Updating isBorrowed field in the books collection
      await updateDoc(doc(db, 'books', book.id), { isBorrowed: true });

      setIsBorrowed(true);
      setBorrowedCount(prev => prev + 1);
      Alert.alert('Success', 'Book borrowed successfully!');
      navigation.navigate('BorrowedBooks'); 
    } catch (error) {
      console.error('Error borrowing book:', error);
      Alert.alert('Error', 'Failed to borrow the book. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.description}>{book.description}</Text>
      {!isBorrowed && <Button title="Borrow" onPress={handleBorrow} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  author: { fontSize: 18, color: '#666', marginBottom: 16 },
  description: { fontSize: 16 },
});

export default BookDetailsScreen;
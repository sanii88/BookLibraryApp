import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native'; // Added Alert here
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const BorrowedBooksScreen = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        console.log('Fetching borrowed books from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'borrowedBooks'));
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched borrowed books:', booksData);
        setBorrowedBooks(booksData);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    if (isFocused) {
      fetchBorrowedBooks();
    }
  }, [isFocused]);

  const handleReturn = async (bookId) => {
    try {
      // Removing book from the borrowedBooks collection
      await deleteDoc(doc(db, 'borrowedBooks', bookId));

      // Updating isBorrowed field in the books collection
      const book = borrowedBooks.find(b => b.id === bookId);
      if (book) {
        await updateDoc(doc(db, 'books', book.bookId), { isBorrowed: false });
      }

      // Updating the local state
      setBorrowedBooks(prev => prev.filter(b => b.id !== bookId));
      Alert.alert('Success', 'Book returned successfully!'); // Fixed Alert usage
    } catch (error) {
      console.error('Error returning book:', error);
      Alert.alert('Error', 'Failed to return the book. Please try again.'); // Fixed Alert usage
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <TouchableOpacity onPress={() => handleReturn(item.id)}>
        <Text style={styles.returnButton}>Return</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        title="Back to Book List"
        onPress={() => navigation.navigate('BookList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 18, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#666' },
  returnButton: { color: 'red', marginTop: 8 },
});

export default BorrowedBooksScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const BookListScreen = () => {
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Fetching books from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'books'));
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched books:', booksData);
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    if (isFocused) {
      fetchBooks();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <View style={styles.bookInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
      {item.isBorrowed ? (
        <Text style={styles.unavailableLabel}>Unavailable</Text>
      ) : (
        <Text style={styles.availableLabel}>Available</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        title="View Borrowed Books"
        onPress={() => navigation.navigate('BorrowedBooks')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#666' },
  availableLabel: {
    color: 'green',
    fontWeight: 'bold',
  },
  unavailableLabel: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default BookListScreen;
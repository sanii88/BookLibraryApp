# BookLibrary App

## Overview
The **BookLibrary App** is a React Native application designed to help users explore and borrow books. It consists of three main screens:

1. **Book List Screen**: Displays a list of books fetched from Firebase. Users can browse books and select one to view more details.

2. **Book Details Screen**: Shows detailed information about the selected book, such as title, author, and description. Users can borrow the book from this screen, with a limit of three books at a time. If the limit is exceeded, an appropriate message is displayed.

3. **Borrowed Books Screen**: Lists all books currently borrowed by the user. Users can return books from this screen, freeing up their borrowing limit.

The app uses **React Navigation** for seamless navigation between screens and **Firebase** as the backend to manage book data.
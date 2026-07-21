import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USERS: 'aquaLog_users',
  ACTIVE_USER: 'aquaLog_activeUser',
  USER_DATA_PREFIX: 'aquaLog_data_',
};

// Get all registered usernames
export const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Add a new username to the users array
export const addUser = async (username) => {
  try {
    const users = await getUsers();
    if (!users.includes(username)) {
      users.push(username);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Check if a username exists
export const userExists = async (username) => {
  const users = await getUsers();
  return users.includes(username);
};

// Get the active user
export const getActiveUser = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
  } catch (error) {
    console.error('Error getting active user:', error);
    return null;
  }
};

// Set the active user
export const setActiveUser = async (username) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_USER, username);
  } catch (error) {
    console.error('Error setting active user:', error);
    throw error;
  }
};

// Clear the active user (for switching users)
export const clearActiveUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  } catch (error) {
    console.error('Error clearing active user:', error);
    throw error;
  }
};

// Get user data
export const getUserData = async (username) => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA_PREFIX + username);
    return dataJson ? JSON.parse(dataJson) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Save user data
export const saveUserData = async (username, userData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA_PREFIX + username,
      JSON.stringify(userData)
    );
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Delete user data
export const deleteUserData = async (username) => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA_PREFIX + username);
    // Remove from users array
    const users = await getUsers();
    const updatedUsers = users.filter(u => u !== username);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

// Reset all data (for testing/debugging)
export const resetAllData = async () => {
  try {
    const users = await getUsers();
    for (const user of users) {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA_PREFIX + user);
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.USERS);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  } catch (error) {
    console.error('Error resetting all data:', error);
    throw error;
  }
};

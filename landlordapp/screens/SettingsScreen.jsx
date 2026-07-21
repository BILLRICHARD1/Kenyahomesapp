import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Clock,
  Database,
  Info,
  ChevronRight,
  LogOut,
  Trash2,
  RefreshCw,
  Ruler,
} from 'lucide-react-native';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { ozToMl, mlToOz, suggestDailyGoal, convertAmount } from '../utils/waterUtils';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { userData, updateUserData, resetTodayLog, resetAllData, switchUser } = useUser();
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingWakeTime, setEditingWakeTime] = useState(false);
  const [editingSleepTime, setEditingSleepTime] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  const [tempGoal, setTempGoal] = useState('');
  const [tempWakeTime, setTempWakeTime] = useState('');
  const [tempSleepTime, setTempSleepTime] = useState('');

  if (!userData) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  const handleWeightSave = async () => {
    const weight = parseFloat(tempWeight);
    if (weight > 20 && weight < 300) {
      await updateUserData({ weight });
      setEditingWeight(false);
      setTempWeight('');
    } else {
      Alert.alert('Invalid Weight', 'Please enter a valid weight (20-300 kg)');
    }
  };

  const handleGoalSave = async () => {
    const goal = parseInt(tempGoal);
    if (goal > 500 && goal < 10000) {
      await updateUserData({ dailyGoal: goal });
      setEditingGoal(false);
      setTempGoal('');
    } else {
      Alert.alert('Invalid Goal', 'Please enter a valid daily goal (500-10000 ml)');
    }
  };

  const handleWakeTimeSave = async () => {
    if (tempWakeTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      await updateUserData({ wakeTime: tempWakeTime });
      setEditingWakeTime(false);
      setTempWakeTime('');
    } else {
      Alert.alert('Invalid Time', 'Please enter a valid time (HH:MM)');
    }
  };

  const handleSleepTimeSave = async () => {
    if (tempSleepTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      await updateUserData({ sleepTime: tempSleepTime });
      setEditingSleepTime(false);
      setTempSleepTime('');
    } else {
      Alert.alert('Invalid Time', 'Please enter a valid time (HH:MM)');
    }
  };

  const handleUnitToggle = async () => {
    const newUnit = userData.unit === 'glasses' ? 'oz' : 'glasses';
    await updateUserData({ unit: newUnit });
  };

  const handleResetToday = () => {
    Alert.alert(
      'Reset Today\'s Log',
      'Are you sure you want to reset all water entries for today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetTodayLog,
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your hydration history and streak data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetAllData,
        },
      ]
    );
  };

  const handleSwitchUser = () => {
    Alert.alert(
      'Switch User',
      'This will log you out. Your data will be saved. You can create a new profile or switch to another user.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () => {
            switchUser();
            navigation.replace('Onboarding');
          },
        },
      ]
    );
  };

  const Section = ({ title, icon: Icon, children }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-4">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
          <Icon size={18} color="#22c55e" />
        </View>
        <Text className="text-gray-800 font-bold text-xl ml-3">{title}</Text>
      </View>
      <View className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ label, value, onPress, showArrow = true, danger = false }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row justify-between items-center p-5 ${danger ? '' : 'border-b border-gray-100'}`}
    >
      <Text className="text-gray-800 font-semibold flex-1 text-base">{label}</Text>
      <View className="flex-row items-center">
        <Text className={`font-medium mr-2 ${danger ? 'text-red-500' : 'text-gray-500'}`}>{value}</Text>
        {showArrow && <ChevronRight size={20} color="#d1d5db" />}
      </View>
    </TouchableOpacity>
  );

  const getUnitDisplay = (unit) => {
    switch(unit) {
      case 'glasses': return 'Glasses';
      case 'oz': return 'Ounces (oz)';
      default: return unit;
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#22c55e', '#16a34a']}
        className="px-6 pt-12 pb-8 rounded-b-3xl"
      >
        <Text className="text-white text-3xl font-bold">Settings</Text>
        <Text className="text-white/80 mt-1">Customize your AquaLog experience</Text>
      </LinearGradient>

      {/* Profile Section */}
      <View className="px-6 mt-6">
        <Section title="Profile" icon={User}>
          <View className="p-5 border-b border-gray-100">
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Username</Text>
            <Text className="text-gray-800 font-bold text-2xl">{userData.username}</Text>
          </View>
          <SettingItem
            label="Weight"
            value={`${userData.weight} kg`}
            onPress={() => {
              setTempWeight(userData.weight.toString());
              setEditingWeight(true);
            }}
          />
          <SettingItem
            label="Daily Goal"
            value={`${convertAmount(userData.dailyGoal, userData.unit)} ${userData.unit}`}
            onPress={() => {
              setTempGoal(userData.dailyGoal.toString());
              setEditingGoal(true);
            }}
          />
          <SettingItem
            label="Measurement Unit"
            value={getUnitDisplay(userData.unit)}
            onPress={handleUnitToggle}
          />
        </Section>
      </View>

      {/* Schedule Section */}
      <View className="px-6">
        <Section title="Schedule" icon={Clock}>
          <SettingItem
            label="Wake Time"
            value={userData.wakeTime}
            onPress={() => {
              setTempWakeTime(userData.wakeTime);
              setEditingWakeTime(true);
            }}
          />
          <SettingItem
            label="Sleep Time"
            value={userData.sleepTime}
            onPress={() => {
              setTempSleepTime(userData.sleepTime);
              setEditingSleepTime(true);
            }}
          />
        </Section>
      </View>

      {/* Data Section */}
      <View className="px-6">
        <Section title="Data Management" icon={Database}>
          <SettingItem
            label="Reset Today's Log"
            value="Clear entries"
            onPress={handleResetToday}
            showArrow={true}
            danger
          />
          <SettingItem
            label="Reset All My Data"
            value="Delete everything"
            onPress={handleResetAll}
            showArrow={true}
            danger
          />
          <SettingItem
            label="Switch User"
            value="Log out"
            onPress={handleSwitchUser}
            showArrow={true}
          />
        </Section>
      </View>

      {/* About Section */}
      <View className="px-6">
        <Section title="About" icon={Info}>
          <View className="p-5 border-b border-gray-100">
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Version</Text>
            <Text className="text-gray-800 font-bold text-lg">1.0.0</Text>
          </View>
          <View className="p-5">
            <Text className="text-gray-800 font-bold text-xl mb-1">AquaLog</Text>
            <Text className="text-gray-500">Stay hydrated. Every day.</Text>
          </View>
        </Section>
      </View>

      <View className="h-12" />

      {/* Weight Edit Modal */}
      <Modal
        visible={editingWeight}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingWeight(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full shadow-2xl">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Edit Weight</Text>
            <Text className="text-gray-500 mb-6">Enter your weight in kilograms</Text>
            <TextInput
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 text-2xl text-gray-800 mb-6 font-semibold text-center"
              placeholder="0"
              value={tempWeight}
              onChangeText={setTempWeight}
              keyboardType="numeric"
              autoFocus
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setEditingWeight(false)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl"
              >
                <Text className="text-center text-gray-700 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleWeightSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-2xl shadow-lg"
              >
                <Text className="text-center text-white font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Edit Modal */}
      <Modal
        visible={editingGoal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingGoal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full shadow-2xl">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Edit Daily Goal</Text>
            <Text className="text-gray-500 mb-6">Enter your goal in {userData.unit}</Text>
            <TextInput
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 text-2xl text-gray-800 mb-6 font-semibold text-center"
              placeholder="0"
              value={tempGoal}
              onChangeText={setTempGoal}
              keyboardType="numeric"
              autoFocus
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setEditingGoal(false)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl"
              >
                <Text className="text-center text-gray-700 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGoalSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-2xl shadow-lg"
              >
                <Text className="text-center text-white font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wake Time Edit Modal */}
      <Modal
        visible={editingWakeTime}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingWakeTime(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full shadow-2xl">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Edit Wake Time</Text>
            <Text className="text-gray-500 mb-6">Enter time in HH:MM format</Text>
            <TextInput
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 text-2xl text-gray-800 mb-6 font-semibold text-center"
              placeholder="06:00"
              value={tempWakeTime}
              onChangeText={setTempWakeTime}
              autoFocus
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setEditingWakeTime(false)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl"
              >
                <Text className="text-center text-gray-700 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleWakeTimeSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-2xl shadow-lg"
              >
                <Text className="text-center text-white font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sleep Time Edit Modal */}
      <Modal
        visible={editingSleepTime}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingSleepTime(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full shadow-2xl">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Edit Sleep Time</Text>
            <Text className="text-gray-500 mb-6">Enter time in HH:MM format</Text>
            <TextInput
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 text-2xl text-gray-800 mb-6 font-semibold text-center"
              placeholder="22:00"
              value={tempSleepTime}
              onChangeText={setTempSleepTime}
              autoFocus
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setEditingSleepTime(false)}
                className="flex-1 bg-gray-100 py-4 rounded-2xl"
              >
                <Text className="text-center text-gray-700 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSleepTimeSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-2xl shadow-lg"
              >
                <Text className="text-center text-white font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SettingsScreen;
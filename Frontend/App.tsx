import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import './global.css';
import HomePage from './components/HomePage';

export default function App() {
  return (
    <View className='flex-1'>
      <HomePage/>
      <StatusBar style="light" />
    </View>
  );
}

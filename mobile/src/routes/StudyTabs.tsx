import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CoachList from '../pages/CoachList';
import Favorites from '../pages/Favorites';

const { Navigator, Screen } = createBottomTabNavigator();

function StudyTabs() {
  return (
    <Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        }
        return <Ionicons name="ios-easel" size={size} color={focused ? '#8257e5' : color}/>;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
    >
      <Screen 
        name="CoachList" 
        component={CoachList} 
        options={{
          tabBarLabel: 'Coaches',
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons name="ios-easel" size={size} color={focused ? '#8257e5' : color}/>
            );
          }
        }}
      />

    <Screen 
        name="Favorites" 
        component={Favorites} 
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons name="ios-heart" size={size} color={focused ? '#8257e5' : color}/>
            );
          }
        }}
      />
    

    </Navigator>
  );
}

export default StudyTabs;
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from 'react';

export default function TabsLayout() {
    // (deprecated, old feature) function that returns the header right component, which is a button that navigates to the profile screen when pressed
    // const headerRight = () => {
    //     return (
    //     <TouchableOpacity style={{ marginRight: 20 }} onPress={() => router.push("/profile")}>
    //         <Ionicons name="people" size={24} color="#FFFFFF" />
    //     </TouchableOpacity>
    //     );
    // };

    return <Tabs
        // Header properties
        screenOptions={{ 
            tabBarActiveTintColor: "#064E3B",
            headerStyle: { backgroundColor: "#064E3B" },
            headerShadowVisible: false,
            headerTintColor: "#FFFFFF",
            tabBarStyle: { backgroundColor: "#e1f6e6" },
            // headerRight: () => headerRight()
        }}
    >
        {/* The three bottom row buttons */}
        <Tabs.Screen 
            name="index" 
            options={{ title: "Home", tabBarIcon: ({ color }) => 
            <Ionicons name="home" color={color} size={24} /> }} 
        />
        <Tabs.Screen 
            name="add_products" 
            options={{ title: "Add Products", tabBarIcon: ({ color }) => 
            <Ionicons name="add" color={color} size={24} /> }} 
        />
        <Tabs.Screen 
            name="friends" 
            options={{ title: "Friends", tabBarIcon: ({ color }) => 
            <Ionicons name="people" color={color} size={24} /> }} 
        />
    </Tabs>
}
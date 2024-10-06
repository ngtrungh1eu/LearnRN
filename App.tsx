import React from "react";
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import FavoriteScreenList from "./src/screens/FavoriteScreenList";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteProvider } from "./src/contexts/FavoriteContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;
        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Favorites") {
          iconName = focused ? "heart" : "heart-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: true,
        headerTitleAlign: "left",
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoriteScreenList}
      options={{
        headerShown: true,
        headerTitleAlign: "left",
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <FavoriteProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={HomeTabs}
              options={{
                headerShown: false,
                headerTitle: "Camera Shop",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: { backgroundColor: "green" },
                headerMode: "float",
              }}
            />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{}} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </FavoriteProvider>
  );
}

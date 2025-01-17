import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./src/routes/AppNavigator";
import { AuthContextProvider } from "./src/auth/AuthContext";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#faf6f4",
  },
};

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}

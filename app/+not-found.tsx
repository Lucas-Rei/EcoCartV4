import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

// Page that is shown when the app tries to navigate to a page that doesn't exist
export default function NotFound() {
  return (
    <>
        <Stack.Screen options={{ title: "Page Not Found" }} />
        <View style={styles.container}>
            <Link href="/" style={styles.button}>
                Go to home page
            </Link>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: "#FFFFFF"
  }
});
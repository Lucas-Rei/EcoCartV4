import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// (deprecated, old feature) A modal screen that allowed us to add new products into the database through the app
export default function Modal() {
    const {id} = useLocalSearchParams();
    const [name, setName] = useState("");
    const [score, setScore] = useState("");

    const [editmode, setEditmode] = useState(false);

    const db = useSQLiteContext();
    // console.log("SQLite context in modal:", db);

    useEffect(() => {
        if (id) {
            setEditmode(true);
            loadData();
        }
    }, [id]);

    // similar to loadData in index.tsx but it only takes the product with the given id and stores the other variables the same
    const loadData = async () => {
        const loadResult = await db.getFirstAsync<{name:string, score:number}>
            ("SELECT name, score FROM products WHERE id = ?;", [parseInt(id as string)]);
        if (loadResult) {
            setName(loadResult.name);
            setScore(loadResult.score.toString());
        }
    };

    // Runs when save button is pressed and save the new product to the database
    const handleSave = async () => {
        try {
            db.runAsync("INSERT INTO products (name, score) VALUES (?, ?);", [name, score]);
            router.back();
        }
        catch (error) {
            console.error("Error saving product:", error);
        }
        finally {
            setName("");
            setScore("");
        }
    }

    // Will run in place of handleSave when in edit mode, updating the product's name and score with the given id
    const handleUpdate = async () => {
        try {
            db.runAsync("UPDATE products SET name = ?, score = ? WHERE id = ?;", 
                [name, score, parseInt(id as string)]);
            router.back();
        }
        catch (error) {
            console.error("Error updating product:", error);
        }
        finally {
            setName("");
            setScore("");
        }
    }


    return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerTitle: "Modal" }} />
        <Text style={styles.text}>Add new product:</Text>
        <View style={{ flex:0.4 , flexDirection: "row", gap: 50, paddingTop: 20 }}>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.textInput}
            />
            <TextInput
                placeholder="Score"
                value={score}
                onChangeText={(text) => setScore(text)}
                keyboardType="numeric"
                style={styles.textInput}
            />

        </View>
        <View style={{ flex:1 , flexDirection: "row", gap: 50 }}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.button}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => editmode ? handleUpdate() : handleSave()}>
                <Text style={styles.button}>{editmode ? "Update" : "Save"}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#000000"
  },
  textInput: {
    width: 150,
    height: 50,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 5,
  },
  button: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: "#000000"
  }
});
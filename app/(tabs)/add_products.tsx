import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

type ProductType = { id:number, name: string, score: number, image: string };
export default function AddProducts() {
  const [data, setData] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const accountId = 0; // Placeholder for the current user's account ID

  const db = useSQLiteContext();

  // function that loads the info from the database into the variable data, using the search var to filter
  const loadData = async (searchtext: string) => {
    const loadResult = await db.getAllAsync<ProductType>("SELECT * FROM products WHERE name LIKE ?;", [`%${searchtext}%`]);
    setData(loadResult);
  };

  // function that runs each time the search text changes, reloading the data
  const handleSearchChange = (text: string) => {
    loadData(text);
    // console.log("Search text changed:", text);
    // console.log("Current search state:", search);
  }

  // Handle search change whenever the search var changes
  useEffect(() => {
    handleSearchChange(search); 
  }, [search]);

  // (deprecated, old feature) function that returns the header right component, which is a button that navigates to the modal screen when pressed 
  // const headerRight = () => {
  //   return (
  //     <TouchableOpacity style={{ marginRight: 20 }} onPress={() => router.push("/modal")}>
  //       <Ionicons name="bar-chart" size={24} color="#FFFFFF" />
  //     </TouchableOpacity>
  //   );
  // };

  // (deprecated, old feature) function that deletes a product from the database given an id 
  // const handleDelete = async (id: number) => {
  //   try {
  //     await db.runAsync("DELETE FROM products WHERE id = ?;", [id]);
  //     loadData(search); // Refresh the data after deletion
  //   }
  //   catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // }

  // Update the quantity of a product in the cart, ensuring it doesn't go below 0
  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Checkout function, inserts product scores into database and updates users average score
  const checkout = async () => {
    try {
      // Insert a score for each product based on the quantity selected
      for (const [id, quantity] of Object.entries(quantities)) {
        const result = await db.getFirstAsync<{ score: number }>("SELECT score FROM products WHERE id = ?;", [id]);
        const score = result?.score ?? 0;

        for (let i = 0; i < quantity; i++) {
          await db.runAsync("INSERT INTO scores (account_id, score) VALUES (?, ?);", [accountId, score]);
        }
      }
      // Calculating new average score of the user
      const avgScoreResult = await db.getFirstAsync<{ avgScore: number }>("SELECT AVG(score) as avgScore FROM scores WHERE account_id = ?;", [accountId]);
      const avgScore = avgScoreResult?.avgScore ?? 0;
      console.log("Inserting into average scores table: ", avgScore);

      // Insert the average score along with the current local timestamp into the avgscores table
      await db.runAsync("INSERT INTO avgscores (account_id, avgscore, timestamp) VALUES (?, ?, ?);", [accountId, avgScore, new Date().toISOString()]);

      // Clear quantities and search bar after checkout
      setQuantities({});
      setSearch("");

      // Show a toast notification at bottom of screen
      ToastAndroid.showWithGravityAndOffset("Checkout successful!", ToastAndroid.SHORT, ToastAndroid.CENTER, 0, 100);

      // Go back to home page
      router.push("/");
    }
    catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  // Renders a product on the FlatList
  const renderItem = ({ item }: { item: ProductType }) => {
    const quantity = quantities[item.id] || 0;
    // console.log("Rendering item:", item, "with quantity:", quantity);

    return (
      <View style={styles.card}>
        {/* Product image */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Product name and score */}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.score}>
            Sustainability score: {item.score}
          </Text>
        </View>

        {/* Plus and minus buttons */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // This is the actual UI code that gets passed to the screen
  return (
    <View style={{flex:1}}>
      <View style={{flex:0.4}}>
        <View style={{flex:1, alignItems: "center", justifyContent: "center", backgroundColor: "#064E3B", padding: 20}}>
          <Text style={styles.text}>Welcome to the products page!</Text>
          {/* Searchbar */}
          <TextInput 
            placeholder="Search products..." 
            style={styles.searchInput} 
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#FFFFFF"
          />
          {/* Checkout button */}
          <TouchableOpacity style={styles.checkoutButton} onPress={async () => {checkout()}}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
            <Ionicons name="cart" size={20} color="#064E3B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList contentContainerStyle={{paddingBottom: 50}}style={{flex:1}} data={data} renderItem={({item}) => {
        return renderItem({ item });
      }} />

    </View>
  );
}

const styles = StyleSheet.create({
  bg_container: {
    flex: 1,
    backgroundColor: "#9ef3a6",
  },

  checkoutButton: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  checkoutButtonText: {
    color: "#064E3B",
    fontSize: 18,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    backgroundColor: '#9ef3a6',
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#FFFFFF"
  },
  textRight: {
    color: "#FFFFFF",
    textAlign: "right",
    flex:1
  },
  editButton: {
    backgroundColor: "#6563f4",
    padding: 10,
    borderRadius: 5,

    alignItems: "center",
    justifyContent: "center"
  },
  deleteButton: {
    backgroundColor: "#dd4444",
    padding: 10,
    borderRadius: 5,

    alignItems: "center",
    justifyContent: "center"
  },
  searchInput: {
    width: 200,
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
    color: "#FFFFFF"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,

    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center"
  },

  search: {
    backgroundColor: "white",
    margin: 10,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    width: "95%",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  score: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: 20,
    textAlign: "center",
  },
});

function fetchResults(search: string) {
  throw new Error("Function not implemented.");
}
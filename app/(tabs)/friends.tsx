import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  // Lines 14-48 are same as in index.tsx to replicate the header with name and score.
  const db = useSQLiteContext();
  const accountId = 0;

  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountScore, setAccountScore] = useState<number | null>(null);

  // Load the average (displayed) score for the account whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadAccountAvgScore = async () => {
        const result = await db.getFirstAsync<{ avgScore: number }>(
          "SELECT AVG(score) as avgScore FROM scores WHERE account_id = ?;",
          [accountId],
        );

        setAccountScore(result?.avgScore ?? 0);
      };

      loadAccountAvgScore();
    }, [db]),
  );

  useEffect(() => {
    const loadAccountName = async () => {
      const result = await db.getFirstAsync<{ name: string }>(
        "SELECT name FROM accounts WHERE id = ?;",
        [accountId],
      );

      if (result) setAccountName(result.name);
    };

    loadAccountName();
  }, [db]);

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
        }}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={styles.overlay} />

        <View style={styles.headerContent}>
          <View style={styles.nameRow}>
            <Text style={styles.title}>{accountName ?? "Loading..."}</Text>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Carbon Score</Text>
              <Text style={styles.score}>
                {accountScore?.toFixed(2) ?? "0"}
              </Text>
            </View>
          </View>

          <View style={styles.tipCardSmall}>
            <Text style={styles.tipTitle}>Eco Tip</Text>
            <Text style={styles.tipText}>
              Carpooling twice a week can reduce your footprint by 1,600 lbs per
              year.
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* CARDS SECTION, lots of placeholder friends. No database integration currently */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Ryan</Text>
            <Text style={styles.cardScore}>Score: 60.38</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Rubin</Text>
            <Text style={styles.cardScore}>Score: 48.65</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Clarke</Text>
            <Text style={styles.cardScore}>Score: 1</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Alan Ableson</Text>
            <Text style={styles.cardScore}>Score: 23.95</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Hayden</Text>
            <Text style={styles.cardScore}>Score: 41.83</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={45} color="#9CA3AF" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Sean</Text>
            <Text style={styles.cardScore}>Score: 62.72</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    padding: 20,
    paddingTop: 60,
    height: 260,
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },

  scoreBox: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    padding: 12,
    borderRadius: 12,
  },

  scoreLabel: {
    color: "#A7F3D0",
    fontSize: 15,
    fontWeight: "700",
  },

  score: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  tipCardSmall: {
    backgroundColor: "rgba(5, 150, 105, 0.85)",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  tipTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  tipText: {
    color: "#D1FAE5",
    marginTop: 10,
  },

  cardsContainer: {
    padding: 16,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#D1D5DB",
  },

  cardInfo: {
    marginLeft: 12,
  },

  cardName: {
    fontSize: 16,
    fontWeight: "600",
  },

  cardScore: {
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },
});
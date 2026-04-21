// Import icons, React hooks, and React Native components
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";

// Data for the carousel (images + text content)
const carouselItems = [
  {
    url: "https://www.farmboy.ca/wp-content/uploads/2026/01/site-image.jpg",
    title: "Farmer Boy",
    subtitle: "Fresh-market shopping & high-quality Canadian meats,",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiWCt9D-w6VmRPwMgq1rzovDn6PYIt5LVPYQ&s",
    title: "Memorial Centre Farmers' Market",
    subtitle: "Year-round farmers market with fresh produce",
  },
  {
    url: "https://lh3.googleusercontent.com/p/AF1QipNeJc8F6UmWysq5yWmtqOI5h4_VGCS5l_3YNTYK=s1360-w1360-h1020-rw",
    title: "Sigrid's Natural Foods",
    subtitle: "Full range of local, organic, and natural groceries",
  },
];

// Main screen component
export default function HomeScreen() {
  // Index for carousel
  const [index, setIndex] = useState(0);

  // Import database context
  const db = useSQLiteContext();

  // Placeholder for the current user's account ID. Currently only selects account 0.
  const accountId = 0; 
  
  // State variables for account name and score and chart data
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountScore, setAccountScore] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{ date: string; avgscore: number }[]>([]);

  // Formatting the chart data to ensure it's sorted by date and only includes the last 4 entries for better visualization
  const sorted = [...chartData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const last4 = sorted.slice(-4);
  const values = last4.map((item) => item.avgscore).filter((score) => Number.isFinite(score));

  const labels = last4.map(item => {
    const d = new Date(item.date);
    
    const month = d.getUTCMonth() + 1; // Months are zero-indexed
    const day = d.getUTCDate();
    
    return `${month}/${day}`;
  });

  // The variable that's passed to the LineChart graph
  const chartDataFormatted = {
    labels: labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Debug function, prints all of the scores of the account
  const printScores = async () => {
    const scores = await db.getAllAsync<{ score: number }>(
      "SELECT score FROM scores WHERE account_id = ?;",
      [accountId]
    );
    console.log("Scores for account:", scores);
  }

  // Load the average (displayed) score for the account whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadAccountAvgScore = async () => {
        const result = await db.getFirstAsync<{ avgScore: number }>(
          "SELECT AVG(score) as avgScore FROM scores WHERE account_id = ?;",
          [accountId]
        );
        // await printScores();
        const average = result?.avgScore ?? 0;
        if (result) {
          setAccountScore(average);
        }
      };
      loadAccountAvgScore();
    }, [db]));

  // Load the chart data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadChartData = async () => {
        // Pulls data directly from avgscores table
        const result = await db.getAllAsync<{ date: string; avgscore: number }>(
          "SELECT date(timestamp) as date, avgscore as avgscore FROM avgscores WHERE account_id = ?;",
          [accountId]
        );
        setChartData(result);
      };
      loadChartData();
    }, [db])
  );

  // Load the account name on initial render
  useEffect(() => {
    const loadAccountName = async () => {
      const result = await db.getFirstAsync<{ name: string }>(
        "SELECT name FROM accounts WHERE id = ?;",
        [accountId]
      );
      if (result) {
        setAccountName(result.name);
      }
    };
    
    loadAccountName();
    }, [db]);

  // Carousel auto-scroll effect, changes the index every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const item = carouselItems[index];

  // Debugging logs to verify data loading
  // console.log("Account name loaded:", accountName);
  // console.log("Account average score loaded:", accountScore);
  // console.log("Chart data loaded:", chartData);
  // console.log("Formatted Chart data loaded:", chartDataFormatted);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER WITH IMAGE BACKGROUND */}
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
            <Text style={styles.title}>{accountName ?? "(No Account)"}</Text>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Carbon Score</Text>
              <Text style={styles.score}>{accountScore?.toFixed(2) ?? "N/A"}</Text>
            </View>
          </View>

          {/* Eco Tip moved safely inside header with proper spacing */}
          <View style={styles.tipCardSmall}>
            <Text style={styles.tipTitle}>Eco Tip</Text>
            <Text style={styles.tipText}>
              Carpooling twice a week can reduce your footprint by 1,600 lbs per
              year.
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* CAROUSEL SECTION */}
      <View style={styles.carousel}>
        <Image source={{ uri: item.url }} style={styles.image} />
        <View style={styles.overlay} />

        <View style={styles.carouselText}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
        </View>
      </View>

      {/* Graph Header */}
      <View style={{ marginBottom: -5, paddingTop: 20, paddingHorizontal: 20}}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20, marginBottom: 10, color: "rgba(5, 150, 105, 1)" }}>
          Your Carbon Score Trend
        </Text>
      </View>

      {/* Graph */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View style= {{flex: 1, overflow: "hidden", alignContent: "center", justifyContent: "center", backgroundColor: "#e1f6e6", borderRadius: 16, borderColor: "#064E3B", borderWidth: 2 }}>
          {chartData.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}>
            No data to display. Make some purchases to see your carbon score trend!
          </Text>
        ) : (
          <View>
            <LineChart
              data={chartDataFormatted}
              width={Dimensions.get("window").width - 40}
              height={250}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#e1f6e6",
                backgroundGradientFrom: "#e1f6e6",
                backgroundGradientTo: "#e1f6e6",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16, borderColor: "#10B981", borderWidth: 2 },
              }}
            />
            <Text style={{ textAlign: "center", marginTop: 10, color: "#6B7280" }}>
              Date
            </Text>
          </View>
          )
          }
        </View>
        
      </View>

    </ScrollView>
  );
}

// Styles
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
    alignSelf: "flex-end",
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

  // Carousel
  carousel: {
    height: 200,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  carouselText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  carouselTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  carouselSubtitle: {
    color: "#D1FAE5",
    fontSize: 12,
    marginTop: 5,
  },

  // Card
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cardText: {
    marginTop: 10,
    fontSize: 16,
  },

  highlight: {
    color: "#10B981",
    fontWeight: "bold",
  },
  tipTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  tipText: { color: "#D1FAE5", marginTop: 10 },
});
# EcoCart (APSC-103 Group 888-A, First Year Project)

This is a prototype of the app EcoCart, an app that is designed to track the carbon impact of what you buy and encourage you to practice more sustainable shopping habits. It was commisioned by Queen's Project on International Development (QPID). As of April 20th, 2026, this code and git repo has been shared with QPID.

The design team's members are Lucas Wang, Ishan Burma, Ryan Abou Fakhr, and Rubin Gitalis.

Project Manager - Clarke Needles
Client - Kaja Christensen and Alex Pessoa
Faculty Advisor - Thomas Dean

## Main Features:
- The main dashboard, which displays the user's sustainability score for the month
- A graph that displays the change in the user's score over time
- An "Add Products" page where the user can add a selection of products they've bought to their "EcoCart"
- A friends page where you can compare you score with those of your friends

## Areas to Develop (Features to add for upscaling):
- Upgrade to a cloud hosted database for more security and app functionality (real accounts, functional friending system)
- Collaborate with local Kingston grocery stores to get real data on their groceries, making the app more accurate

## To use the app:

1. Install dependencies

   ```bash
   npm install
   npx expo install expo-sqlite
   npx expo install react-native-chart-kit
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open the app in Expo Go.

- [Expo Go](https://expo.dev/go)

## Maintenance and Usability:

The comments within the .tsx files should be sufficient for understanding the code. Most modification will likely need to be done in the /app/_layout.tsx file, where the SQLite database is initialized. 

Messages about code or continued development of the project should be directed to Lucas Wang and Ishan Burma.

## Contact us!
Lucas Wang - 24kmn3@queensu.ca
Ishan Burma - 24mm43@queensu.ca
Ryan Abou Fakhr - 24vcw2@queensu.ca
Rubin Gitalis - 24bkv3@queensu.ca

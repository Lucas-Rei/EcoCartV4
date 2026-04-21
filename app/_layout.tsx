import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("_LAYOUT.TSX: Creating database if needed...");

    // Products table
    await db.execAsync("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score REAL, image TEXT);");

    // Each account has a scores table and friends table that it's connected to
    // Currently friends table is not in use
    await db.execAsync("CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);");
    await db.execAsync("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, score REAL, FOREIGN KEY(account_id) REFERENCES accounts(id));");
    await db.execAsync("CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, friend_account_id INTEGER, FOREIGN KEY(account_id) REFERENCES accounts(id), FOREIGN KEY(friend_account_id) REFERENCES accounts(id));");

    // avgscores table, timestamp is not automatically incremented by by the database, but is inserted by the app at checkout, giving the local time of the user's device
    await db.execAsync("CREATE TABLE IF NOT EXISTS avgscores (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, avgscore REAL, timestamp TEXT, FOREIGN KEY(account_id) REFERENCES accounts(id));");
    
    // Statements for clearing all data in the tables, used for testing purposes
    // await db.execAsync("DELETE FROM products;");
    // await db.execAsync("DELETE FROM accounts;");
    // await db.execAsync("DELETE FROM scores;");
    // await db.execAsync("DELETE FROM friends;");
    // await db.execAsync("DELETE FROM avgscores;");

    // Statement that checks if account 0 already exists
    if (!(await db.getFirstAsync("SELECT * FROM accounts WHERE id = ? LIMIT 1;", [0]))) {
      await db.runAsync("INSERT INTO accounts (id, name) VALUES (0, 'Lucas Wang');");
      const account0 = await db.getFirstAsync("SELECT * FROM accounts WHERE id = ? LIMIT 1;", [0])
      console.log("_LAYOUT.TSX: Successfully created account 0: ", account0)
    }
    else {
      const account0 = await db.getFirstAsync("SELECT * FROM accounts WHERE id = ? LIMIT 1;", [0])
      console.log("_LAYOUT.TSX: Successfully located account 0: ", account0)
    }
 
    console.log("_LAYOUT.TSX: Clearing and seeding database...");
    
    // Reset the products table and add the 50 baseline products with their scores and images
    await db.execAsync("DELETE FROM products;");

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Apples", 21, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Bananas", 27, "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Broccoli", 21, "https://plus.unsplash.com/premium_photo-1702403157830-9df749dc6c1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Carrots", 16, "https://images.unsplash.com/photo-1655558132738-8a4f5124186f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Potatoes", 16, "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Tomatoes", 31, "https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Spinach (bagged)", 34, "https://plus.unsplash.com/premium_photo-1701699257548-8261a687236f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Avocados", 42, "https://plus.unsplash.com/premium_photo-1666877046457-a2f4ecf1589b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Oranges", 25, "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      [
        "Blueberries (clamshell)",
        44,
        "https://images.unsplash.com/photo-1594002348772-bc0cb57ade8b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Milk (2%)", 63, "https://images.unsplash.com/photo-1634141510639-d691d86f47be?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Eggs (large)", 57, "https://images.unsplash.com/photo-1639194335563-d56b83f0060c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Butter", 69, "https://plus.unsplash.com/premium_photo-1700887028603-53b13f06233c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Cheddar cheese", 76, "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Greek yogurt", 63, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Cream", 67, "https://plus.unsplash.com/premium_photo-1723759365132-af57124362b0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Sour cream", 63, "https://www.realsimple.com/thmb/WIQw_c6ePyPKkXAGrFVB5hvMN_A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/make-sour-cream-2000-513d49b3aaba4708a67b19380cc32de6.jpg"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Cottage cheese", 60, "https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=957&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Ground beef", 86, "https://plus.unsplash.com/premium_photo-1670357599582-de7232e949a0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Steak", 88, "https://images.unsplash.com/photo-1588347818036-558601350947?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Chicken breast", 49, "https://plus.unsplash.com/premium_photo-1725467478749-ee1b4e92acc9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Chicken thighs", 53, "https://images.unsplash.com/photo-1759493321741-883fbf9f433c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Pork chops", 63, "https://plus.unsplash.com/premium_photo-1723532472260-4843b8a7992a?q=80&w=1157&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Bacon", 70, "https://plus.unsplash.com/premium_photo-1725899528811-7c893698d113?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Salmon", 60, "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Tilapia", 51, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm0AI3bswxyonTm1JSdtWKJGVMyhGCRERvIQ&s"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["White bread", 36, "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Whole wheat bread", 36, "https://plus.unsplash.com/premium_photo-1725899527854-94fa2b75f8b3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Rice", 38, "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Brown rice", 35, "https://plus.unsplash.com/premium_photo-1671130295823-78f170465794?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Pasta", 32, "https://images.unsplash.com/photo-1598720290281-9f26ae6d6f81?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Oats", 26, "https://plus.unsplash.com/premium_photo-1671130295244-b058fc8d86fe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Flour", 29, "https://plus.unsplash.com/premium_photo-1671377375657-5286f40ec0c7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Lentils", 22, "https://plus.unsplash.com/premium_photo-1671130295987-13d3b3b4e9dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Chickpeas", 23, "https://plus.unsplash.com/premium_photo-1675237624857-7d995e29897d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Black beans", 23, "https://images.unsplash.com/photo-1647545401750-6dd5539879ac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Tofu", 32, "https://images.unsplash.com/photo-1722635940350-d1b2e5129379?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Almond milk", 38, "https://plus.unsplash.com/premium_photo-1663126462918-89b37026420b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Frozen pizza", 71, "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Frozen fries", 45, "https://images.unsplash.com/photo-1615485290836-4ebcebf44aaf?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Chicken nuggets", 62, "https://digital.loblaws.ca/PCX/21195346_C02/fr/1/21195346_enfr_front_250.png"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Ice cream", 71, "https://plus.unsplash.com/premium_photo-1690440686714-c06a56a1511c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );

    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Granola bars", 43, "https://plus.unsplash.com/premium_photo-1726567910881-8130e305bfdd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Chips", 48, "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Cereal", 43, "https://plus.unsplash.com/premium_photo-1675237625804-25deee797cf7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Canned soup", 48, "https://images.unsplash.com/photo-1646763925272-990e7000e566?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Pasta sauce", 44, "https://images.unsplash.com/photo-1608949621318-392aca2bede4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Peanut butter", 36, "https://images.unsplash.com/photo-1615110250484-e8c3b151b957?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Jam", 39, "https://plus.unsplash.com/premium_photo-1669653004204-aff63da3085b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    await db.runAsync(
      "INSERT INTO products (name, score, image) VALUES (?, ?, ?);",
      ["Soft drinks", 50, "https://images.unsplash.com/photo-1588238142232-7108fb7dcbb6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    );
    
  }

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </SQLiteProvider>
  );
}

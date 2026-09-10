// ============================================================
// SQLFORGE - EASY SQL QUESTION BANK
// 50 Interview-Based SQL Challenges
// Based on the actual SQLForge MySQL schema
// Difficulty: Basic → Lower Intermediate
// ============================================================

const easyQuestions = {
  1: {
    title: "List all customers",
    description:
      "Retrieve all columns from the customers table.",
    category: "SELECT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use SELECT * with the customers table.",
    expectedQuery: "SELECT * FROM customers;",
  },

  2: {
    title: "Display customer names",
    description:
      "Retrieve the first name and last name of every customer.",
    category: "SELECT",
    difficulty: "Easy",
    xp: 50,
    hint: "Select first_name and last_name.",
    expectedQuery:
      "SELECT first_name, last_name FROM customers;",
  },

  3: {
    title: "Display customer contact information",
    description:
      "Retrieve each customer's first name, last name, email, and phone number.",
    category: "SELECT",
    difficulty: "Easy",
    xp: 50,
    hint: "Select the four requested columns from customers.",
    expectedQuery:
      "SELECT first_name, last_name, email, phone FROM customers;",
  },

  4: {
    title: "Find customers from India",
    description:
      "Retrieve the first name, last name, and email of customers whose country is India.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Filter the country column using WHERE.",
    expectedQuery:
      "SELECT first_name, last_name, email FROM customers WHERE country = 'India';",
  },

  5: {
    title: "Find customers from Chennai",
    description:
      "Retrieve the names and email addresses of customers who live in Chennai.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use WHERE city = 'Chennai'.",
    expectedQuery:
      "SELECT first_name, last_name, email FROM customers WHERE city = 'Chennai';",
  },

  6: {
    title: "Find customers registered after 2024",
    description:
      "Retrieve customers who registered after January 1, 2024.",
    category: "DATE + WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use registration_date with the > operator.",
    expectedQuery:
      "SELECT first_name, last_name, registration_date FROM customers WHERE registration_date > '2024-01-01';",
  },

  7: {
    title: "Find customers registered in 2025",
    description:
      "Retrieve the names and registration dates of customers who registered during 2025.",
    category: "DATE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use a date range covering January 1 through December 31, 2025.",
    expectedQuery:
      "SELECT first_name, last_name, registration_date FROM customers WHERE registration_date BETWEEN '2025-01-01' AND '2025-12-31';",
  },

  8: {
    title: "Find customers with missing phone numbers",
    description:
      "Retrieve customers whose phone number has not been provided.",
    category: "NULL",
    difficulty: "Easy",
    xp: 50,
    hint: "Use IS NULL rather than = NULL.",
    expectedQuery:
      "SELECT first_name, last_name, email FROM customers WHERE phone IS NULL;",
  },

  9: {
    title: "Find customers with email addresses",
    description:
      "Retrieve customers who have an email address available.",
    category: "NULL",
    difficulty: "Easy",
    xp: 50,
    hint: "Use IS NOT NULL.",
    expectedQuery:
      "SELECT first_name, last_name, email FROM customers WHERE email IS NOT NULL;",
  },

  10: {
    title: "Find customers from selected countries",
    description:
      "Retrieve customers who are from either India or the United States.",
    category: "IN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use the IN operator.",
    expectedQuery:
      "SELECT first_name, last_name, country FROM customers WHERE country IN ('India', 'United States');",
  },

  11: {
    title: "List unique customer countries",
    description:
      "Display all unique countries represented in the customers table.",
    category: "DISTINCT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use DISTINCT on the country column.",
    expectedQuery:
      "SELECT DISTINCT country FROM customers ORDER BY country;",
  },

  12: {
    title: "Sort customers alphabetically",
    description:
      "Display all customers ordered alphabetically by their first name.",
    category: "ORDER BY",
    difficulty: "Easy",
    xp: 50,
    hint: "Use ORDER BY first_name ASC.",
    expectedQuery:
      "SELECT first_name, last_name, email FROM customers ORDER BY first_name ASC;",
  },

  13: {
    title: "Find the newest customers",
    description:
      "Display the 10 most recently registered customers.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort registration_date descending and limit the result.",
    expectedQuery:
      "SELECT first_name, last_name, registration_date FROM customers ORDER BY registration_date DESC LIMIT 10;",
  },

  14: {
    title: "Find customers whose name starts with A",
    description:
      "Retrieve customers whose first name begins with the letter A.",
    category: "LIKE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use LIKE 'A%'.",
    expectedQuery:
      "SELECT first_name, last_name FROM customers WHERE first_name LIKE 'A%';",
  },

  15: {
    title: "Find customers whose name contains 'an'",
    description:
      "Retrieve customers whose first name contains the characters 'an'.",
    category: "LIKE",
    difficulty: "Easy",
    xp: 50,
    hint: "Place % around the search text.",
    expectedQuery:
      "SELECT first_name, last_name FROM customers WHERE first_name LIKE '%an%';",
  },

  16: {
    title: "List all products",
    description:
      "Retrieve the product name, category, unit price, and stock quantity for every product.",
    category: "SELECT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use the products table.",
    expectedQuery:
      "SELECT product_name, category, unit_price, units_in_stock FROM products;",
  },

  17: {
    title: "Find expensive products",
    description:
      "Retrieve products whose unit price is greater than 1000.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use unit_price > 1000.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products WHERE unit_price > 1000;",
  },

  18: {
    title: "Find products within a price range",
    description:
      "Retrieve products whose unit price is between 500 and 2000.",
    category: "BETWEEN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use BETWEEN on unit_price.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products WHERE unit_price BETWEEN 500 AND 2000;",
  },

  19: {
    title: "Find products in selected categories",
    description:
      "Retrieve products belonging to either the Electronics or Furniture category.",
    category: "IN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use IN with two category values.",
    expectedQuery:
      "SELECT product_name, category, unit_price FROM products WHERE category IN ('Electronics', 'Furniture');",
  },

  20: {
    title: "Find discontinued products",
    description:
      "Retrieve products that have been discontinued.",
    category: "BOOLEAN",
    difficulty: "Easy",
    xp: 50,
    hint: "The discontinued column uses 0 and 1.",
    expectedQuery:
      "SELECT product_name, category, unit_price FROM products WHERE discontinued = 1;",
  },

  21: {
    title: "Find active products",
    description:
      "Retrieve products that are currently not discontinued.",
    category: "BOOLEAN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use discontinued = 0.",
    expectedQuery:
      "SELECT product_name, category, unit_price FROM products WHERE discontinued = 0;",
  },

  22: {
    title: "Find products requiring attention",
    description:
      "Retrieve products where the number of units in stock is less than the reorder level.",
    category: "COMPARISON",
    difficulty: "Easy",
    xp: 50,
    hint: "Compare units_in_stock directly with reorder_level.",
    expectedQuery:
      "SELECT product_name, units_in_stock, reorder_level FROM products WHERE units_in_stock < reorder_level;",
  },

  23: {
    title: "Find products with healthy inventory",
    description:
      "Retrieve products where the stock quantity is greater than or equal to the reorder level.",
    category: "COMPARISON",
    difficulty: "Easy",
    xp: 50,
    hint: "Compare units_in_stock with reorder_level.",
    expectedQuery:
      "SELECT product_name, units_in_stock, reorder_level FROM products WHERE units_in_stock >= reorder_level;",
  },

  24: {
    title: "Find products by name",
    description:
      "Retrieve products whose name contains the word 'Laptop'.",
    category: "LIKE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use LIKE with % around Laptop.",
    expectedQuery:
      "SELECT product_name, category, unit_price FROM products WHERE product_name LIKE '%Laptop%';",
  },

  25: {
    title: "Display products from cheapest to most expensive",
    description:
      "Retrieve product names and prices ordered from lowest to highest price.",
    category: "ORDER BY",
    difficulty: "Easy",
    xp: 50,
    hint: "Use ORDER BY unit_price ASC.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products ORDER BY unit_price ASC;",
  },

  26: {
    title: "Find the five most expensive products",
    description:
      "Retrieve the five products with the highest unit prices.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort by unit_price DESC and use LIMIT 5.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products ORDER BY unit_price DESC LIMIT 5;",
  },

  27: {
    title: "Find the cheapest products",
    description:
      "Retrieve the five products with the lowest unit prices.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort by unit_price ASC and use LIMIT 5.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products ORDER BY unit_price ASC LIMIT 5;",
  },

  28: {
    title: "List unique product categories",
    description:
      "Display all unique categories available in the products table.",
    category: "DISTINCT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use DISTINCT category.",
    expectedQuery:
      "SELECT DISTINCT category FROM products ORDER BY category;",
  },

  29: {
    title: "Find the most expensive product",
    description:
      "Retrieve the product with the highest unit price.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort by unit_price descending and return one row.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products ORDER BY unit_price DESC LIMIT 1;",
  },

  30: {
    title: "Find the cheapest product",
    description:
      "Retrieve the product with the lowest unit price.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort by unit_price ascending and return one row.",
    expectedQuery:
      "SELECT product_name, unit_price FROM products ORDER BY unit_price ASC LIMIT 1;",
  },

  31: {
    title: "List all orders",
    description:
      "Retrieve the order ID, customer ID, order date, status, and total amount for every order.",
    category: "SELECT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use the orders table and select the requested columns.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, status, total_amount FROM orders;",
  },

  32: {
    title: "Find completed orders",
    description:
      "Retrieve orders whose status is 'Completed'.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Filter the status column.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE status = 'Completed';",
  },

  33: {
    title: "Find pending orders",
    description:
      "Retrieve orders whose current status is 'Pending'.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use WHERE status = 'Pending'.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE status = 'Pending';",
  },

  34: {
    title: "Find high-value orders",
    description:
      "Retrieve orders whose total amount is greater than 5000.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Filter total_amount using >.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE total_amount > 5000;",
  },

  35: {
    title: "Find orders within an amount range",
    description:
      "Retrieve orders whose total amount is between 1000 and 5000.",
    category: "BETWEEN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use BETWEEN on total_amount.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE total_amount BETWEEN 1000 AND 5000;",
  },

  36: {
    title: "Find recent orders",
    description:
      "Retrieve orders placed after January 1, 2025.",
    category: "DATE + WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Filter order_date.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_date > '2025-01-01';",
  },

  37: {
    title: "Find orders shipped to India",
    description:
      "Retrieve orders whose shipping country is India.",
    category: "WHERE",
    difficulty: "Easy",
    xp: 50,
    hint: "Use ship_country.",
    expectedQuery:
      "SELECT order_id, customer_id, ship_city, ship_country FROM orders WHERE ship_country = 'India';",
  },

  38: {
    title: "Find orders that have not shipped",
    description:
      "Retrieve orders where the shipped date has not yet been recorded.",
    category: "NULL",
    difficulty: "Easy",
    xp: 50,
    hint: "Use IS NULL on shipped_date.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, status FROM orders WHERE shipped_date IS NULL;",
  },

  39: {
    title: "Find recently placed high-value orders",
    description:
      "Retrieve orders placed after January 1, 2025 with a total amount greater than 3000.",
    category: "AND",
    difficulty: "Easy",
    xp: 50,
    hint: "Combine the date and amount conditions with AND.",
    expectedQuery:
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_date > '2025-01-01' AND total_amount > 3000;",
  },

  40: {
    title: "Find the largest orders",
    description:
      "Retrieve the ten orders with the highest total amount.",
    category: "ORDER BY + LIMIT",
    difficulty: "Easy",
    xp: 50,
    hint: "Sort total_amount descending and limit to 10.",
    expectedQuery:
      "SELECT order_id, customer_id, total_amount FROM orders ORDER BY total_amount DESC LIMIT 10;",
  },

  41: {
    title: "Count customers",
    description:
      "Find the total number of customers in the database.",
    category: "COUNT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use COUNT(*).",
    expectedQuery:
      "SELECT COUNT(*) AS customer_count FROM customers;",
  },

  42: {
    title: "Count products",
    description:
      "Find the total number of products in the products table.",
    category: "COUNT",
    difficulty: "Easy",
    xp: 50,
    hint: "Use COUNT(*) on products.",
    expectedQuery:
      "SELECT COUNT(*) AS product_count FROM products;",
  },

  43: {
    title: "Find the average product price",
    description:
      "Calculate the average unit price of all products.",
    category: "AVG",
    difficulty: "Easy",
    xp: 50,
    hint: "Use AVG(unit_price).",
    expectedQuery:
      "SELECT AVG(unit_price) AS average_price FROM products;",
  },

  44: {
    title: "Find the highest product price",
    description:
      "Find the highest unit price among all products.",
    category: "MAX",
    difficulty: "Easy",
    xp: 50,
    hint: "Use MAX(unit_price).",
    expectedQuery:
      "SELECT MAX(unit_price) AS highest_price FROM products;",
  },

  45: {
    title: "Find the lowest product price",
    description:
      "Find the lowest unit price among all products.",
    category: "MIN",
    difficulty: "Easy",
    xp: 50,
    hint: "Use MIN(unit_price).",
    expectedQuery:
      "SELECT MIN(unit_price) AS lowest_price FROM products;",
  },

  46: {
    title: "Calculate total order value",
    description:
      "Calculate the total value of all orders using the total_amount column.",
    category: "SUM",
    difficulty: "Easy",
    xp: 50,
    hint: "Use SUM(total_amount).",
    expectedQuery:
      "SELECT SUM(total_amount) AS total_order_value FROM orders;",
  },

  47: {
    title: "Count orders by status",
    description:
      "Display each order status and the number of orders having that status.",
    category: "GROUP BY",
    difficulty: "Easy",
    xp: 50,
    hint: "Group the orders by status and use COUNT(*).",
    expectedQuery:
      "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY status;",
  },

  48: {
    title: "Find customers by country",
    description:
      "Display each country and the number of customers registered from that country.",
    category: "GROUP BY",
    difficulty: "Easy",
    xp: 50,
    hint: "Group customers by country and count them.",
    expectedQuery:
      "SELECT country, COUNT(*) AS customer_count FROM customers GROUP BY country ORDER BY country;",
  },

  49: {
    title: "Find products by category",
    description:
      "Display each product category and the number of products belonging to that category.",
    category: "GROUP BY",
    difficulty: "Easy",
    xp: 50,
    hint: "Group products using the category column.",
    expectedQuery:
      "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category ORDER BY category;",
  },

  50: {
    title: "Find high-value customers",
    description:
      "Find customers whose total order value is greater than 10000. Display the customer ID and their total order value.",
    category: "GROUP BY + HAVING",
    difficulty: "Easy",
    xp: 50,
    hint:
      "Group orders by customer_id, calculate SUM(total_amount), and filter the groups using HAVING.",
    expectedQuery:
      "SELECT customer_id, SUM(total_amount) AS total_order_value FROM orders GROUP BY customer_id HAVING SUM(total_amount) > 10000 ORDER BY total_order_value DESC;",
  },
};

export default easyQuestions;
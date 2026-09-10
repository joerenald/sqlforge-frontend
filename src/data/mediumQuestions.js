// mediumQuestions.jsx

const MEDIUM_CHALLENGES = {
  1: {
    title: "Advanced SELECT",
    description:
      "Display the first name, last name, email, and country of all customers.",
    category: "Advanced SELECT",
    difficulty: "Medium",
    xp: 25,
    hint: "Select four columns from the customers table.",
    expectedQuery:
      "SELECT first_name, last_name, email, country FROM customers;",
  },

  2: {
    title: "Column Aliases",
    description:
      "Display each customer's first name and last name using the aliases FirstName and LastName.",
    category: "Column Aliases",
    difficulty: "Medium",
    xp: 25,
    hint: "Use AS to rename the selected columns.",
    expectedQuery:
      "SELECT first_name AS FirstName, last_name AS LastName FROM customers;",
  },

  3: {
    title: "Multiple WHERE Conditions",
    description:
      "Find all customers who are from India and have a customer ID greater than 5.",
    category: "WHERE Conditions",
    difficulty: "Medium",
    xp: 25,
    hint: "Combine two conditions using AND.",
    expectedQuery:
      "SELECT * FROM customers WHERE country = 'India' AND customer_id > 5;",
  },

  4: {
    title: "AND / OR Logic",
    description:
      "Find customers who are from India and whose customer ID is either less than 4 or greater than 8.",
    category: "Operator Logic",
    difficulty: "Medium",
    xp: 25,
    hint: "Use parentheses around the OR condition.",
    expectedQuery:
      "SELECT * FROM customers WHERE country = 'India' AND (customer_id < 4 OR customer_id > 8);",
  },

  5: {
    title: "BETWEEN Analysis",
    description:
      "Find all products whose unit price is between 100 and 1000.",
    category: "BETWEEN",
    difficulty: "Medium",
    xp: 25,
    hint: "Use BETWEEN with the unit_price column.",
    expectedQuery:
      "SELECT * FROM products WHERE unit_price BETWEEN 100 AND 1000;",
  },

  6: {
    title: "IN Operator",
    description:
      "Find customers whose customer ID is 1, 5, or 10.",
    category: "IN Operator",
    difficulty: "Medium",
    xp: 25,
    hint: "Use IN instead of multiple OR conditions.",
    expectedQuery:
      "SELECT * FROM customers WHERE customer_id IN (1, 5, 10);",
  },

  7: {
    title: "NOT IN Analysis",
    description:
      "Find employees whose department is not Engineering or Sales.",
    category: "NOT IN",
    difficulty: "Medium",
    xp: 25,
    hint: "Use NOT IN with the department column.",
    expectedQuery:
      "SELECT * FROM employees WHERE department NOT IN ('Engineering', 'Sales');",
  },

  8: {
    title: "Advanced LIKE",
    description:
      "Find all products whose product name contains the word 'Laptop'.",
    category: "LIKE",
    difficulty: "Medium",
    xp: 25,
    hint: "Use % before and after Laptop.",
    expectedQuery:
      "SELECT * FROM products WHERE product_name LIKE '%Laptop%';",
  },

  9: {
    title: "NOT LIKE",
    description:
      "Find all products whose product name does not contain the word 'Laptop'.",
    category: "NOT LIKE",
    difficulty: "Medium",
    xp: 25,
    hint: "Use NOT LIKE.",
    expectedQuery:
      "SELECT * FROM products WHERE product_name NOT LIKE '%Laptop%';",
  },

  10: {
    title: "NULL Handling",
    description:
      "Find all employees who do not have a manager assigned.",
    category: "NULL Handling",
    difficulty: "Medium",
    xp: 25,
    hint: "Do not use = NULL. Use IS NULL.",
    expectedQuery:
      "SELECT * FROM employees WHERE manager_id IS NULL;",
  },

  11: {
    title: "Multiple Column Sorting",
    description:
      "Display employees sorted by department alphabetically and then by salary from highest to lowest.",
    category: "ORDER BY",
    difficulty: "Medium",
    xp: 30,
    hint: "Use two columns in ORDER BY.",
    expectedQuery:
      "SELECT * FROM employees ORDER BY department ASC, salary DESC;",
  },

  12: {
    title: "Top Paid Employees",
    description:
      "Display the five highest-paid employees.",
    category: "ORDER BY + LIMIT",
    difficulty: "Medium",
    xp: 30,
    hint: "Sort salary descending and use LIMIT 5.",
    expectedQuery:
      "SELECT * FROM employees ORDER BY salary DESC LIMIT 5;",
  },

  13: {
    title: "DISTINCT Analysis",
    description:
      "Display all unique countries represented by customers.",
    category: "DISTINCT",
    difficulty: "Medium",
    xp: 30,
    hint: "Use DISTINCT on country.",
    expectedQuery:
      "SELECT DISTINCT country FROM customers;",
  },

  14: {
    title: "Aggregate Functions",
    description:
      "Find the total number of products in the products table.",
    category: "COUNT",
    difficulty: "Medium",
    xp: 30,
    hint: "Use COUNT with product_id.",
    expectedQuery:
      "SELECT COUNT(product_id) AS total_products FROM products;",
  },

  15: {
    title: "COUNT Orders",
    description:
      "Find the total number of orders placed.",
    category: "COUNT",
    difficulty: "Medium",
    xp: 30,
    hint: "Count rows from the orders table.",
    expectedQuery:
      "SELECT COUNT(order_id) AS total_orders FROM orders;",
  },

  16: {
    title: "Total Order Value",
    description:
      "Calculate the total value of all orders.",
    category: "SUM",
    difficulty: "Medium",
    xp: 30,
    hint: "Use SUM on total_amount.",
    expectedQuery:
      "SELECT SUM(total_amount) AS total_order_value FROM orders;",
  },

  17: {
    title: "Average Salary",
    description:
      "Calculate the average salary of all employees.",
    category: "AVG",
    difficulty: "Medium",
    xp: 30,
    hint: "Use AVG on salary.",
    expectedQuery:
      "SELECT AVG(salary) AS average_salary FROM employees;",
  },

  18: {
    title: "Salary Range",
    description:
      "Find the minimum and maximum employee salaries.",
    category: "MIN / MAX",
    difficulty: "Medium",
    xp: 30,
    hint: "Use MIN and MAX together.",
    expectedQuery:
      "SELECT MIN(salary) AS minimum_salary, MAX(salary) AS maximum_salary FROM employees;",
  },

  19: {
    title: "GROUP BY Departments",
    description:
      "Display each employee department and the number of employees in that department.",
    category: "GROUP BY",
    difficulty: "Medium",
    xp: 35,
    hint: "Group employees by department and count employee IDs.",
    expectedQuery:
      "SELECT department, COUNT(employee_id) AS employee_count FROM employees GROUP BY department;",
  },

  20: {
    title: "Department Employee Count",
    description:
      "Display each department and the number of employees earning more than 60000.",
    category: "GROUP BY + WHERE",
    difficulty: "Medium",
    xp: 35,
    hint: "Filter salaries before grouping.",
    expectedQuery:
      "SELECT department, COUNT(employee_id) AS employee_count FROM employees WHERE salary > 60000 GROUP BY department;",
  },

  21: {
    title: "Department Salary Total",
    description:
      "Calculate the total salary paid for each employee department.",
    category: "GROUP BY + SUM",
    difficulty: "Medium",
    xp: 35,
    hint: "Group by department and use SUM(salary).",
    expectedQuery:
      "SELECT department, SUM(salary) AS total_salary FROM employees GROUP BY department;",
  },

  22: {
    title: "Department Average Salary",
    description:
      "Find the average salary for each employee department.",
    category: "GROUP BY + AVG",
    difficulty: "Medium",
    xp: 35,
    hint: "Use AVG(salary) with GROUP BY department.",
    expectedQuery:
      "SELECT department, AVG(salary) AS average_salary FROM employees GROUP BY department;",
  },

  23: {
    title: "HAVING Analysis",
    description:
      "Display departments that have more than one employee.",
    category: "HAVING",
    difficulty: "Medium",
    xp: 35,
    hint: "Use COUNT with GROUP BY and filter groups using HAVING.",
    expectedQuery:
      "SELECT department, COUNT(employee_id) AS employee_count FROM employees GROUP BY department HAVING COUNT(employee_id) > 1;",
  },

  24: {
    title: "Filtered Aggregation",
    description:
      "Find the average salary of employees earning more than 60000.",
    category: "WHERE + AVG",
    difficulty: "Medium",
    xp: 35,
    hint: "Filter employees first, then calculate the average.",
    expectedQuery:
      "SELECT AVG(salary) AS average_salary FROM employees WHERE salary > 60000;",
  },

  25: {
    title: "WHERE + GROUP BY + HAVING",
    description:
      "Find departments where employees earning more than 60000 have an average salary greater than 70000.",
    category: "Advanced Aggregation",
    difficulty: "Medium",
    xp: 40,
    hint: "Filter with WHERE, group by department, then use HAVING.",
    expectedQuery:
      "SELECT department, AVG(salary) AS average_salary FROM employees WHERE salary > 60000 GROUP BY department HAVING AVG(salary) > 70000;",
  },

  26: {
    title: "Customer Orders",
    description:
      "Display each customer's first name, last name, and their order ID.",
    category: "INNER JOIN",
    difficulty: "Medium",
    xp: 40,
    hint: "Join customers and orders using customer_id.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.order_id FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id;",
  },

  27: {
    title: "Join With Filtering",
    description:
      "Display the names of customers who have placed orders with a total amount greater than 1000.",
    category: "JOIN + WHERE",
    difficulty: "Medium",
    xp: 40,
    hint: "Join customers with orders and filter total_amount.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.total_amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE o.total_amount > 1000;",
  },

  28: {
    title: "Join + ORDER BY",
    description:
      "Display customer names and their order amounts, sorted from the highest order amount to the lowest.",
    category: "JOIN + ORDER BY",
    difficulty: "Medium",
    xp: 40,
    hint: "Join customers and orders, then sort by total_amount DESC.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.total_amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.total_amount DESC;",
  },

  29: {
    title: "Order Product Details",
    description:
      "Display each order ID, product ID, quantity, and unit price from order details.",
    category: "Order Details",
    difficulty: "Medium",
    xp: 40,
    hint: "Use the order_details table.",
    expectedQuery:
      "SELECT order_id, product_id, quantity, unit_price FROM order_details;",
  },

  30: {
    title: "Products Ordered",
    description:
      "Display product names and the quantities ordered for each product.",
    category: "JOIN + GROUP BY",
    difficulty: "Medium",
    xp: 45,
    hint: "Join products with order_details using product_id.",
    expectedQuery:
      "SELECT p.product_name, SUM(od.quantity) AS total_quantity FROM products p INNER JOIN order_details od ON p.product_id = od.product_id GROUP BY p.product_id, p.product_name;",
  },

  31: {
    title: "Product Sales Quantity",
    description:
      "Find products whose total ordered quantity is greater than 5.",
    category: "JOIN + HAVING",
    difficulty: "Medium",
    xp: 45,
    hint: "Group order details by product and use HAVING.",
    expectedQuery:
      "SELECT p.product_name, SUM(od.quantity) AS total_quantity FROM products p INNER JOIN order_details od ON p.product_id = od.product_id GROUP BY p.product_id, p.product_name HAVING SUM(od.quantity) > 5;",
  },

  32: {
    title: "Multi-Table Order Analysis",
    description:
      "Display the customer name, order ID, and product name for products included in their orders.",
    category: "Multiple JOIN",
    difficulty: "Medium",
    xp: 45,
    hint: "Connect customers → orders → order_details → products.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.order_id, p.product_name FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id INNER JOIN order_details od ON o.order_id = od.order_id INNER JOIN products p ON od.product_id = p.product_id;",
  },

  33: {
    title: "Customer Order Value",
    description:
      "Display each customer's name and the total value of their orders.",
    category: "Customers + Orders",
    difficulty: "Medium",
    xp: 45,
    hint: "Join customers and orders, then group by customer.",
    expectedQuery:
      "SELECT c.customer_id, c.first_name, c.last_name, SUM(o.total_amount) AS total_order_value FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name;",
  },

  34: {
    title: "Customer Order Count",
    description:
      "Display each customer and the number of orders they have placed.",
    category: "JOIN + COUNT",
    difficulty: "Medium",
    xp: 45,
    hint: "Use COUNT(order_id) and GROUP BY customer.",
    expectedQuery:
      "SELECT c.customer_id, c.first_name, c.last_name, COUNT(o.order_id) AS order_count FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name;",
  },

  35: {
    title: "Inventory Investigation",
    description:
      "Display product names along with their current inventory quantity.",
    category: "Products + Inventory",
    difficulty: "Medium",
    xp: 45,
    hint: "Join products and inventory using product_id.",
    expectedQuery:
      "SELECT p.product_name, i.quantity_in_stock FROM products p INNER JOIN inventory i ON p.product_id = i.product_id;",
  },

  36: {
    title: "Product Reviews",
    description:
      "Display product names and their review ratings.",
    category: "Products + Reviews",
    difficulty: "Medium",
    xp: 45,
    hint: "Join products and reviews using product_id.",
    expectedQuery:
      "SELECT p.product_name, r.rating FROM products p INNER JOIN reviews r ON p.product_id = r.product_id;",
  },

  37: {
    title: "Payment Investigation",
    description:
      "Display order IDs, payment methods, and payment amounts for completed payments.",
    category: "Orders + Payments",
    difficulty: "Medium",
    xp: 45,
    hint: "Join orders and payments using order_id and filter payment_status.",
    expectedQuery:
      "SELECT o.order_id, p.payment_method, p.amount FROM orders o INNER JOIN payments p ON o.order_id = p.order_id WHERE p.payment_status = 'Completed';",
  },

  38: {
    title: "Order Status History",
    description:
      "Display order IDs and their status history for orders that have reached the Shipped status.",
    category: "Orders + Status History",
    difficulty: "Medium",
    xp: 45,
    hint: "Join orders with order_status_history and filter status.",
    expectedQuery:
      "SELECT o.order_id, osh.status, osh.status_date FROM orders o INNER JOIN order_status_history osh ON o.order_id = osh.order_id WHERE osh.status = 'Shipped';",
  },

  39: {
    title: "Supplier Products",
    description:
      "Display supplier names and the products supplied by them.",
    category: "Suppliers + Products",
    difficulty: "Medium",
    xp: 45,
    hint: "Join suppliers and products using supplier_id.",
    expectedQuery:
      "SELECT s.supplier_name, p.product_name FROM suppliers s INNER JOIN products p ON s.supplier_id = p.supplier_id;",
  },

  40: {
    title: "Employee Order Analysis",
    description:
      "Display employee names and the orders handled by them.",
    category: "Employees + Orders",
    difficulty: "Medium",
    xp: 45,
    hint: "Join employees and orders using employee_id.",
    expectedQuery:
      "SELECT e.first_name, e.last_name, o.order_id FROM employees e INNER JOIN orders o ON e.employee_id = o.employee_id;",
  },

  41: {
    title: "Subquery Basics",
    description:
      "Find all employees whose salary is greater than the average employee salary.",
    category: "Subquery",
    difficulty: "Medium",
    xp: 50,
    hint: "Calculate the average salary inside a subquery.",
    expectedQuery:
      "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
  },

  42: {
    title: "Above Average Products",
    description:
      "Find products whose unit price is greater than the average product price.",
    category: "Aggregate Subquery",
    difficulty: "Medium",
    xp: 50,
    hint: "Compare unit_price with AVG(unit_price) from products.",
    expectedQuery:
      "SELECT * FROM products WHERE unit_price > (SELECT AVG(unit_price) FROM products);",
  },

  43: {
    title: "Customers With Orders",
    description:
      "Find customers whose customer IDs appear in the orders table.",
    category: "IN Subquery",
    difficulty: "Medium",
    xp: 50,
    hint: "Use IN with a subquery selecting customer_id from orders.",
    expectedQuery:
      "SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders);",
  },

  44: {
    title: "High Value Customers",
    description:
      "Find customers who have placed at least one order with an amount greater than 2000.",
    category: "Subquery",
    difficulty: "Medium",
    xp: 50,
    hint: "Use IN with a subquery against orders.",
    expectedQuery:
      "SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders WHERE total_amount > 2000);",
  },

  45: {
    title: "Products Above Average With Orders",
    description:
      "Display products that have been ordered and whose price is above the average product price.",
    category: "JOIN + Subquery",
    difficulty: "Medium",
    xp: 50,
    hint: "Join products with order_details and compare unit_price with an average-price subquery.",
    expectedQuery:
      "SELECT DISTINCT p.product_id, p.product_name, p.unit_price FROM products p INNER JOIN order_details od ON p.product_id = od.product_id WHERE p.unit_price > (SELECT AVG(unit_price) FROM products);",
  },

  46: {
    title: "High Value Shipped Orders",
    description:
      "Display customers who have placed shipped orders worth more than 1000.",
    category: "Business Problem",
    difficulty: "Medium",
    xp: 55,
    hint: "Join customers and orders and use two conditions.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.order_id, o.total_amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'Shipped' AND o.total_amount > 1000;",
  },

  47: {
    title: "Top Rated Products",
    description:
      "Display products that have received a rating of 4 or higher, along with their ratings.",
    category: "Analytical Problem",
    difficulty: "Medium",
    xp: 55,
    hint: "Join products and reviews and filter rating >= 4.",
    expectedQuery:
      "SELECT p.product_name, r.rating FROM products p INNER JOIN reviews r ON p.product_id = r.product_id WHERE r.rating >= 4;",
  },

  48: {
    title: "Customer Purchase Investigation",
    description:
      "Display the customer name, order ID, product name, quantity, and payment method for completed payments.",
    category: "Multi-Table Investigation",
    difficulty: "Medium",
    xp: 55,
    hint: "Connect customers, orders, order_details, products, and payments.",
    expectedQuery:
      "SELECT c.first_name, c.last_name, o.order_id, p.product_name, od.quantity, pay.payment_method FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id INNER JOIN order_details od ON o.order_id = od.order_id INNER JOIN products p ON od.product_id = p.product_id INNER JOIN payments pay ON o.order_id = pay.order_id WHERE pay.payment_status = 'Completed';",
  },

  49: {
    title: "Placement Challenge",
    description:
      "Find customers whose total order value is greater than 2000 and display their name and total spending.",
    category: "Placement Challenge",
    difficulty: "Medium",
    xp: 60,
    hint: "Join customers and orders, group by customer, then use HAVING.",
    expectedQuery:
      "SELECT c.customer_id, c.first_name, c.last_name, SUM(o.total_amount) AS total_spending FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name HAVING SUM(o.total_amount) > 2000;",
  },

  50: {
    title: "SQLForge Strategist",
    description:
      "Find products that have been ordered, have a rating of 4 or higher, and have more than 0 units currently in stock. Display the product name, rating, and stock quantity.",
    category: "Final Medium Challenge",
    difficulty: "Medium",
    xp: 75,
    hint: "Connect products with order_details, reviews, and inventory. Use DISTINCT to avoid duplicate product rows.",
    expectedQuery:
      "SELECT DISTINCT p.product_id, p.product_name, r.rating, i.quantity_in_stock FROM products p INNER JOIN order_details od ON p.product_id = od.product_id INNER JOIN reviews r ON p.product_id = r.product_id INNER JOIN inventory i ON p.product_id = i.product_id WHERE r.rating >= 4 AND i.quantity_in_stock > 0;",
  },
};

export default MEDIUM_CHALLENGES;
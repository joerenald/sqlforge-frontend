const ADVANCED_CHALLENGES = {
  1: {
    id: 1,
    title: "Multiple Orders",
    description:
      "Find all customers who have placed more than one order. Display the customer ID, first name, last name, and total number of orders.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING COUNT(o.order_id) > 1;
`,
    xp: 100,
  },

  2: {
    id: 2,
    title: "Above Average Spending",
    description:
      "Find customers whose total order spending is greater than the average total spending per customer. Display the customer ID, full name, and total spending.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING SUM(o.total_amount) > (
    SELECT AVG(customer_total)
    FROM (
        SELECT
            customer_id,
            SUM(total_amount) AS customer_total
        FROM orders
        GROUP BY customer_id
    ) AS customer_spending
);
`,
    xp: 110,
  },

  3: {
    id: 3,
    title: "Customers With No Orders",
    description:
      "Find all customers who have never placed an order. Display their customer ID, name, email, and registration date.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    c.registration_date
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
`,
    xp: 110,
  },

  4: {
    id: 4,
    title: "Highest Order Per Customer",
    description:
      "For every customer who has placed at least one order, find their highest-value order. Display customer ID, name, order ID, and order amount.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    o.order_id,
    o.total_amount
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
WHERE o.total_amount = (
    SELECT MAX(o2.total_amount)
    FROM orders o2
    WHERE o2.customer_id = o.customer_id
);
`,
    xp: 115,
  },

  5: {
    id: 5,
    title: "Products Never Ordered",
    description:
      "Find products that have never appeared in order_details. Display the product ID, product name, and unit price.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    p.unit_price
FROM products p
WHERE NOT EXISTS (
    SELECT 1
    FROM order_details od
    WHERE od.product_id = p.product_id
);
`,
    xp: 115,
  },

  6: {
    id: 6,
    title: "Customers With Orders and Reviews",
    description:
      "Find customers who have both placed at least one order and written at least one product review. Display customer ID, name, number of orders, and number of reviews.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    (
        SELECT COUNT(*)
        FROM orders o
        WHERE o.customer_id = c.customer_id
    ) AS order_count,
    (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.customer_id = c.customer_id
    ) AS review_count
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.customer_id
);
`,
    xp: 120,
  },

  7: {
    id: 7,
    title: "Above Average Ratings",
    description:
      "Find products whose average review rating is greater than the overall average rating across all reviews. Display product ID, product name, and average rating.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    AVG(r.rating) AS average_rating
FROM products p
JOIN reviews r
    ON p.product_id = r.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING AVG(r.rating) > (
    SELECT AVG(rating)
    FROM reviews
);
`,
    xp: 120,
  },

  8: {
    id: 8,
    title: "Customers With No Reviews",
    description:
      "Find customers who have placed at least one order but have never written a review.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND NOT EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.customer_id
);
`,
    xp: 120,
  },

  9: {
    id: 9,
    title: "Orders Above Customer Average",
    description:
      "Find orders whose amount is greater than the average order amount of the same customer. Display order ID, customer ID, and order amount.",
    expectedQuery: `
SELECT
    o.order_id,
    o.customer_id,
    o.total_amount
FROM orders o
WHERE o.total_amount > (
    SELECT AVG(o2.total_amount)
    FROM orders o2
    WHERE o2.customer_id = o.customer_id
);
`,
    xp: 125,
  },

  10: {
    id: 10,
    title: "Suppliers With Multiple Products",
    description:
      "Find suppliers that provide more than one product. Display supplier ID, supplier name, and product count.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name,
    COUNT(p.product_id) AS product_count
FROM suppliers s
JOIN products p
    ON s.supplier_id = p.supplier_id
GROUP BY
    s.supplier_id,
    s.supplier_name
HAVING COUNT(p.product_id) > 1;
`,
    xp: 125,
  },

  11: {
    id: 11,
    title: "Advanced Aggregation",
    description:
      "Find customers whose total spending is greater than the average order amount across all orders.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING SUM(o.total_amount) > (
    SELECT AVG(total_amount)
    FROM orders
);
`,
    xp: 130,
  },

  12: {
    id: 12,
    title: "Multi-Level Aggregation",
    description:
      "Find the customer whose total spending is the highest among all customers.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING SUM(o.total_amount) = (
    SELECT MAX(customer_total)
    FROM (
        SELECT
            customer_id,
            SUM(total_amount) AS customer_total
        FROM orders
        GROUP BY customer_id
    ) AS spending
);
`,
    xp: 130,
  },

  13: {
    id: 13,
    title: "Complex GROUP BY",
    description:
      "For each country, find the number of customers and their total number of orders. Only include countries having at least two customers.",
    expectedQuery: `
SELECT
    c.country,
    COUNT(DISTINCT c.customer_id) AS customer_count,
    COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY c.country
HAVING COUNT(DISTINCT c.customer_id) >= 2;
`,
    xp: 130,
  },

  14: {
    id: 14,
    title: "Advanced HAVING",
    description:
      "Find customers who have placed at least three orders and whose total spending exceeds 1000.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING COUNT(o.order_id) >= 3
   AND SUM(o.total_amount) > 1000;
`,
    xp: 135,
  },

  15: {
    id: 15,
    title: "Nested Aggregation",
    description:
      "Find the average customer spending, where customer spending is calculated first and then averaged.",
    expectedQuery: `
SELECT
    AVG(customer_total) AS average_customer_spending
FROM (
    SELECT
        customer_id,
        SUM(total_amount) AS customer_total
    FROM orders
    GROUP BY customer_id
) AS customer_spending;
`,
    xp: 135,
  },

  16: {
    id: 16,
    title: "Subquery Fundamentals",
    description:
      "Find products whose unit price is greater than the average product unit price.",
    expectedQuery: `
SELECT
    product_id,
    product_name,
    unit_price
FROM products
WHERE unit_price > (
    SELECT AVG(unit_price)
    FROM products
);
`,
    xp: 135,
  },

  17: {
    id: 17,
    title: "Scalar Subqueries",
    description:
      "Display every product together with its unit price and the overall average product price.",
    expectedQuery: `
SELECT
    product_id,
    product_name,
    unit_price,
    (
        SELECT AVG(unit_price)
        FROM products
    ) AS average_product_price
FROM products;
`,
    xp: 140,
  },

  18: {
    id: 18,
    title: "Derived Tables",
    description:
      "Find customers whose total spending is greater than 2000 using a derived table.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    s.total_spending
FROM customers c
JOIN (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spending
    FROM orders
    GROUP BY customer_id
) AS s
    ON c.customer_id = s.customer_id
WHERE s.total_spending > 2000;
`,
    xp: 140,
  },

  19: {
    id: 19,
    title: "Subquery Filtering",
    description:
      "Find orders placed by customers who have placed more than two orders in total.",
    expectedQuery: `
SELECT
    o.order_id,
    o.customer_id,
    o.total_amount
FROM orders o
WHERE o.customer_id IN (
    SELECT customer_id
    FROM orders
    GROUP BY customer_id
    HAVING COUNT(*) > 2
);
`,
    xp: 145,
  },

  20: {
    id: 20,
    title: "Aggregation Subqueries",
    description:
      "Find products whose total ordered quantity is greater than the average total ordered quantity among products that have been ordered.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    SUM(od.quantity) AS total_quantity
FROM products p
JOIN order_details od
    ON p.product_id = od.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING SUM(od.quantity) > (
    SELECT AVG(product_quantity)
    FROM (
        SELECT
            product_id,
            SUM(quantity) AS product_quantity
        FROM order_details
        GROUP BY product_id
    ) AS product_totals
);
`,
    xp: 145,
  },

  21: {
    id: 21,
    title: "Correlated Subqueries",
    description:
      "Find each customer's most expensive order using a correlated subquery.",
    expectedQuery: `
SELECT
    o.order_id,
    o.customer_id,
    o.total_amount
FROM orders o
WHERE o.total_amount = (
    SELECT MAX(o2.total_amount)
    FROM orders o2
    WHERE o2.customer_id = o.customer_id
);
`,
    xp: 150,
  },

  22: {
    id: 22,
    title: "Advanced Correlation",
    description:
      "Find products whose unit price is greater than the average unit price of products supplied by the same supplier.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    p.supplier_id,
    p.unit_price
FROM products p
WHERE p.unit_price > (
    SELECT AVG(p2.unit_price)
    FROM products p2
    WHERE p2.supplier_id = p.supplier_id
);
`,
    xp: 150,
  },

  23: {
    id: 23,
    title: "NOT EXISTS Logic",
    description:
      "Find suppliers who do not currently supply any discontinued products.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name
FROM suppliers s
WHERE NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE p.supplier_id = s.supplier_id
      AND p.discontinued = 1
);
`,
    xp: 155,
  },

  24: {
    id: 24,
    title: "Multiple EXISTS",
    description:
      "Find customers who have placed orders and have reviewed at least one product.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.customer_id
);
`,
    xp: 155,
  },

  25: {
    id: 25,
    title: "EXISTS + Aggregation",
    description:
      "Find customers who have reviewed at least two different products and have also placed at least one order.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.customer_id
    GROUP BY r.customer_id
    HAVING COUNT(DISTINCT r.product_id) >= 2
);
`,
    xp: 160,
  },

  26: {
    id: 26,
    title: "NOT EXISTS + JOIN",
    description:
      "Find products that have never been reviewed and have never been ordered.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.product_id = p.product_id
)
AND NOT EXISTS (
    SELECT 1
    FROM order_details od
    WHERE od.product_id = p.product_id
);
`,
    xp: 160,
  },

  27: {
    id: 27,
    title: "Nested EXISTS",
    description:
      "Find suppliers that have at least one product that has been ordered at least once.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name
FROM suppliers s
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.supplier_id = s.supplier_id
      AND EXISTS (
          SELECT 1
          FROM order_details od
          WHERE od.product_id = p.product_id
      )
);
`,
    xp: 165,
  },

  28: {
    id: 28,
    title: "Anti-Join Analysis",
    description:
      "Find customers who have orders but none of their orders have a status of 'Cancelled'.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
      AND o.status = 'Cancelled'
);
`,
    xp: 165,
  },

  29: {
    id: 29,
    title: "Relationship Validation",
    description:
      "Find customers who have reviewed every product they have ordered at least once.",
    expectedQuery: `
SELECT
    c.customer_id,
    c.first_name,
    c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND NOT EXISTS (
    SELECT DISTINCT od.product_id
    FROM orders o
    JOIN order_details od
        ON o.order_id = od.order_id
    WHERE o.customer_id = c.customer_id
      AND NOT EXISTS (
          SELECT 1
          FROM reviews r
          WHERE r.customer_id = c.customer_id
            AND r.product_id = od.product_id
      )
);
`,
    xp: 170,
  },

  30: {
    id: 30,
    title: "Complex Existence Logic",
    description:
      "Find suppliers for whom every product they supply has been ordered at least once.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name
FROM suppliers s
WHERE EXISTS (
    SELECT 1
    FROM products p
    WHERE p.supplier_id = s.supplier_id
)
AND NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE p.supplier_id = s.supplier_id
      AND NOT EXISTS (
          SELECT 1
          FROM order_details od
          WHERE od.product_id = p.product_id
      )
);
`,
    xp: 175,
  },

  31: {
    id: 31,
    title: "Multi-Table Analysis",
    description:
      "For each product that has been ordered, display the product name, supplier name, total quantity sold, and total sales value.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    s.supplier_name,
    SUM(od.quantity) AS total_quantity_sold,
    SUM(od.quantity * od.unit_price) AS total_sales
FROM products p
JOIN suppliers s
    ON p.supplier_id = s.supplier_id
JOIN order_details od
    ON p.product_id = od.product_id
GROUP BY
    p.product_id,
    p.product_name,
    s.supplier_name;
`,
    xp: 175,
  },

  32: {
    id: 32,
    title: "JOIN + Subquery",
    description:
      "Find products whose total sales value is greater than the average total sales value of all ordered products.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    SUM(od.quantity * od.unit_price) AS total_sales
FROM products p
JOIN order_details od
    ON p.product_id = od.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING SUM(od.quantity * od.unit_price) > (
    SELECT AVG(product_sales)
    FROM (
        SELECT
            product_id,
            SUM(quantity * unit_price) AS product_sales
        FROM order_details
        GROUP BY product_id
    ) AS sales_summary
);
`,
    xp: 180,
  },

  33: {
    id: 33,
    title: "JOIN + Aggregation",
    description:
      "Find each supplier's total sales value based on order details, and display only suppliers whose sales exceed 1000.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name,
    SUM(od.quantity * od.unit_price) AS total_sales
FROM suppliers s
JOIN products p
    ON s.supplier_id = p.supplier_id
JOIN order_details od
    ON p.product_id = od.product_id
GROUP BY
    s.supplier_id,
    s.supplier_name
HAVING SUM(od.quantity * od.unit_price) > 1000;
`,
    xp: 180,
  },

  34: {
    id: 34,
    title: "JOIN + HAVING",
    description:
      "Find customers who have purchased at least three different products and whose total quantity purchased is greater than five.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(DISTINCT od.product_id) AS different_products,
    SUM(od.quantity) AS total_quantity
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
JOIN order_details od
    ON o.order_id = od.order_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING COUNT(DISTINCT od.product_id) >= 3
   AND SUM(od.quantity) > 5;
`,
    xp: 185,
  },

  35: {
    id: 35,
    title: "Multi-Level JOIN",
    description:
      "Find the customer who generated the highest total sales value based on order details rather than orders.total_amount.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(od.quantity * od.unit_price) AS total_sales
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
JOIN order_details od
    ON o.order_id = od.order_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING SUM(od.quantity * od.unit_price) = (
    SELECT MAX(customer_sales)
    FROM (
        SELECT
            o2.customer_id,
            SUM(od2.quantity * od2.unit_price) AS customer_sales
        FROM orders o2
        JOIN order_details od2
            ON o2.order_id = od2.order_id
        GROUP BY o2.customer_id
    ) AS sales_by_customer
);
`,
    xp: 190,
  },

  36: {
    id: 36,
    title: "Complex Relationships",
    description:
      "Find customers who have purchased products from at least two different suppliers.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(DISTINCT p.supplier_id) AS supplier_count
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
JOIN order_details od
    ON o.order_id = od.order_id
JOIN products p
    ON od.product_id = p.product_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING COUNT(DISTINCT p.supplier_id) >= 2;
`,
    xp: 190,
  },

  37: {
    id: 37,
    title: "Customer Intelligence",
    description:
      "Find customers whose average order value is greater than the average order value of all customers.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    AVG(o.total_amount) AS average_order_value
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING AVG(o.total_amount) > (
    SELECT AVG(total_amount)
    FROM orders
);
`,
    xp: 195,
  },

  38: {
    id: 38,
    title: "Product Intelligence",
    description:
      "Find products whose total quantity sold is greater than the average quantity sold per ordered product.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    SUM(od.quantity) AS total_quantity_sold
FROM products p
JOIN order_details od
    ON p.product_id = od.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING SUM(od.quantity) > (
    SELECT AVG(total_quantity)
    FROM (
        SELECT
            product_id,
            SUM(quantity) AS total_quantity
        FROM order_details
        GROUP BY product_id
    ) AS product_sales
);
`,
    xp: 195,
  },

  39: {
    id: 39,
    title: "Supplier Intelligence",
    description:
      "Find suppliers whose average product price is higher than the overall average product price.",
    expectedQuery: `
SELECT
    s.supplier_id,
    s.supplier_name,
    AVG(p.unit_price) AS average_product_price
FROM suppliers s
JOIN products p
    ON s.supplier_id = p.supplier_id
GROUP BY
    s.supplier_id,
    s.supplier_name
HAVING AVG(p.unit_price) > (
    SELECT AVG(unit_price)
    FROM products
);
`,
    xp: 200,
  },

  40: {
    id: 40,
    title: "Business Intelligence",
    description:
      "Find customers whose total spending is higher than the average spending of customers from the same country.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.country,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name,
    c.country
HAVING SUM(o.total_amount) > (
    SELECT AVG(country_spending)
    FROM (
        SELECT
            c2.customer_id,
            c2.country,
            SUM(o2.total_amount) AS country_spending
        FROM customers c2
        JOIN orders o2
            ON c2.customer_id = o2.customer_id
        WHERE c2.country = c.country
        GROUP BY
            c2.customer_id,
            c2.country
    ) AS country_totals
);
`,
    xp: 205,
  },

  41: {
    id: 41,
    title: "Advanced Data Investigation",
    description:
      "Find orders where the order total differs from the sum of their order detail values. Display the order ID, stored total amount, and calculated detail total.",
    expectedQuery: `
SELECT
    o.order_id,
    o.total_amount,
    SUM(od.quantity * od.unit_price) AS calculated_total
FROM orders o
JOIN order_details od
    ON o.order_id = od.order_id
GROUP BY
    o.order_id,
    o.total_amount
HAVING o.total_amount <> SUM(od.quantity * od.unit_price);
`,
    xp: 210,
  },

  42: {
    id: 42,
    title: "Comparative Analysis",
    description:
      "Find products whose average review rating is higher than the average rating of every other reviewed product.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    AVG(r.rating) AS average_rating
FROM products p
JOIN reviews r
    ON p.product_id = r.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING AVG(r.rating) >= ALL (
    SELECT AVG(r2.rating)
    FROM reviews r2
    GROUP BY r2.product_id
);
`,
    xp: 215,
  },

  43: {
    id: 43,
    title: "Performance Analysis",
    description:
      "Find employees who have handled more orders than the average number of orders handled by employees who have handled at least one order.",
    expectedQuery: `
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    COUNT(o.order_id) AS order_count
FROM employees e
JOIN orders o
    ON e.employee_id = o.employee_id
GROUP BY
    e.employee_id,
    e.first_name,
    e.last_name
HAVING COUNT(o.order_id) > (
    SELECT AVG(employee_order_count)
    FROM (
        SELECT
            employee_id,
            COUNT(*) AS employee_order_count
        FROM orders
        WHERE employee_id IS NOT NULL
        GROUP BY employee_id
    ) AS employee_stats
);
`,
    xp: 215,
  },

  44: {
    id: 44,
    title: "Cross-Table Analysis",
    description:
      "Find customers who have placed at least one order, made at least one payment, and written at least one review.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
)
AND EXISTS (
    SELECT 1
    FROM orders o
    JOIN payments p
        ON o.order_id = p.order_id
    WHERE o.customer_id = c.customer_id
)
AND EXISTS (
    SELECT 1
    FROM reviews r
    WHERE r.customer_id = c.customer_id
);
`,
    xp: 220,
  },

  45: {
    id: 45,
    title: "Complex Business Logic",
    description:
      "Find customers who have spent more than 1000 and whose average review rating is at least 4.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    (
        SELECT SUM(o.total_amount)
        FROM orders o
        WHERE o.customer_id = c.customer_id
    ) AS total_spending,
    (
        SELECT AVG(r.rating)
        FROM reviews r
        WHERE r.customer_id = c.customer_id
    ) AS average_rating
FROM customers c
WHERE (
    SELECT SUM(o.total_amount)
    FROM orders o
    WHERE o.customer_id = c.customer_id
) > 1000
AND (
    SELECT AVG(r.rating)
    FROM reviews r
    WHERE r.customer_id = c.customer_id
) >= 4;
`,
    xp: 225,
  },

  46: {
    id: 46,
    title: "SQL Interview Challenge",
    description:
      "Find the second-highest spending customer. Display the customer ID, name, and total spending.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
ORDER BY total_spending DESC
LIMIT 1 OFFSET 1;
`,
    xp: 230,
  },

  47: {
    id: 47,
    title: "SQL Placement Challenge",
    description:
      "Find customers whose total spending ranks within the top three distinct spending amounts.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING (
    SELECT COUNT(DISTINCT total_spending)
    FROM (
        SELECT
            o2.customer_id,
            SUM(o2.total_amount) AS total_spending
        FROM orders o2
        GROUP BY o2.customer_id
    ) AS spending_rank
    WHERE spending_rank.total_spending >
          SUM(o.total_amount)
) < 3;
`,
    xp: 235,
  },

  48: {
    id: 48,
    title: "Expert Query Challenge",
    description:
      "Find products that have been ordered, reviewed, and have an average rating higher than the overall average rating of all reviewed products.",
    expectedQuery: `
SELECT
    p.product_id,
    p.product_name,
    SUM(od.quantity) AS total_quantity_sold,
    AVG(r.rating) AS average_rating
FROM products p
JOIN order_details od
    ON p.product_id = od.product_id
JOIN reviews r
    ON p.product_id = r.product_id
GROUP BY
    p.product_id,
    p.product_name
HAVING AVG(r.rating) > (
    SELECT AVG(r2.rating)
    FROM reviews r2
);
`,
    xp: 240,
  },

  49: {
    id: 49,
    title: "Advanced SQL Mastery",
    description:
      "Find customers whose total spending is above the average customer spending, who have purchased from at least two suppliers, and who have reviewed at least two products.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(o.total_amount) AS total_spending,
    COUNT(DISTINCT p.supplier_id) AS supplier_count,
    COUNT(DISTINCT r.product_id) AS reviewed_products
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
JOIN order_details od
    ON o.order_id = od.order_id
JOIN products p
    ON od.product_id = p.product_id
JOIN reviews r
    ON c.customer_id = r.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING SUM(o.total_amount) > (
    SELECT AVG(customer_total)
    FROM (
        SELECT
            customer_id,
            SUM(total_amount) AS customer_total
        FROM orders
        GROUP BY customer_id
    ) AS customer_spending
)
AND COUNT(DISTINCT p.supplier_id) >= 2
AND COUNT(DISTINCT r.product_id) >= 2;
`,
    xp: 250,
  },

  50: {
    id: 50,
    title: "SQLForge Final Boss",
    description:
      "Find customers who have placed orders, whose total spending is above the average spending of all customers, who have purchased from at least two suppliers, who have reviewed at least two products, and whose average review rating is above the overall average rating. Return the customer ID, name, total spending, supplier count, reviewed product count, and average rating.",
    expectedQuery: `
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    spending.total_spending,
    purchasing.supplier_count,
    reviewing.reviewed_product_count,
    reviewing.average_rating
FROM customers c

JOIN (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spending
    FROM orders
    GROUP BY customer_id
) AS spending
    ON c.customer_id = spending.customer_id

JOIN (
    SELECT
        o.customer_id,
        COUNT(DISTINCT p.supplier_id) AS supplier_count
    FROM orders o
    JOIN order_details od
        ON o.order_id = od.order_id
    JOIN products p
        ON od.product_id = p.product_id
    GROUP BY o.customer_id
    HAVING COUNT(DISTINCT p.supplier_id) >= 2
) AS purchasing
    ON c.customer_id = purchasing.customer_id

JOIN (
    SELECT
        customer_id,
        COUNT(DISTINCT product_id) AS reviewed_product_count,
        AVG(rating) AS average_rating
    FROM reviews
    GROUP BY customer_id
    HAVING COUNT(DISTINCT product_id) >= 2
) AS reviewing
    ON c.customer_id = reviewing.customer_id

WHERE spending.total_spending > (
    SELECT AVG(customer_total)
    FROM (
        SELECT
            customer_id,
            SUM(total_amount) AS customer_total
        FROM orders
        GROUP BY customer_id
    ) AS customer_spending
)
AND reviewing.average_rating > (
    SELECT AVG(rating)
    FROM reviews
);
`,
    xp: 300,
  },
};

export default ADVANCED_CHALLENGES;
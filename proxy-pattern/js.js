const User = {
  setName(name) {
    if (name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
    this.name = name;
  },
  setEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    this.email = email;
  },
};

const ValidatingUserProxy = new Proxy(User, {
  set(target, prop, value) {
    // Validate properties before setting them on the target object
    if (prop === "name") {
      target.setName(value);
    } else if (prop === "email") {
      target.setEmail(value);
    } else {
      // Handle other properties (optional)
    }
    return true;
  },
});

const validatedUser = new ValidatingUserProxy();
try {
  validatedUser.name = "Alice"; // Valid
  validatedUser.email = "invalid@email"; // Throws error
} catch (error) {
  console.error(error.message);
}

const Product = {
  setPrice(price) {
    this.price = price;
  },
};

const FormattingProductProxy = new Proxy(Product, {
  set(target, prop, value) {
    if (prop === "price") {
      // Format the price (e.g., add currency symbol, commas)
      target.price = `$${value.toFixed(2)}`;
    } else {
      target.price = value;
    }
    return true;
  },
});

const formattedProduct = new FormattingProductProxy();
formattedProduct.setPrice(123.456);
console.log(formattedProduct.price); // Output: "$123.46"

const OrderService = {
  placeOrder(order) {
    console.log("Placing order:", order);
    // (Simulate order processing)
    return new Promise((resolve) => setTimeout(resolve, 2000));
  },
};

const NotificationOrderServiceProxy = new Proxy(OrderService, {
  get(target, prop, receiver) {
    if (prop === "placeOrder") {
      return function (order) {
        const result = target.placeOrder(order);
        // Send notification after order placement
        console.log("Order placed successfully! Awaiting confirmation.");
        return result;
      };
    }
    return Reflect.get(target, prop, receiver);
  },
});

const notifiedOrderService = new NotificationOrderServiceProxy();
notifiedOrderService.placeOrder({ items: ["Item A", "Item B"] });

function getUserData(userId) {
  // Simulate fetching data from a database (replace with your actual logic)
  const userData = {
    name: "Alice",
    email: "alice@example.com",
  };

  return userData;
}

const cache = {}; // Simple object to act as a cache

function getCachedUserData(userId) {
  // Check if user data is already cached
  if (cache[userId]) {
    console.log("Using cached user data for userId:", userId);
    return cache[userId];
  }

  // If not cached, fetch data and store it in cache
  const userData = getUserData(userId);
  cache[userId] = userData;
  return userData;
}

// Example usage:
const user1Data = getCachedUserData(123);
console.log(user1Data); // Retrieves data (possibly from cache)

const user1DataAgain = getCachedUserData(123);
console.log(user1DataAgain); // Uses cached data for userId: 123

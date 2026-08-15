"""Static menu data for Morsaab's.

Kept in code rather than the database: the menu changes rarely and every
request needs the whole thing, so a lookup per page load buys nothing.
"""

MENU = {
    "categories": [
        {
            "name": "Starters",
            "items": [
                {"name": "Roasted Peanuts", "price": 99, "description": "Crispy spiced peanuts"},
                {"name": "Veg Seekh Kebab", "price": 199, "description": "Smoky vegetable kebabs"},
                {"name": "Achari Soya Chaap", "price": 219, "description": "Tangy pickle-flavored chaap"},
                {"name": "Dal Ke Kebab", "price": 299, "description": "Crispy lentil patties"},
                {"name": "Achari Paneer Tikka", "price": 310, "description": "Tangy cottage cheese tikka"},
                {"name": "Hariyali Paneer Tikka", "price": 310, "description": "Mint-marinated paneer"},
                {"name": "Paneer Malai Tikka", "price": 349, "description": "Creamy cottage cheese tikka"}
            ]
        },
        {
            "name": "Main Course",
            "items": [
                {"name": "Dal Tadka", "price": 199, "description": "Tempered yellow lentils"},
                {"name": "Jeera Aloo", "price": 199, "description": "Cumin-spiced potatoes"},
                {"name": "Aloo Gobi Adraki", "price": 219, "description": "Ginger-infused potato cauliflower"},
                {"name": "Punjabi Kadhi", "price": 229, "description": "Tangy yogurt curry"},
                {"name": "Mix Veg", "price": 219, "description": "Seasonal mixed vegetables"},
                {"name": "Pindi Chana", "price": 229, "description": "Spiced chickpea curry"},
                {"name": "Kadhai Paneer", "price": 349, "description": "Wok-tossed cottage cheese"},
                {"name": "Shahi Paneer", "price": 349, "description": "Royal creamy paneer"},
                {"name": "Palak Paneer", "price": 349, "description": "Spinach cottage cheese"},
                {"name": "Paneer Tikka Masala", "price": 349, "description": "Grilled paneer in gravy"},
                {"name": "Paneer Butter Masala", "price": 349, "description": "Rich buttery paneer curry"}
            ]
        },
        {
            "name": "South Indian",
            "items": [
                {"name": "Vada", "price": 109, "description": "Crispy lentil fritters"},
                {"name": "Plain Dosa", "price": 119, "description": "Crispy rice crepe"},
                {"name": "Plain Butter Dosa", "price": 139, "description": "Buttery rice crepe"},
                {"name": "Masala Dosa", "price": 139, "description": "Stuffed with potato filling"},
                {"name": "Utthappam Masala", "price": 139, "description": "Thick rice pancake"},
                {"name": "Plain Idli (3pcs)", "price": 139, "description": "Steamed rice cakes with sambhar"},
                {"name": "Masala Idli", "price": 209, "description": "Spiced idli tossed in masala"},
                {"name": "Podi Idli", "price": 249, "description": "Idli with spice powder"}
            ]
        },
        {
            "name": "Chinese",
            "items": [
                {"name": "Veg Spring Roll", "price": 199, "description": "Crispy vegetable rolls"},
                {"name": "Chili Potato", "price": 199, "description": "Spicy crispy potatoes"},
                {"name": "Honey Chili Potato", "price": 199, "description": "Sweet & spicy potatoes"},
                {"name": "Veg Crispy Corn", "price": 199, "description": "Crispy corn kernels"},
                {"name": "Dry Manchurian", "price": 249, "description": "Crispy vegetable balls"},
                {"name": "Salt and Pepper", "price": 209, "description": "Seasoned crispy veggies"},
                {"name": "Chili Paneer", "price": 249, "description": "Spicy Indo-Chinese paneer"},
                {"name": "Chili Mushroom", "price": 299, "description": "Spicy wok-tossed mushrooms"},
                {"name": "Paneer 65", "price": 299, "description": "South Indian style crispy paneer"}
            ]
        },
        {
            "name": "Pizza",
            "items": [
                {"name": "Margherita", "price": 299, "description": "Classic cheese & tomato"},
                {"name": "Fresh Farmhouse", "price": 299, "description": "Garden fresh vegetables"},
                {"name": "Mexican", "price": 319, "description": "Spicy jalapeño & veggies"},
                {"name": "Sizzling Chilli Paneer", "price": 349, "description": "Spicy paneer topping"},
                {"name": "Paneer Tikka Pizza", "price": 349, "description": "Indian fusion pizza"},
                {"name": "Spinach Sun-Dried Tomato", "price": 399, "description": "Gourmet pizza with olives"},
                {"name": "Chef's Special Mushroom", "price": 399, "description": "Truffle oil drizzled"}
            ]
        },
        {
            "name": "Pasta",
            "items": [
                {"name": "Arrabiata", "price": 199, "description": "Spicy red sauce pasta"},
                {"name": "Alfredo", "price": 219, "description": "Creamy white sauce pasta"},
                {"name": "Mix Sauce", "price": 219, "description": "Pink sauce pasta"},
                {"name": "Pesto Sauce", "price": 249, "description": "Basil pesto pasta"},
                {"name": "Aglio E Olio", "price": 249, "description": "Garlic olive oil pasta"},
                {"name": "Mac and Cheese", "price": 249, "description": "Baked cheese pasta"}
            ]
        },
        {
            "name": "Beverages",
            "items": [
                {"name": "Espresso", "price": 99, "description": "Strong Italian coffee"},
                {"name": "Cappuccino", "price": 179, "description": "Frothy milk coffee"},
                {"name": "Cafe Latte", "price": 169, "description": "Smooth milk coffee"},
                {"name": "Mocha Frappe", "price": 169, "description": "Chocolate coffee blend"},
                {"name": "Classic Sweet Lassi", "price": 99, "description": "Traditional yogurt drink"},
                {"name": "Mango Saffron Lassi", "price": 119, "description": "Premium mango lassi"},
                {"name": "Chilli Guava Cooler", "price": 229, "description": "Morsaab's Special"},
                {"name": "Mix Berry Smoothie", "price": 199, "description": "Fresh berry blend"}
            ]
        },
        {
            "name": "Desserts",
            "items": [
                {"name": "Assorted Ice Cream", "price": 79, "description": "2 scoops of choice"},
                {"name": "Rasmalai (2 Pcs)", "price": 79, "description": "Creamy milk dessert"},
                {"name": "Gulab Jamun", "price": 99, "description": "Deep-fried milk dumplings"},
                {"name": "Assorted Pastry", "price": 159, "description": "Fresh bakery selection"},
                {"name": "Butterscotch Sundae", "price": 179, "description": "Ice cream with toppings"},
                {"name": "Oreo Overload Sundae", "price": 179, "description": "Cookie crumble sundae"},
                {"name": "Nutty Nutella Sundae", "price": 179, "description": "Hazelnut chocolate sundae"}
            ]
        },
        {
            "name": "Thali",
            "items": [
                {"name": "Deluxe Thali", "price": 299, "description": "2 Paratha, Paneer, Dal Makhani, Pulao, Dal"},
                {"name": "Morsaab's Royal Special", "price": 349, "description": "Complete meal with Paneer, Dal, Mix Veg, Naan, Sweet"}
            ]
        }
    ]
}

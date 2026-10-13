/*
  BakeHaus menu data. This is the ONLY file you need to edit to change
  prices, add or remove items, or swap photos.

  price:   number in rupees (no commas). Leave out for items without a price.
  from:    true = starting price that changes with customisation (shown as "from ₹X").
           Leave it out for fixed prices. Today only celebration cakes use it.
  unit:    shown after the price, e.g. "/pc", "/tin", "/box".
  size:    weight or pack size, e.g. "500g", "Box of 4".
  img:     photo base name inside assets/img (without -sm.jpg / -lg.jpg).
  tag:     optional sticker: "Chef's pick", "Bestseller" or "New".
           Chef's picks and Bestsellers also appear on the home page.
*/
window.BAKEHAUS = {
  phone: "918983828666",
  phoneDisplay: "+91 89838 28666",
  instagram: "https://www.instagram.com/bakehaus_by_khushi",
  instagramHandle: "@bakehaus_by_khushi",
  reviews: "https://share.google/D3yciayrJRPA4KCX8",
  upi: "khushilalwani1515@okhdfcbank",
  address: "Anand Niwas, Sewa Mandal Road, New Joshi Colony, Sindhi Colony, Jalgaon, Maharashtra 425001",
  hours: "Open every day, 10 AM to 7 PM",
  defaultLeadDays: 2,

  categories: [
    {
      id: "cakes",
      title: "Celebration cakes",
      short: "Cakes",
      size: "500g",
      keywords: "birthday anniversary wedding engagement kids baby shower photo custom theme fondant tier eggless",
      blurb: "Every cake is built for your occasion. Pick a flavour, then tell us the design, tiers or theme.",
      note: "Prices are for 500g and are starting prices. Custom designs, tiers and themes on request.",
      kind: "cake",
      layout: "feature",
      photos: ["cake-strawberry-bow", "cake-tiramisu-monogram", "cake-biscoff-drip", "cake-chocolate-ten", "carrot-cake"],
      groups: [
        {
          title: "Signature flavours",
          items: [
            { name: "Tiramisu", desc: "Classic Italian-inspired coffee cream cake with mascarpone layers", size: "500g", price: 850, from: true, img: "cake-tiramisu-monogram", tag: "Chef's pick" },
            { name: "Opera", desc: "Coffee-soaked sponge, coffee buttercream and dark chocolate ganache", size: "500g", price: 900, from: true, tag: "New" },
            { name: "OG 46% Dark Chocolate", desc: "Rich, intense dark chocolate with a velvety finish", size: "500g", price: 750, from: true, img: "cake-chocolate-ten" },
            { name: "Chocolate Strawberry", desc: "Decadent chocolate paired with fresh strawberry layers", size: "500g", price: 800, from: true },
            { name: "Vanilla Strawberry Nutella", desc: "Fluffy vanilla, fresh strawberry and luscious Nutella", size: "500g", price: 800, from: true, img: "cake-strawberry-bow" },
            { name: "Praline Cake", desc: "Chocolate or vanilla, with crunchy praline layers", size: "500g", price: 850, from: true, options: ["Chocolate", "Vanilla"] }
          ]
        },
        {
          title: "Classic and gourmet",
          items: [
            { name: "Walnut & Dark Chocolate", size: "500g", price: 750, from: true },
            { name: "Roasted Almond & Dark Chocolate", size: "500g", price: 750, from: true },
            { name: "Nutella Rocher", size: "500g", price: 850, from: true },
            { name: "OG Chocolate & Nutella", size: "500g", price: 750, from: true },
            { name: "Biscoff & Chocolate", size: "500g", price: 800, from: true, img: "cake-biscoff-drip" },
            { name: "Biscoff & Vanilla", size: "500g", price: 750, from: true },
            { name: "Milk Chocolate & Cashew Praline", size: "500g", price: 730, from: true },
            { name: "Snickers Bomb", size: "500g", price: 800, from: true },
            { name: "S'mores Cake", desc: "Marshmallow & graham crackers", size: "500g", price: 800, from: true },
            { name: "Chocolate Cherry", size: "500g", price: 950, from: true },
            { name: "Coffee Caramel", size: "500g", price: 700, from: true },
            { name: "Caramel Crunch", size: "500g", price: 700, from: true },
            { name: "Blueberry Cream Cheese", size: "500g", price: 750, from: true },
            { name: "Lemon Blueberry", size: "500g", price: 800, from: true },
            { name: "Fresh Fruit (Seasonal)", size: "500g", price: 780, from: true },
            { name: "Carrot Cake", size: "500g", price: 900, from: true, img: "carrot-cake" },
            { name: "Fresh Pineapple", size: "500g", price: 650, from: true },
            { name: "Pistachio Strawberry", size: "500g", price: 850, from: true },
            { name: "Rabri Gulab Jamun", size: "500g", price: 700, from: true },
            { name: "Rasmalai", size: "500g", price: 700, from: true },
            { name: "Rose Pistachio", size: "500g", price: 700, from: true, img: "cake-rose-pistachio" },
            { name: "Kunafa Cake with OG Chocolate", size: "500g", price: 900, from: true, tag: "Chef's pick" },
            { name: "Cookies & Cream", size: "500g", price: 650, from: true },
            { name: "Café Mocha", size: "500g", price: 750, from: true }
          ]
        }
      ]
    },
    {
      /* Customised cakes: priced per kg by design, so there are no fixed items.
         priceText is shown instead of item prices; photos fill the design grid. */
      id: "custom-cakes",
      title: "Customised cakes",
      short: "Custom cakes",
      blurb: "Birthdays, weddings, baby showers, milestones. Share your idea or a reference photo and we'll design the cake around it.",
      priceText: "₹1,600 to ₹2,200 per kg",
      priceNote: "Depending on the design and flavour",
      kind: "custom",
      layout: "custom",
      keywords: "custom customised customized theme design fondant tier tiered birthday wedding anniversary engagement kids baby shower photo per kg",
      photos: ["cake-tiered-ruffle", "cake-princess-tiered", "cake-gift-box", "cake-baby-boy", "cake-lambeth-fifty", "cake-peacock", "cake-number-fifty", "cake-heart-floral"],
      groups: []
    },
    {
      id: "cookie-tins",
      title: "Signature cookie tins",
      short: "Cookie tins",
      blurb: "A whole cookie baked right in the tin. Warm it up and dig in with a spoon.",
      note: "Each tin is one big scoopable cookie.",
      keywords: "gift gifting scoop cookie tin",
      kind: "tin",
      layout: "tiles",
      photos: ["cookie-cups-box"],
      groups: [
        {
          items: [
            { name: "Classic Chocolate Sea Salt", price: 900, unit: "/tin" },
            { name: "Ferrero Nutella", price: 1000, unit: "/tin" },
            { name: "Double Chocolate", price: 950, unit: "/tin" },
            { name: "Biscoff", price: 1000, unit: "/tin" },
            { name: "Pretzel Caramel Crunch", price: 980, unit: "/tin" },
            { name: "Mocha Hazelnut", price: 950, unit: "/tin" }
          ]
        }
      ]
    },
    {
      id: "cupcakes",
      title: "Cupcakes",
      short: "Cupcakes",
      size: "Box of 4",
      keywords: "cupcake muffin party",
      blurb: "Soft cupcakes with generous frosting, packed four to a box.",
      note: "Priced per box of 4.",
      kind: "box",
      layout: "compact",
      groups: [
        {
          items: [
            { name: "Chocolate Sea Salt Cupcakes", size: "Box of 4", price: 320, unit: "/box" },
            { name: "Red Velvet Cupcakes", size: "Box of 4", price: 340, unit: "/box" },
            { name: "Biscoff Cupcakes", size: "Box of 4", price: 350, unit: "/box" },
            { name: "Nutella Ferrero Cupcakes", size: "Box of 4", price: 400, unit: "/box" }
          ]
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies",
      short: "Cookies",
      blurb: "Crisp tea time biscuits and big, chewy chonky cookies. Both make easy gifts.",
      kind: "pack",
      layout: "split",
      photos: ["cookies-chocolate-chunk"],
      groups: [
        {
          title: "Chonky cookies",
          sub: "Soft, chewy, indulgent",
          items: [
            { name: "Chocolate Chunk & Sea Salt", size: "300g", price: 400, tag: "Bestseller", img: "cookies-chocolate-chunk" },
            { name: "Double Chocolate", size: "300g", price: 450 },
            { name: "Brookies", desc: "Brownie + cookie, the best of both worlds", size: "300g", price: 450 },
            { name: "Lotus Biscoff Cookies", size: "300g", price: 500 },
            { name: "Tiramisu Cookies", size: "300g", price: 500 }
          ]
        },
        {
          title: "Tea time cookies",
          items: [
            { name: "Classic Butter Cookies", size: "500g", price: 700 },
            { name: "Almond Butter Sticks", size: "500g", price: 800 },
            { name: "Date & Almond Biscuits", size: "500g", price: 800 },
            { name: "Jeera / Salt / Masala Biscuits", size: "500g", price: 700, options: ["Jeera", "Salt", "Masala"] }
          ]
        }
      ]
    },
    {
      id: "tea-cakes",
      title: "Tea time cakes",
      short: "Tea cakes",
      size: "500g",
      keywords: "loaf tea time",
      blurb: "Comfort loaves for everyday cravings, gifting and the evening chai.",
      note: "All 500g unless noted.",
      kind: "loaf",
      layout: "feature",
      photos: ["callet-butter-cake", "oats-dates-loaf"],
      groups: [
        {
          items: [
            { name: "Iyengar Mawa Tea Cake", size: "500g", price: 550 },
            { name: "Chocolate Callet Butter Cake", size: "500g", price: 600, img: "callet-butter-cake" },
            { name: "Bishop's Nut Tea Cake", desc: "Packed with nuts and dried fruit", size: "500g", price: 750, tag: "New" },
            { name: "Sugar-Free Oats & Dates Cake", desc: "Maida-free", size: "500g", price: 650, img: "oats-dates-loaf", keywords: "sugar free sugarfree healthy no sugar" },
            { name: "Wholewheat Jaggery Cake", size: "500g", price: 550 },
            { name: "Coconut Lime Cake", size: "500g", price: 500 },
            { name: "Almond Berry Crumble Tea Cake", size: "500g", price: 600 },
            { name: "Hazelnut Chocolate Tea Cake", size: "500g", price: 600 },
            { name: "Brownie Cake", size: "350g", price: 600 }
          ]
        }
      ]
    },
    {
      id: "party-desserts",
      title: "Party desserts",
      short: "Party desserts",
      keywords: "party bulk puja office individual cups tarts",
      blurb: "Individual desserts for parties, pujas and office treats.",
      note: "Minimum order: 5 pieces per item.",
      kind: "piece",
      moq: 5,
      layout: "gallery",
      photos: ["tiramisu-cups", "tarts-chocolate-sea-salt", "mini-tarts-tray"],
      groups: [
        {
          items: [
            { name: "Blueberry Tarts", price: 130, unit: "/pc" },
            { name: "Tiramisu Cups", price: 160, unit: "/pc", img: "tiramisu-cups" },
            { name: "Boondi Gulab Jamun Tarts", price: 150, unit: "/pc" },
            { name: "Chocolate Sea Salt Tarts", price: 110, unit: "/pc", img: "tarts-chocolate-sea-salt" },
            { name: "Tres Leches", desc: "Rasmalai, Classic or Cold Coffee", price: 200, unit: "/pc", options: ["Rasmalai", "Classic", "Cold Coffee"] },
            { name: "Dulce de Leche Pudding", price: 150, unit: "/pc" },
            { name: "Blueberry Cheesecake Cups", price: 130, unit: "/pc" }
          ]
        }
      ]
    },
    {
      id: "cheesecakes",
      title: "Cheesecakes and brownies",
      short: "Cheesecakes & brownies",
      size: "500g",
      blurb: "Creamy cheesecakes and our fudgy signature brownies.",
      note: "Cheesecakes are 500g.",
      keywords: "cheesecake brownie",
      kind: "cake",
      layout: "split",
      photos: ["brownie-box-nine"],
      groups: [
        {
          title: "Cheesecakes",
          items: [
            { name: "Classic New York Cheesecake", size: "500g", price: 850 },
            { name: "Blueberry Cheesecake", size: "500g", price: 950, tag: "Chef's pick" },
            { name: "Nutella Cheesecake", size: "500g", price: 950 },
            { name: "Biscoff Cheesecake", size: "500g", price: 950 }
          ]
        },
        {
          title: "Brownies",
          items: [
            { name: "Signature Brownies", desc: "Fudgy, dense and utterly irresistible", size: "4 pcs · 350g", price: 600, img: "brownie-box-nine", kind: "box" }
          ]
        }
      ]
    },
    {
      id: "savoury",
      title: "Savoury bakes",
      short: "Savoury",
      blurb: "Because baked comfort comes savoury too.",
      keywords: "savoury savory bread snacks international breads",
      kind: "piece",
      layout: "feature",
      photos: ["focaccia", "korean-garlic-buns", "quiche-spinach-corn"],
      groups: [
        {
          items: [
            { name: "Korean Garlic Buns", desc: "Pillowy buns with garlicky, buttery goodness", price: 120, unit: "/pc", moq: 6, img: "korean-garlic-buns", tag: "Chef's pick" },
            { name: "Spinach Corn Cheese Quiche", price: 85, unit: "/pc", moq: 8, img: "quiche-spinach-corn" },
            { name: "Mushroom Cheese Quiche", price: 85, unit: "/pc", moq: 8 },
            { name: "Focaccia", desc: "Classic Italian flatbread with herbs", size: "300g", price: 400, img: "focaccia", kind: "loaf" }
          ]
        }
      ]
    }
  ],

  grazing: {
    id: "grazing",
    title: "Grazing tables",
    pricePerHead: 750,
    minGuests: 15,
    leadDays: 7,
    pick: { savoury: 3, dessert: 2, beverage: 1 },
    includes: ["Food", "Set-up & decor", "Food styling", "Decorative beverage cups", "Stands & risers", "Paper cutlery & tissues"],
    photos: ["grazing-garden", "grazing-round-table", "grazing-dips", "grazing-sliders", "grazing-ladder", "grazing-panorama", "canvas-cheese-board", "grazing-sunflower"],
    savoury: [
      { title: "Global bites & fusion treats", items: ["Chinese Bao", "Paneer Chilli Bao", "Bao Dabeli", "Mini Korean Garlic Buns", "Tandoori Paneer Calzone", "Spaghetti Cups", "Mini Burgers", "Thecha Sliders", "Pizza Bombs", "Corn & Spinach Quiche", "Mushroom & Cheese Quiche"] },
      { title: "Mediterranean & continental", items: ["Mini Hummus Pita Bites", "Hummus Pockets", "Lavash Cups", "Basil Parmesan Bruschetta", "Mushroom & Caramelised Onion Toasties", "Cream Cheese & Cucumber Sandwiches"] },
      { title: "Indian street-style favourites", items: ["Mini Vada Pav", "Guacamole Papdi Chaat", "Paneer Tikka Mini Samosas", "Veg Grilled Paneer Rolls"] },
      { title: "Dips, crackers & cheese boards", items: ["Cream Cheese Ball Dip with Crackers", "Roasted Cherry Tomato Cream Cheese Dip with Crackers", "Canvas Cheese Board with Crackers"] },
      { title: "Nachos & salsa bar", items: ["Nachos with Pineapple Salsa", "Nachos with Classic Salsa"] }
    ],
    dessert: [
      { title: "Signature mini desserts", items: ["Chocolate Hazelnut Praline Mini Tart Cakes", "Berry Tart Cakes", "Cheesecake Tarts", "Chocolate Sea Salt Tarts", "Signature Brownie Bites"] },
      { title: "Fruity & refreshing", items: ["Cherry Chocolate Mini Pastries", "Strawberry Cheesecake Cups"] },
      { title: "Classic & international indulgence", items: ["Tiramisu", "Classic Tres Leches", "Chocolate Croissant Sandwich"] },
      { title: "Fusion & modern treats", items: ["Deconstructed Gulab Jamun Cheesecake", "Boondi Gulab Jamun Tarts / Cheesecake", "Rasmalai Tres Leches", "Chocolate Nutella Cake Shots"] },
      { title: "Warm & comfort desserts", items: ["Cinnamon Rolls", "Churro Cups with Milk Chocolate Dip"] },
      { title: "Light & wholesome", items: ["Baked Yogurt"] }
    ],
    beverage: [
      { title: "Beverages", items: ["Cold Cocoa", "Mint Mojito", "Peach Iced Tea", "Watermelon Mint Cooler"] }
    ]
  },

  /*
    Festive specials. Shown in the header as "Festive specials" and on festive.html.
    For the next festival, change the festival name, greeting, headline, intro,
    photos and items below. Set enabled: false to hide it everywhere at once.
    Add price: 1500 (for example) to any item; without a price it shows "Price on request".
    Gallery photos tagged cat: "festive" appear under the festival's filter.
  */
  festive: {
    enabled: true,
    id: "festive",
    festival: "Diwali",
    title: "Diwali hampers",
    short: "Festive specials",
    kind: "hamper",
    greeting: "Shubh Deepavali",
    headline: "Diwali hampers,",
    headlineAccent: "made in-house.",
    bannerTitle: "Diwali hampers are here",
    bannerText: "Order by 25 October. Hampers from ₹560, with GST bills for corporate gifting.",
    bannerButton: "See the hampers",
    facts: ["Last order date: 25 October", "GST bills for corporate orders", "Beautifully packaged"],
    corporate: true,
    corporateText: "Tell us how many hampers you need and your budget, and we'll put together options. GST bills are provided for corporate orders.",
    intro: "Thoughtfully curated Diwali hampers for you and your loved ones. Our signature bestsellers, handcrafted treats and gourmet snacks, all made in-house and beautifully packaged.",
    photos: ["diwali-collection", "diwali-indulgence-trunk", "diwali-heritage-box"],
    groups: [
      {
        title: "The hampers",
        items: [
          { name: "The Gourmet Affair", price: 2400, img: "diwali-wicker-hamper", photos: ["diwali-wicker-hamper", "diwali-potli-basket"],
            contents: ["Desi ghee nankhatai", "Spiced cashews", "Kaju katli macarons", "Bishop's nut tea cake", "Scoopable cookie tin", "Beetroot chips"] },
          { name: "The Indulgence Trunk", price: 2300, img: "diwali-indulgence-trunk",
            contents: ["Signature brownie bites × 9", "Kaju katli macarons", "Spiced cashews", "Beetroot chips", "Desi ghee nankhatai"] },
          { name: "Potli & Cookie Tin", price: 1099, desc: "A festive potli with a tin of our cookies", img: "diwali-potli-tin", photos: ["diwali-potli-tin", "cookie-tin-assorted"] }
        ]
      },
      {
        title: "Gift boxes",
        items: [
          { name: "The Cookie Vault", price: 1280, desc: "Six assorted flavours of our signature scoopable cookie tins", img: "diwali-heritage-box", photos: ["diwali-heritage-box", "cookie-cups-box"],
            contents: ["Classic", "Red velvet", "Pretzel crunch", "Biscoff", "Ferrero rocher", "Double chocolate"] },
          { name: "The Brownie Khazana", price: 560, desc: "A mithai box reimagined: our signature brownie as bite-sized pieces with assorted toppings", img: "brownie-box-ribbon", photos: ["brownie-box-ribbon", "brownie-box-nine"] }
        ]
      }
    ]
  },

  gallery: [
    { img: "diwali-collection", alt: "The BakeHaus Diwali collection: cookie vault, gourmet basket, brownie box and potli", cat: "festive" },
    { img: "diwali-indulgence-trunk", alt: "The Indulgence Trunk with brownie bites, macarons, cashews, beetroot chips and nankhatai", cat: "festive" },
    { img: "diwali-wicker-hamper", alt: "Diwali wicker basket hamper with jars of treats", cat: "festive" },
    { img: "diwali-heritage-box", alt: "Teal printed BakeHaus gift box with mini tins", cat: "festive" },
    { img: "diwali-potli-basket", alt: "Festive basket hamper styled with an orange potli", cat: "festive" },
    { img: "diwali-potli-tin", alt: "Festive potli with a tin of cookies", cat: "festive" },
    { img: "cake-tiramisu-monogram", alt: "Tiramisu charlotte cake with stencilled initials", cat: "cakes" },
    { img: "grazing-garden", alt: "Outdoor grazing table with mini desserts on tiered stands", cat: "grazing" },
    { img: "cake-gift-box", alt: "White cake topped with a red fondant gift bow", cat: "cakes" },
    { img: "callet-butter-cake", alt: "Chocolate callet butter cakes baked in tins", cat: "sweets" },
    { img: "cake-vintage-pink", alt: "Pink vintage piped cake topped with strawberries", cat: "cakes" },
    { img: "mini-tart-cakes-orange", alt: "Mini tart cakes with orange and berries", cat: "sweets" },
    { img: "grazing-round-table", alt: "Round grazing table with dips, sandwiches and desserts", cat: "grazing" },
    { img: "cake-lambeth-birthday", alt: "Rectangular cream cake piped with red bows", cat: "cakes" },
    { img: "korean-garlic-buns", alt: "Tray of Korean cream cheese garlic buns", cat: "savoury" },
    { img: "cake-tiered-ruffle", alt: "Three tier white ruffle cake with pink roses", cat: "cakes" },
    { img: "tarts-chocolate-sea-salt", alt: "Chocolate sea salt tarts with raspberries", cat: "sweets" },
    { img: "grazing-dips", alt: "Dips, bruschetta and chaat cups on a grazing table", cat: "grazing" },
    { img: "cake-strawberry-bow", alt: "Vanilla cake with fresh strawberries and a bow", cat: "cakes" },
    { img: "brownie-box-nine", alt: "Box of nine assorted brownies", cat: "sweets" },
    { img: "cake-number-fifty", alt: "Number 50 chocolate cake with edible flowers", cat: "cakes" },
    { img: "focaccia", alt: "Golden focaccia with olives and herbs", cat: "savoury" },
    { img: "cake-lambeth-fifty", alt: "Burgundy rectangular cake with 'fifty' in script", cat: "cakes" },
    { img: "grazing-sliders", alt: "Mini sliders and tart cakes on a garden grazing table", cat: "grazing" },
    { img: "cake-heart-red", alt: "Red heart-shaped ruffle cake", cat: "cakes" },
    { img: "tiramisu-cups", alt: "Tiramisu cups with cocoa", cat: "sweets" },
    { img: "cake-princess-tiered", alt: "Three tier pink princess cake with castle topper", cat: "cakes" },
    { img: "canvas-cheese-board", alt: "Canvas cheese board with crackers on an easel", cat: "grazing" },
    { img: "cake-roses", alt: "Pink cake topped with sculpted roses", cat: "cakes" },
    { img: "cookie-tin-assorted", alt: "Tin of assorted cookies from the potli hamper", cat: "festive" },
    { img: "cake-orange-floral", alt: "Cream cake with orange slices and flowers", cat: "cakes" },
    { img: "quiche-spinach-corn", alt: "Spinach corn quiches", cat: "savoury" },
    { img: "cake-baby-boy", alt: "Blue baby shower cake with teddy bears and rainbows", cat: "cakes" },
    { img: "grazing-ladder", alt: "Grazing table with a wooden ladder stand and doughnuts", cat: "grazing" },
    { img: "carrot-cake", alt: "Carrot cake topped with fresh fruit and flowers", cat: "cakes" },
    { img: "brownie-box-ribbon", alt: "Diwali brownie gift box tied with a BakeHaus ribbon", cat: "festive" },
    { img: "cake-two-tier", alt: "Two tier white cake with a sketch design", cat: "cakes" },
    { img: "mini-tart-cakes-hazelnut", alt: "Hazelnut praline mini tart cakes", cat: "sweets" },
    { img: "cake-pink-leaf", alt: "Birthday cake with pink painted leaves", cat: "cakes" },
    { img: "grazing-panorama", alt: "Evening grazing table with sunflowers and candles", cat: "grazing" },
    { img: "cake-biscoff-drip", alt: "Biscoff drip cake topped with dessert cups", cat: "cakes" },
    { img: "cookies-chocolate-chunk", alt: "Chocolate chunk sea salt cookies", cat: "sweets" },
    { img: "cake-strawberry-tall", alt: "White cake crowned with strawberries", cat: "cakes" },
    { img: "dessert-table-cups", alt: "Dessert table with cups, tarts and blueberry squares", cat: "sweets" },
    { img: "cake-peacock", alt: "Peacock themed cake with balloon topper", cat: "cakes" },
    { img: "grazing-box", alt: "Grazing box with dips, pita and bites", cat: "grazing" },
    { img: "cake-heart-floral", alt: "Heart cake with flower ring for a one-month celebration", cat: "cakes" },
    { img: "cookie-cups-box", alt: "Six scoopable cookie tins in assorted flavours", cat: "sweets" },
    { img: "cake-vintage-white", alt: "White vintage piped cake with strawberries", cat: "cakes" },
    { img: "grazing-stand", alt: "Wooden grazing stand with flowers and treats", cat: "grazing" },
    { img: "cake-chocolate-ten", alt: "Chocolate cake with a gold number 10", cat: "cakes" },
    { img: "mini-tarts-tray", alt: "Rows of mini tarts", cat: "sweets" },
    { img: "cake-pastel-birthday", alt: "Pastel birthday cake with meringues", cat: "cakes" },
    { img: "grazing-tiers", alt: "Grazing table with tiered dessert stand and crackers", cat: "grazing" },
    { img: "cakes-trio", alt: "Three celebration cakes together", cat: "cakes" },
    { img: "dessert-spread", alt: "Mini tart cakes in front of a floral cake", cat: "sweets" },
    { img: "cake-strawberry-red", alt: "Small white and red cake with strawberries", cat: "cakes" },
    { img: "grazing-sliders-stand", alt: "Mini burgers on an acrylic stand", cat: "grazing" },
    { img: "cake-charlotte", alt: "Charlotte cake on a cake stand", cat: "cakes" },
    { img: "oats-dates-loaf", alt: "Oats and dates loaf cakes", cat: "sweets" },
    { img: "grazing-cake-stand", alt: "Tiered stand of chocolate desserts", cat: "grazing" },
    { img: "brownie-bites-box", alt: "Box of decorated brownie bites", cat: "sweets" },
    { img: "grazing-sunflower", alt: "Grazing table with sunflowers and mini desserts", cat: "grazing" },
    { img: "trail-mix-tin", alt: "Tin of nuts and dried berries", cat: "sweets" }
  ]
};

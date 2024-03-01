const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const app = express();

// Use CORS middleware
app.use(cors());
const Inventory=require('./models/Inventory.jsx')
const TemporaryTable=require('./models/Temporarytable.jsx');
const mongoURI="mongodb+srv://vaishnavivijay432:TechCart%40579@cluster0.nn0brsh.mongodb.net/Customer"
// Use body-parser middleware to parse JSON
app.use(bodyParser.json());
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.post('/addItemsToCart', async (req, res) => {
//     try {
//         const { cart_no, product_id } = req.body;
//         console.log(cart_no, product_id);
//         res.json(`${cart_no} ${product_id} Successfully inserted the Item`);
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

Inventory.create([
    {
      product_id:"3E00BA0A4BC5",
      Product:'Salt',
      Price:'13',
  
    },
    {
      product_id:"3E00B9DCD18A",
      Product:'Gold Winner',
      Price:'135',
      
    },
    {
      product_id:'3E00B9869E9F',
      Product:'Sugar',
      Price:'50',
      
    },
    {
      product_id:'3E00B991B1A7',
      Product:'Surf excel',
      Price:'400',
      
    },
    {
      product_id:'3E005F8702E4',
      Product:'Salt',
      Price:'23',
      
    }
  ])
  app.get('/Inventoryitem', async (req, res) => {
    try {
      // Fetch all items from the InventoryItem collection
      const items = await Inventory.find();
  
      // Send the items in the response
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/addItemsToCart', async (req, res) => {
    try {
        const { cart_no, product_id } = req.body;

        
        let existingCart = await TemporaryTable.findOne({ cartNumber: cart_no });

        if (!existingCart) {
            existingCart = await TemporaryTable.create({ cartNumber: cart_no, items: [] });
        }

        const item = await Inventory.findOne({ product_id });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        existingCart.items.push(item);
        await existingCart.save();

        res.json("Successfully inserted the Item");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  app.post('/TempItems', async (req, res) => {
    try {
      const { cartNumber } = req.body;
  
      if (!cartNumber) {
        return res.status(400).json('Cart number is required');
      }
  
      const temporaryTableData = await TemporaryTable.findOne({ cartNumber:cartNumber });
       console.log("table",temporaryTableData)
      if (temporaryTableData===null) {
        return res.status(404).json("null");
        
      }
  
      res.json(temporaryTableData);
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });

app.listen(5000, () => {
    console.log('app is running');
});

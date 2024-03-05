const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const app = express();
const Key_ID="rzp_test_L1JPeGnZbS2ffv";
const Secret="kM3HWuzLYF6xiljfsJmi0mir";
// Use CORS middleware
app.use(cors());

const CustomerModel  = require('./models/Customer.jsx')
const CartModel= require('./models/Items.jsx');
const CartItems=require('./models/CartItems.jsx')
const History=require('./models/History.jsx');
const Inventory=require('./models/Inventory.jsx')
const TemporaryTable=require('./models/Temporarytable.jsx')
const TransactionModel = require('./models/Transaction.jsx');
const mongoURI="mongodb+srv://suhas123p:Suhas%40123@doctorappointment.xlmvnb7.mongodb.net/Customer"
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

        res.json(existingCart);
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

  app.post('/OrderId', async (req, res) => {
    try {
      const { orderId } = req.body;
  
      // Find transactions in the database based on orderId
      const transactions = await TransactionModel.find({ OrderId: orderId });
  
      // Respond with the result
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/Customer',async(req,res)=>{
    try {
  
      const items = await CustomerModel.find();
  
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })
  
  
  app.post('/histories', async (req, res) => {
    try {
      // Extract data from the request body
      const { Date, Cartno, Name, Phone, Email, OrderId,Amount } = req.body;
  
      // Create a new History instance
      const newHistory = new History({
        Date,
        Cartno,
        Name,
        Phone,
        Email,
        OrderId,
        Amount,
      });
  
      // Save the newHistory instance to the database
      await newHistory.save();
  
      res.status(201).json({ message: 'History added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.delete('/deleteCart/:cart_no', async (req, res) => {
    const cartNumber = req.params.cart_no;
  
    try {
      // Check if the cart exists
      const existingCart = await TemporaryTable.findOne({ cartNumber });
  
      if (existingCart) {
        // Cart exists, delete the entry
        await TemporaryTable.deleteOne({ cartNumber });
        res.json(`Cart with cartNumber ${cartNumber} deleted successfully`);
      } else {
        // Cart doesn't exist
        res.status(404).json(`Cart with cartNumber ${cartNumber} not found`);
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
  app.get('/items',async (req,res)=>{
    try{
           const {product_id} = req.body;
           console.log(product_id)
           const id={};
           if (product_id) id.product_id=product_id;
           const data=await Inventory.find(id);
           res.json(data);
    }
    catch(error){
          console.log(error);
    }
  })
  app.post('/filterHistory', async (req, res) => {
    try {
      const { date,cartNo, name, email, orderId, phoneNumber } = req.body;
  
      // Build the filter object based on the provided parameters
      const filter = {};
      if (date) filter.Date = date;
      if (cartNo) filter.Cartno=cartNo;
      if (name) filter.Name = name;
      if (email) filter.Email = email;
      if (orderId) filter.OrderId = orderId;
      if (phoneNumber) filter.Phone = phoneNumber;
  
      // Query the History collection with the filter object
      const filteredData = await History.find(filter);
  
      res.json(filteredData);
    } catch (e) {
      console.error(error);
      res.status(500).send(e);
    }
  });
  
  
  
  console.log("hello")
    app.post('/sendData', (req, res) => {
      console.log("hello")
      console.log(req)
      const { tagId } = req.body;
    
      const newData = new CartItems({ tagId });
      newData.save((err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Data saved to MongoDB');
          res.status(200).send('Data saved successfully');
        }
      });
    });
  
  app.get('/history',async(req,res)=>{
    
      const history=await History.find()
      .then(items=>res.json(items))
      .catch(err=>res.json(err));
    
  })
    app.get('/users', async (req, res) => {
      try {
        const totalUsers = await CustomerModel.countDocuments({});
        res.json({ totalUsers });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    
    
    
    app.get('/getItems', (req, res) => {
      console.log("get");
      CartModel.find() // Use find instead of findOne
        .then(items => res.json(items))
        .catch(err => res.json(err));
    });
  
  app.post('/Login',(req,res)=>{
     const {email,password}=req.body;
     CustomerModel.findOne({email:email})
     .then(user=>{
      if(user){
          if(user.password===password){
              res.json(user)
          }
          else{
              res.json("Password is incorrect");
          }
      }
      else{
          res.json("No record Existed")
      }
     })
  })
  
  app.post("/order",async(req,res)=>{
      try{
      const razorpay=new Razorpay({
           key_id:Key_ID,
           key_secret:Secret,
      });
      const options=req.body;
      const order = await razorpay.orders.create(options);
  
      if(!order){
          return res.statusCode(500).send("Error");
      }
      res.json(order);
      } 
  catch(err){
      console.log(err);
      res.status(500).send("Error");
  }}
  )
  
  
  
  
  app.post("/validate",async(req,res)=>{
    console.log("validate started")
    const  {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    const sha = crypto.createHmac("sha256",process.env.Secret);
    console.log("sha",sha)
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest=sha.digest("hex");
    if(digest!==razorpay_signature){
      return res.status(400).json({msg:"Transaction is not legit!"})
  
    }
    res.json({
      msg:"success",
      orderId:razorpay_order_id,
      paymentId:razorpay_payment_id,
    
    })
  })
  
  
  // Define the route to handle the API request
  app.post('/Transactions', async (req, res) =>{
    try {
      // Create a new instance of the Transaction model with request body
      const newTransaction = new TransactionModel(req.body);
  
      // Save the new transaction to the database
      await newTransaction.save();
  
      // Respond with success message
      res.status(201).json({ message: 'Transaction successfully added to the database' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/Register', (req, res) => {
      const { email,secretkey,type } = req.body;
     console.log("body",req.body)
      CustomerModel.findOne({ email })
          .then(existingUser=> {
            
            if (existingUser) {
                   
              res.json({ message: 'Record already exists for this email' });
          } 
           else if (type=="admin"){
           
                 if ( secretkey!=="suhas"){
                
                  res.json({message:"Invalid secret key"})
                  console.log("a")}
                  else{
                    CustomerModel.create(req.body)
                    .then(newRecord => res.json(newRecord))
                    .catch(err => res.json(err));
                  }
                  
            
          }
            else {
                  {console.log(req.body)}
                  CustomerModel.create(req.body)
                      .then(newRecord => res.json(newRecord))
                      .catch(err => res.json(err));
              }
          })
          .catch(err => res.json(err));
  });

app.listen(5000, () => {
    console.log('app is running');
});

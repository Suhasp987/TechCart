import express from 'express'
const app=express()
app.get('/',(req,res)=>
{
   res.send('Hello World')
})

app.post('/addItemsToCart', async (req, res) => {
    const { cart_no, product_id } = req.body;
    const id = {};
   console.log(cart_no,product_id);
  
    res.json(`${cart_no} ${product_id} Successfully inserted the Item`);
  });

app.listen(5000,()=>
{
    xonsole.log('app is running')
})
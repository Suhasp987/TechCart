import express from 'express'
const app=express()
 app.get('/',(req,res)=>
 {
    res.send('Express vercel app response')
 })

app.listen(5000,()=>
{
    xonsole.log('app is running')
})
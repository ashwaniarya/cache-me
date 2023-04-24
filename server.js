const express = require("express")

const app = express();


app.post("/test",(req,res)=>{
  return res.send({
    result: "Complex",
    version: 1
  })
})

app.listen(3333,()=>{
  console.log('Testing app is running at '+ 3333);
})
//jshint esversion:6

const express=require("express")
const app=express()
app.set('view engine','ejs')

const bodyParser=require("body-parser")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))

var flash=require("connect-flash")

app.get("/",(req,res)=>{
res.render("home",{option:"c++",value:"c++"})
})

app.get("/python",(req,res)=>{
  res.render("home",{option:"python",value:"python"})

})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

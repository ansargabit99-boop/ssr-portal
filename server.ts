import express from "express"
import { Request,Response,NextFunction } from "express"
import pool from "./data.ts"
import path from "node:path"
import session from "express-session"
import bcrypt from "bcryptjs"
declare module "express-session" {
    interface SessionData {
        userId: number,
        email:string
    }
}



const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET || "change secret",
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true,maxAge:1000*60*60} // 1hr
}))

function requireLogin(req:Request,res:Response,next:NextFunction) {
    if (!req.session.userId) return res.redirect("/")
    next()
}


app.set("view engine", "ejs")
app.set("views",path.join(process.cwd(),"views"))

app.get("/", (req, res) => {
    if (req.session.userId) return res.redirect("/dashboard")
    res.render("index",{message:null})
})
app.get("/health",async(req,res)=>{
    console.log("working")
    res.send("working")
})
app.post("/login",async(req,res)=>{
    try {
        const {emailOrphone,password} = req.body
        if (!emailOrphone || !password) {
            return res.status(400).render("index",{message:"email and password required"})
        }
        let result

        if (emailOrphone.includes("@") && emailOrphone.includes(".")) {
            result = await pool.query("SELECT * FROM users WHERE email=$1",[emailOrphone])
        } else {
            result = await pool.query("SELECT * FROM users WHERE number=$1",[emailOrphone])
        }
        if (result.rows.length === 0) {
            return res.status(404).render("index",({message:"not found"}))
        }
        const user = result.rows[0]

        if(!user || !(await bcrypt.compare(password,user.password_hash))) {
            return res.status(400).render("index",{message:"invalid credentials"})
        }

        req.session.userId = user.id
        req.session.email = user.email
        
        return res.redirect("/dashboard")

    } catch (err) {
        console.log(err)
        return res.render("index",{
            message:"something went wrong"
        })
    }
})
app.get("/register", (req, res) => {
  if (req.session.userId) return res.redirect("/dashboard")
  res.render("register", { message: null })
})
app.post("/register",async(req,res)=>{
    try {
        const {name,email,phone,password_hash} = req.body
        if (!name || !email || phone || password_hash) {
            return res.status(400).render("register",{message:"you forgot something"})
        }
        const hashed = await bcrypt.hash(password_hash,10)
        const newUser = await pool.query("INSERT INTO users (name,email,phone,password_hash) RETURNIN id,email",[name,email,phone,hashed])
        const user = newUser.rows[0]

        req.session.userId = user.id
        req.session.email = user.email
        
        return res.redirect("/dashoboard")
    } catch(err) {
        console.log(err)
        return res.status(500).render("register",{message:"something went wrong"})
    }
})

app.get("/dashboard", requireLogin, (req, res) => {
  res.render("dashboard", { user: req.session.email })
})
app.post("/logout",async(req,res)=>{
 req.session.destroy(()=>{
    res.redirect("/")
 })
})
const port = 3000;
app.listen(port,()=>{
    console.log("server is starting")
})

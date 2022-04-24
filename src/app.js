import express  from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport"
import {Strategy} from "passport-local"
import path from "path"
import loginRouter from "./routes/login.js"
import fileStrategy from "session-file-store"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import handlenbars from "express-handlebars"


const app = express()
const server = app.listen(8080,()=>{
    console.log("Listening on port 8080")
})

const Filestorage = fileStrategy(session)
const Url = "mongodb+srv://nicolas:qwer1234@prueba.wmbbs.mongodb.net/BaseSessiones?retryWrites=true&w=majority"
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(session({
   store: MongoStore.create({
      mongoUrl:Url,
      ttl:60
   }),
   secret:"secretisimo",
   resave: true,
   saveUninitialized:false,
   cookie:{
      maxAge:60000
   },

}))
mongoose.connect(Url, {
   useNewUrlParser: true, useUnifiedTopology: true
},err=>{
   if(err) throw new Error("No se pudo conectar");
   console.log("db conectada")
})

app.use(passport.initialize())
app.use(passport.session())


const __dirname = path.resolve();
app.use(express.static(__dirname+'/Public'))


app.use('/',loginRouter);
app.engine("handlebars", handlenbars.engine());
app.set("views", "./Public/views");
app.set("view engine", "handlebars");

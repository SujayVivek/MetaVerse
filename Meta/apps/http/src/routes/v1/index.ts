import {Router} from "express";
import {userRouter} from './user'
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import bcrypt from "bcrypt";
import client from "@repo/db/client"

export const router = Router();

router.post('/signup', async (req, res)=>{
    const parsedData = SignupSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"validation failed"})
        return;
    }

    const hashedPassword = await bcrypt(parsedData.data.password, 10)

    try{
        const user = await client.user.create({
            data:{ //Need to just do npm prisma migrate dev in DB to save the new prisma settings
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin"? "Admin": "User",
            }
        })
        res.json({
            userId: user.id
        })
    }catch(e){
        res.status(400).json({message:"User Already Exists"})
    }
})

router.post('/signin', (req, res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(403).json({message:"Validation Failed "})
    }
    res.json({
        message: "Signin"
    })
})

router.get('/elements', (req, res)=>{

})

router.get('/avatars', (req, res)=>{

})

router.use('/user', userRouter)
router.use('space', spaceRouter)
router.use('admin', adminRouter);
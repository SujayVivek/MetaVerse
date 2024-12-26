const axios = require("axios");

const BACKEND_URL = "http://localhost:3000"

describe("Authentication",() =>{
    test('User is able to sign up only once',  async () =>{
        const username = "Sujay"
        const password = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        expect(response.statusCode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        expect(updatedResponse.statusCode).toBe(400);
    });

    test('Signing Succeeds if the username and password is correct', async()=>{
        const username = `Sujay-${Math.random()}`
        const password = "123456"

        const response = axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
    })
})

describe('User Metadata endpoints', () => {
    let token = ""
    let avatarId = ""
    beforeAll( async () =>{
        //this runs before all the tests, so I will test the Auth before 
        const username = `sujay-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: "admin"
        });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })
        token = response.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "Hellnaw",
            "name" : "Timmy"
        })
        avatarId = avatarResponse.body.avatarId
    })

    test("User cant update their MetaData with a wrong Avatar ID",async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: "1232312312"
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        expect(response.statusCode.toBe(400))
    })
    test("User can update their MetaData with a correct Avatar ID",async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        expect(response.statusCode.toBe(200))
    })
    test("User cant update their MetaData if the auth header is not present",async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        })
        expect(response.statusCode.toBe(403))
    })
})

describe('Websocket Tests', ()=>{
    beforeAll(async() =>{
        const username = 'SujayWebs'
        const password = '123456'
        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role:"admin"
        })
    })
})
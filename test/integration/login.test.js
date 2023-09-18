require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user');

const { DB_HOST } = process.env;

describe("login exsisting user", () => {
    beforeAll(async () => {
        await mongoose.connect(DB_HOST)
            .then(() => {
                console.log("DB connected")
            })
            .catch((error) => {
                console.log(error)
            })
    })

    it("let exsisting user log in", async () => {
        const response = await request(app).post('/api/users/login').send({
            email: "emily1@ukr.net",
            password: "180817",
            subscription: "starter"
        })

        console.log("Response:", response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body.user.email).toBe("emily1@ukr.net");
        expect(response.body.user.subscription).toBe("starter");
        expect(response.body).toHaveProperty('token');
    })
})

afterAll(async () => {
    await mongoose.disconnect(DB_HOST).then(() => {
      console.log('DB disconnected')
    })
})
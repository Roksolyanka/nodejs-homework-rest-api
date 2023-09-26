import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import User from "../../models/User.js";

const { DB_HOST_TEST, JWT_SECRET } = process.env;

describe("test signin route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(3300);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test signin with correct data", async () => {
    const signinData = {
      email: "example@gmail.com",
      password: "examplepassword",
    };

    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(signinData);
    expect(statusCode).toBe(200);
    const user = await User.findOne({ email: signinData.email });
    expect(user).not.toBeNull();
    const { _id: id } = user;
    const payload = {
      id,
    };
    expect(body.token).toBe(
      jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" })
    );
    expect(typeof body.token).toBe("string");
    expect(body.user.email).toBe(signinData.email);
    expect(typeof body.user.email).toBe("string");
    expect(body.user.subscription).toBe("starter");
    expect(typeof body.user.subscription).toBe("string");
  });
});

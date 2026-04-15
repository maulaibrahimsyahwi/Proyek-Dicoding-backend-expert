import request from "supertest";
import pool from "../../database/postgres/pool.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import container from "../../container.js";
import createServer from "../createServer.js";
import JwtTokenManager from "../../security/JwtTokenManager.js";
import jwt from "jsonwebtoken";

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      const app = await createServer(container);
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      const response = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "sebuah thread",
          body: "sebuah body thread",
        });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedThread).toBeDefined();
    });

    it("should response 400 when payload is bad", async () => {
      const app = await createServer(container);
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      const response = await request(app)
        .post("/threads")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "sebuah thread",
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual("fail");
    });

    it("should response 401 when no token provided", async () => {
      const app = await createServer(container);

      const response = await request(app).post("/threads").send({
        title: "sebuah thread",
        body: "sebuah body thread",
      });

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual("fail");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and return thread detail", async () => {
      const app = await createServer(container);
      const threadId = "thread-123";
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "userlain" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toEqual(threadId);
    });

    it("should response 404 when thread not found", async () => {
      const app = await createServer(container);
      const response = await request(app).get("/threads/thread-notfound");

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("fail");
    });
  });
});

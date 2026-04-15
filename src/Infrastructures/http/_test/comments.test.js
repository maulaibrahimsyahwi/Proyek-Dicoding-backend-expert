import request from "supertest";
import pool from "../../database/postgres/pool.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper.js";
import container from "../../container.js";
import createServer from "../createServer.js";
import JwtTokenManager from "../../security/JwtTokenManager.js";
import jwt from "jsonwebtoken";

describe("/threads/{threadId}/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
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

      const threadId = "thread-123";
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-123",
      });

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: "sebuah komentar",
        });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("success");
      expect(response.body.data.addedComment).toBeDefined();
    });

    it("should response 401 when no token provided", async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post("/threads/thread-123/comments")
        .send({
          content: "sebuah komentar",
        });

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual("fail");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and soft delete comment", async () => {
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

      const threadId = "thread-123";
      const commentId = "comment-123";

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: "user-123",
      });

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");
    });

    it("should response 403 when trying to delete other user comment", async () => {
      const app = await createServer(container);
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: "user-penyusup",
        username: "penyusup",
      });
      await UsersTableTestHelper.addUser({
        id: "user-penyusup",
        username: "penyusup",
      });

      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({
        id: "user-pemilik",
        username: "pemilik",
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-pemilik",
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: "user-pemilik",
      });

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual("fail");
    });

    it("should response 401 when no token provided", async () => {
      const app = await createServer(container);

      const response = await request(app).delete(
        "/threads/thread-123/comments/comment-123",
      );

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual("fail");
    });
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and return success status", async () => {
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
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const response = await request(app)
        .put("/threads/thread-123/comments/comment-123/likes")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");
    });

    it("should response 401 when no token provided", async () => {
      const app = await createServer(container);

      const response = await request(app).put(
        "/threads/thread-123/comments/comment-123/likes",
      );

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual("fail");
    });

    it("should response 404 when thread or comment not found", async () => {
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
        .put("/threads/thread-xxx/comments/comment-xxx/likes")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("fail");
    });
  });
});

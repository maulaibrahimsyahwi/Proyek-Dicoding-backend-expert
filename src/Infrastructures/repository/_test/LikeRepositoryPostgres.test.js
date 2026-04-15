import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import LikeRepositoryPostgres from "../LikeRepositoryPostgres.js";

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("should persist like to database", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await likeRepositoryPostgres.addLike(
        "thread-123",
        "comment-123",
        "user-123",
      );

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
    });
  });

  describe("deleteLike function", () => {
    it("should delete like from database", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.deleteLike(
        "thread-123",
        "comment-123",
        "user-123",
      );

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(0);
    });
  });

  describe("verifyLike function", () => {
    it("should return true when like exists", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.verifyLike(
        "thread-123",
        "comment-123",
        "user-123",
      );
      expect(isLiked).toEqual(true);
    });

    it("should return false when like does not exist", async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.verifyLike(
        "thread-123",
        "comment-123",
        "user-123",
      );
      expect(isLiked).toEqual(false);
    });
  });
});

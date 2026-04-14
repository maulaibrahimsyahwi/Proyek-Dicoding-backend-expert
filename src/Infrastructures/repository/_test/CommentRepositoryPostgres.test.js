import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import NewComment from "../../../Domains/comments/entities/NewComment.js";
import AddedComment from "../../../Domains/comments/entities/AddedComment.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      const userId = "user-comment-test-1";
      const threadId = "thread-comment-test-1";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment1",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const newComment = new NewComment({
        threadId: threadId,
        content: "sebuah komentar",
        owner: userId,
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentRepositoryPostgres.addComment(newComment);

      const comments =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      const userId = "user-comment-test-2";
      const threadId = "thread-comment-test-2";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment2",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const newComment = new NewComment({
        threadId: threadId,
        content: "sebuah komentar",
        owner: userId,
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedComment =
        await commentRepositoryPostgres.addComment(newComment);

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah komentar",
          owner: userId,
        }),
      );
    });
  });

  describe("verifyCommentAvailability function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability("comment-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment available", async () => {
      const userId = "user-comment-test-3";
      const threadId = "thread-comment-test-3";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment3",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(commentId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when provided userId is not the comment owner", async () => {
      const userId = "user-comment-test-4";
      const threadId = "thread-comment-test-4";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment4",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, "user-lain"),
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when provided userId is the comment owner", async () => {
      const userId = "user-comment-test-5";
      const threadId = "thread-comment-test-5";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment5",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, userId),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should update is_delete to true", async () => {
      const userId = "user-comment-test-6";
      const threadId = "thread-comment-test-6";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "usercomment6",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment(commentId);

      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments[0].is_delete).toEqual(true);
    });
  });
});

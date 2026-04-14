import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import NewComment from "../../../Domains/comments/entities/NewComment.js";
import AddedComment from "../../../Domains/comments/entities/AddedComment.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";

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
});

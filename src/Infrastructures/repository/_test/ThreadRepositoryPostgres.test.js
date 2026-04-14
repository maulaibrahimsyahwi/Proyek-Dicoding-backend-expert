import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import pool from "../../database/postgres/pool.js";
import NewThread from "../../../Domains/threads/entities/NewThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres.js";

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      const userId = "user-thread-1";
      const threadId = "thread-test-1";
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding-thread-1",
      });

      const newThread = new NewThread({
        title: "sebuah thread",
        body: "isi dari sebuah thread",
        owner: userId,
      });
      const fakeIdGenerator = () => "test-1";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById(threadId);
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      const userId = "user-thread-2";
      const threadId = "thread-test-2";
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding-thread-2",
      });

      const newThread = new NewThread({
        title: "sebuah thread",
        body: "isi dari sebuah thread",
        owner: userId,
      });
      const fakeIdGenerator = () => "test-2";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: threadId,
          title: "sebuah thread",
          owner: userId,
        }),
      );
    });
  });

  describe("checkAvailabilityThread function", () => {
    it("should throw NotFoundError when thread not available", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.checkAvailabilityThread("thread-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread available", async () => {
      const userId = "user-thread-3";
      const threadId = "thread-test-3";
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding-thread-3",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.checkAvailabilityThread(threadId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});

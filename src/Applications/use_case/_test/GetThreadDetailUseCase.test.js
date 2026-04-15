import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
    };

    const expectedThreadDetail = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "dicoding",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          likeCount: 0,
        },
        {
          id: "comment-456",
          username: "johndoe",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
          likeCount: 0,
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = vi.fn().mockImplementation(() =>
      Promise.resolve({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
      }),
    );

    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-123",
            username: "dicoding",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            isDelete: false,
            likeCount: 0,
          },
          {
            id: "comment-456",
            username: "johndoe",
            date: "2021-08-08T07:26:21.338Z",
            content: "sebuah comment",
            isDelete: true,
            likeCount: 0,
          },
        ]),
      );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    expect(threadDetail).toEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});

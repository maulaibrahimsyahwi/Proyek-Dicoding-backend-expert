import { vi } from "vitest";
import DetailThread from "../../../Domains/threads/entities/DetailThread.js";
import DetailComment from "../../../Domains/comments/entities/DetailComment.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
    };

    const expectedThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const expectedComments = [
      {
        id: "comment-1",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        isDelete: false,
      },
      {
        id: "comment-2",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "komentar rahasia",
        isDelete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = vi
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );

    expect(threadDetail).toBeInstanceOf(DetailThread);
    expect(threadDetail.id).toEqual(expectedThread.id);
    expect(threadDetail.title).toEqual(expectedThread.title);
    expect(threadDetail.body).toEqual(expectedThread.body);
    expect(threadDetail.date).toEqual(expectedThread.date);
    expect(threadDetail.username).toEqual(expectedThread.username);

    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0]).toBeInstanceOf(DetailComment);
    expect(threadDetail.comments[0].id).toEqual(expectedComments[0].id);
    expect(threadDetail.comments[0].content).toEqual(
      expectedComments[0].content,
    );

    expect(threadDetail.comments[1]).toBeInstanceOf(DetailComment);
    expect(threadDetail.comments[1].id).toEqual(expectedComments[1].id);
    expect(threadDetail.comments[1].content).toEqual(
      "**komentar telah dihapus**",
    );
  });
});

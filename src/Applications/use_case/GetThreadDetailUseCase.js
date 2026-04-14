import DetailThread from "../../Domains/threads/entities/DetailThread.js";
import DetailComment from "../../Domains/comments/entities/DetailComment.js";

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments =
      await this._commentRepository.getCommentsByThreadId(threadId);

    const detailThread = new DetailThread(thread);
    detailThread.comments = comments.map(
      (comment) => new DetailComment(comment),
    );

    return detailThread;
  }
}

export default GetThreadDetailUseCase;

class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const isLiked = await this._likeRepository.verifyLike(
      threadId,
      commentId,
      owner,
    );

    if (isLiked) {
      await this._likeRepository.deleteLike(threadId, commentId, owner);
    } else {
      await this._likeRepository.addLike(threadId, commentId, owner);
    }
  }
}

export default ToggleLikeCommentUseCase;

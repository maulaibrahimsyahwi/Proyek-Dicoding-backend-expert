class LikeRepository {
  async addLike(threadId, commentId, owner) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteLike(threadId, commentId, owner) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyLike(threadId, commentId, owner) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

export default LikeRepository;

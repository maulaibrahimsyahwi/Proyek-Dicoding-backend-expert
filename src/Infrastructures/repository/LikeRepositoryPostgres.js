import LikeRepository from "../../Domains/likes/LikeRepository.js";

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(threadId, commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
      values: [id, threadId, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(threadId, commentId, owner) {
    const query = {
      text: "DELETE FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3",
      values: [threadId, commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyLike(threadId, commentId, owner) {
    const query = {
      text: "SELECT id FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3",
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }
}

export default LikeRepositoryPostgres;

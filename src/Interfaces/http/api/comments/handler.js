import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthenticationError("Missing authentication");
      }

      const token = authHeader.split(" ")[1];
      const authenticationTokenManager = this._container.getInstance(
        "AuthenticationTokenManager",
      );

      await authenticationTokenManager.verifyAccessToken(token);
      const { id: owner } =
        await authenticationTokenManager.decodePayload(token);

      const { threadId } = req.params;
      const addCommentUseCase =
        this._container.getInstance("AddCommentUseCase");

      const addedComment = await addCommentUseCase.execute(
        { ...req.body, threadId },
        owner,
      );

      return res.status(201).json({
        status: "success",
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AuthenticationError("Missing authentication");
      }

      const token = authHeader.split(" ")[1];
      const authenticationTokenManager = this._container.getInstance(
        "AuthenticationTokenManager",
      );

      await authenticationTokenManager.verifyAccessToken(token);
      const { id: owner } =
        await authenticationTokenManager.decodePayload(token);

      const { threadId, commentId } = req.params;
      const deleteCommentUseCase = this._container.getInstance(
        "DeleteCommentUseCase",
      );

      await deleteCommentUseCase.execute({ threadId, commentId, owner });

      return res.status(200).json({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;

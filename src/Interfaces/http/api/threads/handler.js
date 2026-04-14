import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
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

      const addThreadUseCase = this._container.getInstance("AddThreadUseCase");
      const addedThread = await addThreadUseCase.execute(req.body, owner);

      return res.status(201).json({
        status: "success",
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadsHandler;

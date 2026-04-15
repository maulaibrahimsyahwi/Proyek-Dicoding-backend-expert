import express from "express";

const createCommentsRouter = (handler) => {
  const router = express.Router();

  router.post("/threads/:threadId/comments", handler.postCommentHandler);
  router.delete(
    "/threads/:threadId/comments/:commentId",
    handler.deleteCommentHandler,
  );
  router.put(
    "/threads/:threadId/comments/:commentId/likes",
    handler.putLikeCommentHandler,
  );

  return router;
};

export default createCommentsRouter;

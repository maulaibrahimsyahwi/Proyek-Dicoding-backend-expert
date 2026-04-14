import express from "express";

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post("/", handler.postThreadHandler);
  router.get("/:threadId", handler.getThreadByIdHandler);

  return router;
};

export default createThreadsRouter;

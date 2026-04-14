import express from "express";

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post("/", handler.postThreadHandler);

  return router;
};

export default createThreadsRouter;

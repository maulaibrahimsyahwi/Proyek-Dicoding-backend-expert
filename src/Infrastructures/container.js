import { createContainer } from "instances-container";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import pool from "./database/postgres/pool.js";
import jwt from "jsonwebtoken";

import UserRepositoryPostgres from "./repository/UserRepositoryPostgres.js";
import AuthenticationRepositoryPostgres from "./repository/AuthenticationRepositoryPostgres.js";
import ThreadRepositoryPostgres from "./repository/ThreadRepositoryPostgres.js";
import CommentRepositoryPostgres from "./repository/CommentRepositoryPostgres.js";
import LikeRepositoryPostgres from "./repository/LikeRepositoryPostgres.js";

import BcryptPasswordHash from "./security/BcryptPasswordHash.js";
import JwtTokenManager from "./security/JwtTokenManager.js";

import AddUserUseCase from "../Applications/use_case/AddUserUseCase.js";
import LoginUserUseCase from "../Applications/use_case/LoginUserUseCase.js";
import LogoutUserUseCase from "../Applications/use_case/LogoutUserUseCase.js";
import RefreshAuthenticationUseCase from "../Applications/use_case/RefreshAuthenticationUseCase.js";
import AddThreadUseCase from "../Applications/use_case/AddThreadUseCase.js";
import AddCommentUseCase from "../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../Applications/use_case/DeleteCommentUseCase.js";
import GetThreadDetailUseCase from "../Applications/use_case/GetThreadDetailUseCase.js";
import ToggleLikeCommentUseCase from "../Applications/use_case/ToggleLikeCommentUseCase.js";

const container = createContainer();

container.register([
  {
    key: "UserRepository",
    Class: UserRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }, { concrete: nanoid }] },
  },
  {
    key: "AuthenticationRepository",
    Class: AuthenticationRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }] },
  },
  {
    key: "ThreadRepository",
    Class: ThreadRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }, { concrete: nanoid }] },
  },
  {
    key: "CommentRepository",
    Class: CommentRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }, { concrete: nanoid }] },
  },
  {
    key: "LikeRepository",
    Class: LikeRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }, { concrete: nanoid }] },
  },
  {
    key: "PasswordHash",
    Class: BcryptPasswordHash,
    parameter: { dependencies: [{ concrete: bcrypt }] },
  },
  {
    key: "AuthenticationTokenManager",
    Class: JwtTokenManager,
    parameter: { dependencies: [{ concrete: jwt }] },
  },
]);

container.register([
  {
    key: "AddUserUseCase",
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "userRepository", internal: "UserRepository" },
        { name: "passwordHash", internal: "PasswordHash" },
      ],
    },
  },
  {
    key: "LoginUserUseCase",
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "userRepository", internal: "UserRepository" },
        {
          name: "authenticationRepository",
          internal: "AuthenticationRepository",
        },
        {
          name: "authenticationTokenManager",
          internal: "AuthenticationTokenManager",
        },
        { name: "passwordHash", internal: "PasswordHash" },
      ],
    },
  },
  {
    key: "LogoutUserUseCase",
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: "AuthenticationRepository",
        },
      ],
    },
  },
  {
    key: "RefreshAuthenticationUseCase",
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: "AuthenticationRepository",
        },
        {
          name: "authenticationTokenManager",
          internal: "AuthenticationTokenManager",
        },
      ],
    },
  },
  {
    key: "AddThreadUseCase",
    Class: AddThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: "ThreadRepository" },
      ],
    },
  },
  {
    key: "AddCommentUseCase",
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "commentRepository", internal: "CommentRepository" },
        { name: "threadRepository", internal: "ThreadRepository" },
      ],
    },
  },
  {
    key: "DeleteCommentUseCase",
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: "ThreadRepository" },
        { name: "commentRepository", internal: "CommentRepository" },
      ],
    },
  },
  {
    key: "GetThreadDetailUseCase",
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: "ThreadRepository" },
        { name: "commentRepository", internal: "CommentRepository" },
      ],
    },
  },
  {
    key: "ToggleLikeCommentUseCase",
    Class: ToggleLikeCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: "ThreadRepository" },
        { name: "commentRepository", internal: "CommentRepository" },
        { name: "likeRepository", internal: "LikeRepository" },
      ],
    },
  },
]);

export default container;

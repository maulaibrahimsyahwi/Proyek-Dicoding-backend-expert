
```
forum-api-starter-project
├─ config
│  └─ database
├─ eslint.config.js
├─ migrations
│  ├─ 1627983516963_create-table-users.js
│  ├─ 1627983555473_create-table-authentications.js
│  ├─ 1776168005025_create-table-threads.js
│  └─ 1776169190905_create-table-comments.js
├─ package.json
├─ src
│  ├─ app.js
│  ├─ Applications
│  │  ├─ security
│  │  │  ├─ AuthenticationTokenManager.js
│  │  │  ├─ PasswordHash.js
│  │  │  └─ _test
│  │  │     ├─ AuthenticationTokenManager.test.js
│  │  │     └─ PasswordHash.test.js
│  │  └─ use_case
│  │     ├─ AddCommentUseCase.js
│  │     ├─ AddThreadUseCase.js
│  │     ├─ AddUserUseCase.js
│  │     ├─ DeleteAuthenticationUseCase.js
│  │     ├─ DeleteCommentUseCase.js
│  │     ├─ GetThreadDetailUseCase.js
│  │     ├─ LoginUserUseCase.js
│  │     ├─ LogoutUserUseCase.js
│  │     ├─ RefreshAuthenticationUseCase.js
│  │     └─ _test
│  │        ├─ AddCommentUseCase.test.js
│  │        ├─ AddThreadUseCase.test.js
│  │        ├─ AddUserUseCase.test.js
│  │        ├─ DeleteAuthenticationUseCase.test.js
│  │        ├─ DeleteCommentUseCase.test.js
│  │        ├─ GetThreadDetailUseCase.test.js
│  │        ├─ LoginUserUseCase.test.js
│  │        ├─ LogoutUserUseCase.test.js
│  │        └─ RefreshAuthenticationUseCase.test.js
│  ├─ Commons
│  │  ├─ config.js
│  │  └─ exceptions
│  │     ├─ AuthenticationError.js
│  │     ├─ AuthorizationError.js
│  │     ├─ ClientError.js
│  │     ├─ DomainErrorTranslator.js
│  │     ├─ InvariantError.js
│  │     ├─ NotFoundError.js
│  │     └─ _test
│  │        ├─ AuthenticationError.test.js
│  │        ├─ AuthorizationError.test.js
│  │        ├─ ClientError.test.js
│  │        ├─ DomainErrorTranslator.test.js
│  │        ├─ InvariantError.test.js
│  │        └─ NotFoundError.test.js
│  ├─ Domains
│  │  ├─ authentications
│  │  │  ├─ AuthenticationRepository.js
│  │  │  ├─ entities
│  │  │  │  ├─ NewAuth.js
│  │  │  │  └─ _test
│  │  │  │     └─ NewAuth.test.js
│  │  │  └─ _test
│  │  │     └─ AuthenticationRepository.test.js
│  │  ├─ comments
│  │  │  ├─ CommentRepository.js
│  │  │  ├─ entities
│  │  │  │  ├─ AddedComment.js
│  │  │  │  ├─ NewComment.js
│  │  │  │  └─ _test
│  │  │  │     ├─ AddedComment.test.js
│  │  │  │     └─ NewComment.test.js
│  │  │  └─ _test
│  │  │     └─ CommentRepository.test.js
│  │  ├─ threads
│  │  │  ├─ entities
│  │  │  │  ├─ AddedThread.js
│  │  │  │  ├─ DetailComment.js
│  │  │  │  ├─ DetailThread.js
│  │  │  │  ├─ NewThread.js
│  │  │  │  └─ _test
│  │  │  │     ├─ DetailComment.test.js
│  │  │  │     └─ DetailThread.test.js
│  │  │  ├─ ThreadRepository.js
│  │  │  └─ _test
│  │  │     └─ ThreadRepository.test.js
│  │  └─ users
│  │     ├─ entities
│  │     │  ├─ RegisteredUser.js
│  │     │  ├─ RegisterUser.js
│  │     │  ├─ UserLogin.js
│  │     │  └─ _test
│  │     │     ├─ RegisteredUser.test.js
│  │     │     ├─ RegisterUser.test.js
│  │     │     └─ UserLogin.test.js
│  │     ├─ UserRepository.js
│  │     └─ _test
│  │        └─ UserRepository.test.js
│  ├─ Infrastructures
│  │  ├─ container.js
│  │  ├─ database
│  │  │  └─ postgres
│  │  │     └─ pool.js
│  │  ├─ http
│  │  │  ├─ createServer.js
│  │  │  └─ _test
│  │  │     └─ createServer.test.js
│  │  ├─ repository
│  │  │  ├─ AuthenticationRepositoryPostgres.js
│  │  │  ├─ CommentRepositoryPostgres.js
│  │  │  ├─ ThreadRepositoryPostgres.js
│  │  │  ├─ UserRepositoryPostgres.js
│  │  │  └─ _test
│  │  │     ├─ AuthenticationRepositoryPostgres.test.js
│  │  │     ├─ CommentRepositoryPostgres.test.js
│  │  │     ├─ ThreadRepositoryPostgres.test.js
│  │  │     └─ UserRepositoryPostgres.test.js
│  │  └─ security
│  │     ├─ BcryptPasswordHash.js
│  │     ├─ JwtTokenManager.js
│  │     └─ _test
│  │        ├─ BcryptEncryptionHelper.test.js
│  │        ├─ BcryptPasswordHash.test.js
│  │        └─ JwtTokenManager.test.js
│  └─ Interfaces
│     └─ http
│        ├─ api
│        │  ├─ authentications
│        │  │  ├─ handler.js
│        │  │  ├─ index.js
│        │  │  └─ routes.js
│        │  ├─ comments
│        │  │  ├─ handler.js
│        │  │  ├─ index.js
│        │  │  └─ routes.js
│        │  ├─ threads
│        │  │  ├─ handler.js
│        │  │  ├─ index.js
│        │  │  └─ routes.js
│        │  └─ users
│        │     ├─ handler.js
│        │     ├─ index.js
│        │     └─ routes.js
│        └─ createServer.js
├─ tests
│  ├─ AuthenticationsTableTestHelper.js
│  ├─ CommentsTableTestHelper.js
│  ├─ ThreadsTableTestHelper.js
│  └─ UsersTableTestHelper.js
└─ vitest.config.js

```
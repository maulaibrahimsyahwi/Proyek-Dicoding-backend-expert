import { describe, expect, it, vi } from "vitest";
import InvariantError from "../../../Commons/exceptions/InvariantError.js";
import AuthenticationError from "../../../Commons/exceptions/AuthenticationError.js";
import JwtTokenManager from "../JwtTokenManager.js";
import config from "../../../Commons/config.js";

describe("JwtTokenManager", () => {
  describe("createAccessToken function", () => {
    it("should create accessToken correctly", async () => {
      const payload = { username: "dicoding" };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => "mock_token"),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(mockJwtToken.sign).toBeCalledWith(
        payload,
        config.auth.accessTokenKey,
      );
      expect(accessToken).toEqual("mock_token");
    });
  });

  describe("createRefreshToken function", () => {
    it("should create refreshToken correctly", async () => {
      const payload = { username: "dicoding" };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => "mock_token"),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(mockJwtToken.sign).toBeCalledWith(
        payload,
        config.auth.refreshTokenKey,
      );
      expect(refreshToken).toEqual("mock_token");
    });
  });

  describe("verifyRefreshToken function", () => {
    it("should throw InvariantError when verification failed", async () => {
      const mockJwtToken = {
        verify: vi.fn().mockImplementation(() => {
          throw new Error("mock error");
        }),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      await expect(
        jwtTokenManager.verifyRefreshToken("dummy_token"),
      ).rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError when refresh token verified", async () => {
      const mockJwtToken = { verify: vi.fn().mockImplementation(() => true) };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      await expect(
        jwtTokenManager.verifyRefreshToken("dummy_token"),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe("verifyAccessToken function", () => {
    it("should throw AuthenticationError when verification failed", async () => {
      const mockJwtToken = {
        verify: vi.fn().mockImplementation(() => {
          throw new Error("mock error");
        }),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      await expect(
        jwtTokenManager.verifyAccessToken("dummy_token"),
      ).rejects.toThrow(AuthenticationError);
    });

    it("should not throw AuthenticationError when access token verified", async () => {
      const mockJwtToken = { verify: vi.fn().mockImplementation(() => true) };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      await expect(
        jwtTokenManager.verifyAccessToken("dummy_token"),
      ).resolves.not.toThrow(AuthenticationError);
    });
  });

  describe("decodePayload function", () => {
    it("should decode payload correctly", async () => {
      const mockJwtToken = {
        decode: vi.fn().mockImplementation(() => ({ username: "dicoding" })),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const { username: expectedUsername } =
        await jwtTokenManager.decodePayload("dummy_token");

      expect(expectedUsername).toEqual("dicoding");
    });
  });
});

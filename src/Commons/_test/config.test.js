import { describe, it, expect, vi, afterEach } from "vitest";

describe("config environment", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("should load .env correctly and set debug when NODE_ENV is development", async () => {
    process.env.NODE_ENV = "development";

    const config = (await import("../config.js")).default;

    expect(config.app.host).toEqual("localhost");
    expect(config.app.debug).toEqual({ request: ["error"] });
  });

  it("should set host to 0.0.0.0 and disable debug when NODE_ENV is production", async () => {
    process.env.NODE_ENV = "production";

    const config = (await import("../config.js")).default;

    expect(config.app.host).toEqual("0.0.0.0");
    expect(config.app.debug).toEqual({});
  });
});

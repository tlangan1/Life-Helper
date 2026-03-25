import { afterEach, vi } from "vitest";

// jsdom intentionally does not implement alert; stub it for tests.
vi.stubGlobal("alert", vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

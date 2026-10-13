import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siteRoutes } from "./routes";

const MAX_BYTES = 180 * 1024; // WhatsApp drops large preview images

/** Width and height from the first SOF marker of a JPEG. */
const jpegSize = (buf: Buffer): { width: number; height: number } => {
  expect(buf.subarray(0, 2).toString("hex")).toBe("ffd8");
  let i = 2;
  while (i < buf.length) {
    expect(buf[i]).toBe(0xff);
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error("no SOF marker");
};

describe("share images", () => {
  for (const route of siteRoutes) {
    it(`${route.path} has a 1200×630 JPEG of at most 180 KB`, () => {
      const file = path.join(process.cwd(), "public", route.meta.ogImage);
      expect(statSync(file).size).toBeLessThanOrEqual(MAX_BYTES);
      expect(jpegSize(readFileSync(file))).toEqual({ width: 1200, height: 630 });
    });
  }
});

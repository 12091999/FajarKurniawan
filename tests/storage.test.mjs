import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { validatePortfolioImage } from "../lib/storage.ts"

describe("portfolio image validation", () => {
  it("accepts supported image types within the size limit", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      assert.doesNotThrow(() => validatePortfolioImage({ type, size: 5 * 1024 * 1024 }))
    }
  })

  it("rejects unsupported types and images larger than 5 MB", () => {
    assert.throws(() => validatePortfolioImage({ type: "image/svg+xml", size: 10 }), /JPG, PNG, atau WebP/)
    assert.throws(() => validatePortfolioImage({ type: "image/png", size: 5 * 1024 * 1024 + 1 }), /maksimal 5 MB/)
  })
})

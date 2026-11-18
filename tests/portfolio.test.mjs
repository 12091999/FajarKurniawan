import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getNextProjectSortOrder } from "../lib/portfolio.ts"

describe("project display order", () => {
  it("starts at zero when there are no projects", () => {
    assert.equal(getNextProjectSortOrder([]), 0)
  })

  it("uses the position after the highest existing order", () => {
    assert.equal(
      getNextProjectSortOrder([
        { sort_order: 2 },
        { sort_order: null },
        { sort_order: 0 },
      ]),
      3,
    )
  })
})

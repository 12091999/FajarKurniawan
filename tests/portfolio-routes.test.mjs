import assert from "node:assert/strict"
import { describe, it } from "node:test"

const baseUrl = process.env.APP_BASE_URL || "http://127.0.0.1:3107"

async function get(path) {
  return fetch(new URL(path, baseUrl), { redirect: "manual" })
}

describe("public portfolio HTTP behavior", () => {
  it("serves the home page to visitors without login", async () => {
    const response = await get("/")
    assert.equal(response.status, 200)
    assert.match(await response.text(), /Fajar/)
  })

  it("serves the projects section on the public page", async () => {
    const response = await get("/#projects")
    assert.equal(response.status, 200)
    assert.match(await response.text(), /id="projects"/)
  })

  it("serves the contact section on the public page", async () => {
    const response = await get("/#contact")
    assert.equal(response.status, 200)
    assert.match(await response.text(), /id="contact"/)
  })

  it("serves the admin login page", async () => {
    const response = await get("/admin/login")
    assert.equal(response.status, 200)
    assert.match(await response.text(), /Admin Login/)
  })

  it("redirects unauthenticated dashboard requests to login", async () => {
    const response = await get("/admin/dashboard")
    assert.equal(response.status, 307)
    assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, "/admin/login")
  })
})

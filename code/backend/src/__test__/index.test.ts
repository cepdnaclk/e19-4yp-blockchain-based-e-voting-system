import request from "supertest";
import app from "../index";

describe("Index file", () => {
  it("should pass a basic test", () => {
    expect(true).toBe(true);
  });

  it("GET /api/test should return 200", async () => {
    const res = await request(app).get("/api/test");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Success" });
  });
});

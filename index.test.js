const request = require("supertest");
const app = require("./index");

describe("GET /", () => {
    test("should return 200 and success message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Node.js app running on EC2");
    });
});

describe("GET /health", () => {
    test("should return 200 and ok status", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
        expect(res.body.timestamp).toBeDefined();
    });
});

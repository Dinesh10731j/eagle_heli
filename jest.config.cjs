/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  setupFiles: ["<rootDir>/tests/setup.ts"],
};

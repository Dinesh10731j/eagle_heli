import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  setupFiles: ["<rootDir>/tests/setup.ts"],
};

export default config;

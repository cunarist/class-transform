#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  package: {
    // package.json properties
    name: "class-transform",
    version: "0.7.0",
    description: "Transformation between plain objects and class instances",
    license: "MIT",
    author: "Cunarist",
    repository: {
      type: "git",
      url: "git+https://github.com/cunarist/class-transform.git",
    },
    bugs: {
      url: "https://github.com/cunarist/class-transform/issues",
    },
    homepage: "https://github.com/cunarist/class-transform#readme",
    keywords: [
      "type",
      "javascript",
      "object-to-class",
      "class-to-object",
      "deno",
      "typescript",
    ],
    engines: {
      node: ">=14.0.0",
    },
    type: "module",
    main: "./esm/index.js",
    types: "./types/index.d.ts",
    exports: {
      ".": {
        "import": "./esm/index.js",
        "types": "./types/index.d.ts",
      },
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.copyFileSync("CHANGELOG.md", "npm/CHANGELOG.md");
  },
});

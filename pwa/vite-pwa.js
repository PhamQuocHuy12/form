import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Cache only the built app shell. Firebase traffic and user data never enter it.
export function installableApp() {
  let config;
  return {
    name: "form-installable-app",
    apply: "build",
    configResolved(value) {
      config = value;
    },
    async writeBundle() {
      const output = resolve(config.root, config.build.outDir);
      async function list(directory, prefix = "") {
        const entries = await readdir(directory, { withFileTypes: true });
        const files = await Promise.all(
          entries.map((entry) =>
            entry.isDirectory()
              ? list(resolve(directory, entry.name), `${prefix}${entry.name}/`)
              : `${prefix}${entry.name}`,
          ),
        );
        return files.flat();
      }
      const files = (await list(output))
        .filter((file) => file !== "sw.js" && !file.endsWith(".map"))
        .sort();
      const template = await readFile(
        new URL("./service-worker.js", import.meta.url),
        "utf8",
      );
      const hash = createHash("sha256").update(template);
      for (const file of files) {
        hash.update(file).update(await readFile(resolve(output, file)));
      }
      const source = template
        .replace(
          "__BUILD_VERSION__",
          JSON.stringify(hash.digest("hex").slice(0, 20)),
        )
        .replace("__APP_FILES__", JSON.stringify(files));
      await writeFile(resolve(output, "sw.js"), source);
    },
  };
}

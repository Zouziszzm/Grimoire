#!/usr/bin/env node
import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { execa } from "execa";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();
const PACKAGE_ROOT = path.join(__dirname, "..");
const REGISTRY_PATH = path.join(PACKAGE_ROOT, "registry.json");
const TEMPLATES_PATH = path.join(PACKAGE_ROOT, "templates");
async function getRegistry() {
    return fs.readJSON(REGISTRY_PATH);
}
program
    .name("apex-cli")
    .description("CLI to add components to your Next.js project")
    .version("1.0.0");
program
    .command("init")
    .description("Initialize components.json and base utilities")
    .action(async () => {
    const response = await prompts([
        {
            type: "text",
            name: "componentsPath",
            message: "Where do you want to save your components?",
            initial: "src/components",
        },
        {
            type: "text",
            name: "utilsPath",
            message: "Where do you want to save your utilities?",
            initial: "src/lib",
        },
    ]);
    const config = {
        paths: {
            components: response.componentsPath,
            utils: response.utilsPath,
        },
    };
    await fs.writeJSON("components.json", config, { spaces: 2 });
    console.log(chalk.green("✔ components.json created."));
    // Create utils.ts if it doesn't exist
    const utilsDir = path.join(process.cwd(), config.paths.utils);
    await fs.ensureDir(utilsDir);
    const utilsFile = path.join(utilsDir, "utils.ts");
    if (!(await fs.pathExists(utilsFile))) {
        await fs.writeFile(utilsFile, `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`);
        console.log(chalk.green(`✔ ${config.paths.utils}/utils.ts created.`));
    }
});
program
    .command("add")
    .description("Add a component to your project")
    .argument("[component]", "The component to add")
    .action(async (componentName) => {
    const configPath = path.join(process.cwd(), "components.json");
    if (!(await fs.pathExists(configPath))) {
        console.error(chalk.red("Error: components.json not found. Run 'init' first."));
        return;
    }
    const config = await fs.readJSON(configPath);
    const registry = await getRegistry();
    if (!componentName) {
        const response = await prompts({
            type: "select",
            name: "component",
            message: "Select a component to add",
            choices: Object.keys(registry).map((key) => ({
                title: registry[key].name,
                value: key,
            })),
        });
        componentName = response.component;
    }
    if (!registry[componentName]) {
        console.error(chalk.red(`Error: Component '${componentName}' not found in registry.`));
        return;
    }
    const componentsToInstall = new Set();
    const localDepsToProcess = [componentName];
    const processedLocalDeps = new Set();
    while (localDepsToProcess.length > 0) {
        const current = localDepsToProcess.shift();
        if (processedLocalDeps.has(current))
            continue;
        processedLocalDeps.add(current);
        const comp = registry[current];
        if (!comp)
            continue;
        // Add npm dependencies
        comp.dependencies?.forEach((d) => componentsToInstall.add(d));
        // Add local dependencies to queue
        comp.localDependencies?.forEach((d) => localDepsToProcess.push(d));
        // Copy files
        for (const file of comp.files) {
            // Files are now stored inside the package templates directory
            // comp.files should be relative to TEMPLATES_PATH
            const sourceFile = path.join(TEMPLATES_PATH, file.replace("src/", ""));
            // Determine target path based on file type
            let targetPath = "";
            if (file.includes("src/components")) {
                targetPath = path.join(process.cwd(), config.paths.components, path.basename(file));
            }
            else if (file.includes("src/contexts")) {
                const contextDir = path.join(process.cwd(), "src/contexts");
                await fs.ensureDir(contextDir);
                targetPath = path.join(contextDir, path.basename(file));
            }
            else if (file.includes("src/lib")) {
                targetPath = path.join(process.cwd(), config.paths.utils, path.basename(file));
            }
            else {
                targetPath = path.join(process.cwd(), file);
            }
            await fs.ensureDir(path.dirname(targetPath));
            if (await fs.pathExists(sourceFile)) {
                await fs.copy(sourceFile, targetPath);
                console.log(chalk.cyan(`  → Added ${path.basename(targetPath)}`));
            }
            else {
                console.warn(chalk.yellow(`  ⚠ Source file ${sourceFile} not found.`));
            }
        }
    }
    // Install npm dependencies
    if (componentsToInstall.size > 0) {
        const deps = Array.from(componentsToInstall).join(" ");
        console.log(chalk.yellow(`\nInstalling dependencies: ${deps}...`));
        try {
            // Detect package manager
            let pkgManager = "npm";
            if (await fs.pathExists(path.join(process.cwd(), "pnpm-lock.yaml")))
                pkgManager = "pnpm";
            else if (await fs.pathExists(path.join(process.cwd(), "yarn.lock")))
                pkgManager = "yarn";
            await execa(pkgManager, ["install", ...Array.from(componentsToInstall)], { stdio: "inherit" });
            console.log(chalk.green("✔ Dependencies installed."));
        }
        catch (error) {
            console.error(chalk.red("Error installing dependencies:"), error);
        }
    }
    console.log(chalk.green(`\n✔ Component '${componentName}' and its dependencies added successfully!`));
});
program.parse();
//# sourceMappingURL=index.js.map
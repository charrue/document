import path from "path";
import fs from "fs";
import MarkdownIt from "markdown-it";
import mdContainer from "markdown-it-container";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";

const docRoot = path.resolve(__dirname, "../../");

const localMd = MarkdownIt();
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/;

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string;
}

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, "demo", {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      const data = (md as any).__data;
      const hoistedTags: string[] = data.hoistedTags || (data.hoistedTags = []);

      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      // nesting=1 means the tag is opening
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : "";
        const sourceFileToken = tokens[idx + 2];
        let source = "";
        const sourceFile = sourceFileToken.children?.[0].content ?? "";

        if (sourceFileToken.type === "inline") {
          source = fs.readFileSync(
            path.resolve(docRoot, `${sourceFile}.vue`),
            "utf-8"
          );
          const existingScriptIndex = hoistedTags.findIndex((tag) =>
            scriptSetupRE.test(tag)
          );
          if (existingScriptIndex === -1) {
            hoistedTags.push(`
    <script setup>
      const allDemos = import.meta.globEager("../../**/demo/*.vue");
      const matchedPath = Object.keys(allDemos).find(t => {
        return t.endsWith("${sourceFile}.vue");
      })
      const demoComponent = allDemos[matchedPath].default.render;
    </script>`);
          }
        }

        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

        return `<Demo :demo="demoComponent" source="${source}" description="${encodeURIComponent(
          localMd.render(description)
        )}">`;
      } else {
        return "</Demo>";
      }
    },
  } as ContainerOpts);
};
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Documentation & Explanation Rule
Whenever the user asks for an explanation (e.g., "explain", "explain me", etc.), always generate a `.doc` / `.docx` file in the project documenting and explaining the code and implementation in full detail.

**IMPORTANT:** Do NOT create or leave generator `.mjs` or script files in the project `scripts/` folder when generating documentation. Run generation via scratch directory outside the repository or delete any temporary generator scripts immediately after generation.



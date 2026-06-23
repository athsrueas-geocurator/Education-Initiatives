import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "content/**",
      "_next/**",
      "_not-found/**",
      "404/**",
      "about/**",
      "continuums/**",
      "initiatives/**",
      "methods/**",
      "sources/**",
      "__next.*.txt",
      "index.html",
      "index.txt",
      "404.html"
    ]
  }
];

export default eslintConfig;

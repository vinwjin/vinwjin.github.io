import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".deploy_git/**",
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "themes/**"
    ]
  },
  ...nextVitals
];

export default eslintConfig;

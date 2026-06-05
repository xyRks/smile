import re

with open('src/index.css', 'r') as f:
    css = f.read()

# Update glass utility classes to reflect the flatter, softer theme from the references
# Less blur, subtle borders, matching the darker theme properly.

new_glass = r""".glass {
    @apply bg-white/50 dark:bg-[#2e2d2f]/50 backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm;
  }

  .glass-card {
    @apply bg-white/60 dark:bg-[#2e2d2f]/60 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none;
  }"""

css = re.sub(r'\.glass\s*\{[^}]+\}\s*\.glass-card\s*\{[^}]+\}', new_glass, css, flags=re.MULTILINE)

with open('src/index.css', 'w') as f:
    f.write(css)

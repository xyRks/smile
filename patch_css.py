import re

with open('src/index.css', 'r') as f:
    css = f.read()

# Replace variables in the root and dark layers
# From our palette:
# Dark charcoal: #222825
# Warm off-white: #fbfcf1
# Sage green: #c8d1bc
# Light steel blue: #a7c1d5
# Earthy brown/charcoal: #5f5451

new_root = """  :root {
    --background: #fbfcf1;
    --foreground: #222825;
    --card: #ffffff;
    --card-foreground: #222825;
    --popover: #ffffff;
    --popover-foreground: #222825;
    --primary: #c8d1bc;
    --primary-foreground: #222825;
    --secondary: #f2f5f5;
    --secondary-foreground: #222825;
    --muted: #eddfd3;
    --muted-foreground: #5f5451;
    --accent: #a7c1d5;
    --accent-foreground: #222825;
    --destructive: #eddfd3;
    --destructive-foreground: #222825;
    --border: #c8d1bc;
    --input: #c8d1bc;
    --ring: #c8d1bc;
    --radius: 1rem;
  }"""

new_dark = """  .dark {
    --background: #222825;
    --foreground: #fbfcf1;
    --card: #2e2d2f;
    --card-foreground: #fbfcf1;
    --popover: #2e2d2f;
    --popover-foreground: #fbfcf1;
    --primary: #a7c1d5;
    --primary-foreground: #222825;
    --secondary: #484849;
    --secondary-foreground: #fbfcf1;
    --muted: #404040;
    --muted-foreground: #c8d1bc;
    --accent: #c8d1bc;
    --accent-foreground: #222825;
    --destructive: #5f5451;
    --destructive-foreground: #fbfcf1;
    --border: #484849;
    --input: #404040;
    --ring: #a7c1d5;
  }"""

css = re.sub(r':root\s*\{[^}]+\}', new_root, css, flags=re.MULTILINE)
css = re.sub(r'\.dark\s*\{[^}]+\}', new_dark, css, flags=re.MULTILINE)

# Also update the gradient utilities
css = re.sub(r'from-teal-600 to-coral-500', 'from-[#c8d1bc] to-[#a7c1d5]', css)
css = re.sub(r'dark:from-coral-500 dark:to-teal-500', 'dark:from-[#a7c1d5] dark:to-[#c8d1bc]', css)
css = re.sub(r'from-indigo-900 via-purple-900 to-teal-600', 'from-[#fbfcf1] via-[#c8d1bc] to-[#a7c1d5]', css)

with open('src/index.css', 'w') as f:
    f.write(css)

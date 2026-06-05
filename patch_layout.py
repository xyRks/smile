import re

# Update AppLayout
with open('src/components/layout/AppLayout.tsx', 'r') as f:
    content = f.read()

# Soften the decorative blurs
content = content.replace('bg-primary/5', 'bg-primary/20')
content = content.replace('bg-accent/5', 'bg-accent/20')
content = content.replace('blur-[120px]', 'blur-[100px]')

with open('src/components/layout/AppLayout.tsx', 'w') as f:
    f.write(content)

# Update Sidebar
with open('src/components/layout/Sidebar.tsx', 'r') as f:
    content = f.read()

# Make sidebar flat and simple
content = content.replace('glass bg-background/50', 'bg-card border-r border-border')
content = content.replace('glass-card border-t border-border', 'bg-card border-t border-border')

with open('src/components/layout/Sidebar.tsx', 'w') as f:
    f.write(content)

# Update Dashboard
with open('src/pages/dashboard/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove glass-card everywhere in Dashboard
content = content.replace('glass-card', 'bg-card border border-border/50 shadow-sm')
content = content.replace('hover:shadow-md', 'hover:shadow-sm')
content = content.replace('backdrop-blur-sm', '')

with open('src/pages/dashboard/Dashboard.tsx', 'w') as f:
    f.write(content)

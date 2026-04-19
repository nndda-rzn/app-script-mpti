import os

def extract_section(lines, start_marker, end_marker=None):
    start_idx = -1
    end_idx = len(lines)
    for i, line in enumerate(lines):
        if start_marker in line and start_idx == -1:
            start_idx = i
        elif end_marker and end_marker in line and start_idx != -1:
            end_idx = i
            break
    if start_idx == -1: return []
    return lines[start_idx:end_idx]

def extract_funcs(lines, funcs):
    # Extracts specifically named functions and their bodies
    extracted = []
    # simple extraction matching "function name(" up to matching closing brace
    # For a robust approach, we just find start and find the outer brace end.
    pass

with open('d:/Kuliah/MPTI/app script/client/core/app.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Clean tags
content = content.replace('<script>', '').replace('</script>', '')
lines = content.split('\n')

# We can just manually slice by line ranges based on our previous view_file since it hasn't changed.
# Lines match exactly with view_file tool output. (0-indexed in python, so line 1 is lines[0])

globals_js = lines[1:66] # lines 2-66
utils_js = lines[66:76] + lines[114:155] + lines[345:351] + lines[813:825] + lines[1946:1968]
customers_js = lines[76:106] + lines[351:453]
transactions_js = lines[106:114] + lines[453:1324] + lines[1884:1946]
analytics_js = lines[1324:1527]
packages_js = lines[1527:1751]
promos_js = lines[1751:1884]

# Section 5 has init, settings, auth
# 156-173 (init window.onload)
# 174-236 (settings)
# 237-276 (setupDashboard)
# 277-304 (auth)
# 305-345 (showSection, setActiveFilterBtn)

settings_js = lines[174:236]
auth_js = lines[276:304]
init_js = lines[156:174] + lines[237:276] + lines[304:345]

def write_out(path, content_lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write('<script>\n')
        f.write('\n'.join(content_lines))
        f.write('\n</script>')

write_out('d:/Kuliah/MPTI/app script/client/core/globals.js.html', globals_js)
write_out('d:/Kuliah/MPTI/app script/client/core/utils.js.html', utils_js)
write_out('d:/Kuliah/MPTI/app script/client/features/customers/customers.js.html', customers_js)
write_out('d:/Kuliah/MPTI/app script/client/features/transactions/transactions.js.html', transactions_js)
write_out('d:/Kuliah/MPTI/app script/client/features/analytics/analytics.js.html', analytics_js)
write_out('d:/Kuliah/MPTI/app script/client/features/packages/packages.js.html', packages_js)
write_out('d:/Kuliah/MPTI/app script/client/features/promos/promos.js.html', promos_js)
write_out('d:/Kuliah/MPTI/app script/client/features/settings/settings.js.html', settings_js)
write_out('d:/Kuliah/MPTI/app script/client/features/auth/auth.js.html', auth_js)
write_out('d:/Kuliah/MPTI/app script/client/core/init.js.html', init_js)

print("Split completed successfully!")

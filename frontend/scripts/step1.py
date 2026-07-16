from pathlib import Path

file = Path("pages/index.js")
text = file.read_text()

old = """{/* HERO */}"""

new = """{/* HERO */}
/* PREMIUM HERO SECTION - PART 1 */
"""

text = text.replace(old, new)

file.write_text(text)

print("✅ Step 1 completed successfully.")

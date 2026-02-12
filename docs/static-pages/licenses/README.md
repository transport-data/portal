<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Licenses Page](#licenses-page)
  - [Editing License Information](#editing-license-information)
  - [Adding New Licenses](#adding-new-licenses)
  - [Editing License Categories](#editing-license-categories)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Licenses Page

If you want to change the content in the Licenses Page all you need to do is add or edit the files in the `frontend/md/licenses` folder.

## File Structure

We currently have the following structure:

```
frontend/md/licenses/
├── intro.md           # Introduction text at the top
├── cc-by.md          # Creative Commons Attribution
├── cc-by-sa.md       # Creative Commons Attribution-ShareAlike
├── cc0.md            # Creative Commons Zero (Public Domain)
├── odbl.md           # Open Database License
├── odc-by.md         # ODC Attribution License
├── odc-pddl.md       # ODC Public Domain Dedication
└── other.md          # Other open licenses
```

## File Format

Inside each file there is frontmatter and markdown content, for example:

```markdown
---
title: "Creative Commons Attribution (CC BY 4.0)"
category: "cc"
order: 1
---

**Recommended for most open data**

This license allows users to:
- **Share** — copy and redistribute the material
- **Adapt** — remix, transform, and build upon the material

**Requirements:**
- **Attribution** — You must give appropriate credit

**Best for:** General purpose open data sharing

**License URL:** [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
```

### Frontmatter Fields:

- **`title`**: The name of the license (appears in the accordion header)
- **`category`**: Which section the license appears in (see categories below)
- **`order`**: Controls the order within a category (lower numbers appear first)

## License Categories

We currently have the following categories:

- **`cc`** = Creative Commons Licenses
- **`odc`** = Open Data Commons Licenses
- **`other`** = Other Open Licenses

There's also a special category called **`intro`** that defines the introductory text at the top of the page.

## Editing License Information

To edit existing license information:

1. Open the relevant `.md` file in `frontend/md/licenses/`
2. Edit the markdown content (keep the frontmatter unchanged unless renaming)
3. Run `npm run mddb` to rebuild the index
4. Restart the dev server with `npm run dev`

## Adding New Licenses

To add a new license:

1. Create a new `.md` file in `frontend/md/licenses/`
2. Add the frontmatter with `title`, `category`, and `order`
3. Write the license description in markdown
4. Run `npm run mddb` to index the new file
5. Restart the dev server

Example new file:

```markdown
---
title: "MIT License"
category: "other"
order: 1
---

A permissive license that allows users to do almost anything with your data.

**License URL:** [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)
```

## Editing License Categories

To change the categories displayed on the Licenses page, edit the code directly:

**File:** [`frontend/src/pages/licenses.tsx`](https://github.com/transport-data/portal/blob/main/frontend/src/pages/licenses.tsx#L23)

```typescript
const categories = {
  cc: { title: "Creative Commons Licenses" },
  odc: { title: "Open Data Commons Licenses" },
  other: { title: "Other Open Licenses" },
};
```

### To add a new category:

1. Add a new key-value pair to the `categories` object:

```typescript
const categories = {
  cc: { title: "Creative Commons Licenses" },
  odc: { title: "Open Data Commons Licenses" },
  other: { title: "Other Open Licenses" },
  government: { title: "Government Licenses" }, // New category
};
```

2. Create markdown files with the matching category in their frontmatter:

```markdown
---
title: "UK Open Government License"
category: "government"
order: 1
---

License content here...
```

3. Run `npm run mddb` to rebuild the index
4. Restart the dev server

## Ordering Licenses

Licenses within each category are sorted by the `order` field in the frontmatter:
- Lower numbers appear first
- Files without an `order` field appear last (order: 999)

Example ordering:

```
cc-by.md       (order: 1) ← appears first
cc-by-sa.md    (order: 2) ← appears second  
cc0.md         (order: 3) ← appears third
```

## Important Notes

1. **Run `npm run mddb` after any changes** to markdown files
2. **Restart the dev server** to see changes
3. The **intro.md** file is special - it provides the introduction text and doesn't appear in any category accordion
4. Categories appear in the sidebar navigation automatically based on the `categories` object
5. Empty categories (with no matching markdown files) will still show in the sidebar but have no content

## Markdown Formatting

The license content supports standard markdown:

- **Bold text** with `**text**`
- *Italic text* with `*text*`
- Links with `[text](url)`
- Bullet lists with `-`
- Numbered lists with `1.`
- Headings with `##`, `###`, etc.

Example:

```markdown
**You are free to:**
- Share the data
- Modify the data

**Under these conditions:**
1. Provide attribution
2. Share derivatives under the same license

**Learn more:** [License details](https://example.com)
```
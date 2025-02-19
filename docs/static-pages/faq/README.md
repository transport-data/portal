<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [FAQ Page](#faq-page)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# FAQ Page

If you want to change the content in the FAQ Page

![FAQ](./page.png)

All you need to do is add or edit the files in the `frontend/md/faq` folder

We currently have the following structure

```
.
├── intro.md
├── question1.md
├── question2.md
├── question3.md
├── question4.md
├── question5.md
├── question6.md
└── question7.md

```

Inside each of these files there is the following content, for example


```
---
title: How does TDC define transport data
category: getting_started
---

Generally, it is accepted to use FlowBite in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to FlowBite itself.
With that being said, feel free to use this design kit for your open-source projects.
Find out more information by reading the license.
```

As you can see we have a title, that is going to me mapped to the tile of the question, markdown content in the end and a `category` item, 
this category item is used to define where in the page that question is going to live, we currently have the following categories

- getting_started = Getting Started
- organizations = Organizations
- submitting_data = Submitting Data
- sharing_data = Sharing and Using Data
- geodata = Geodata
- search = Search
- metadata = Metadata and Data Quality
- devs = Resources for Developers
- sensitive_data = Sensitive Data
- licenses = Data Licenses

We also have a special category called `intro` that is used to define the content in the initial text of the FAQ Page

So with the following information we can see that the example gave above is going to end up like this in the page

![FAQ Example](./example-faq.png)

In the 'Getting started' section

One final thing to none is that the questions are arranged in alphabetical order of the filename, so inside the category `question1.md` is going to come before `question2.md` etc

## Editing FAQ sections

To change the sections present in the FAQ page you have to change it directly in the page code here: https://github.com/transport-data/portal/blob/main/frontend/src/pages/faq.tsx#L33

If you change only this text it'll apply to the frontend without any problems.

if you want to add a new category you have to add it to the same object by adding a new key with a new title:

![image](https://github.com/user-attachments/assets/bd49ea4d-ca7d-4d72-9261-d0065be4bd6d)


Then you have to create a new question .md file to be presented on the category accordion it must have the same key created for the object above, like this:

![image](https://github.com/user-attachments/assets/b8a157c1-1578-4e3b-8a43-637ec484d11f)

 


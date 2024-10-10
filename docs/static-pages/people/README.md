# People behind TDC

To manage people behind TDC content:

![Manage People](people.png)

Simply add or edit files in the `frontend/md/people` folder following theis structure:

```
.
├── name-of-person-1.md
├── name-of-person-2.md
└── name-of-person-3.md
...
```

Inside each of these files there is the following content, for example:

```
---
title: Verena Knöll
image: /images/people/verena-knoll.png
info: German Development Cooperation (GIZ)
---

As an urban geographer and a passionate cyclist, I have always been interested in transport and mobility. I am driven by a vision of sustainable mobility that enhances both the quality of human life and of the natural environment.
Having lived in different cities around the world, I highly value international exchange and cooperation. I am convinced that global challenges require cooperative solutions. I am thus glad to support the TraCS project team in aligning transport and climate action plans in emerging economies and developing countries.

```

As you can see we have:

- **title**: which is going to be the name of the person.
- **image**: of the person, which can either be a full fledged URL or a relative link, altough please note that if you do the relative link you need to store the image in the `/frontend/public` folder
- **info**: The organization that the person belongs to

And in the end the markdown content, describing the person bio, that can contain any number of item such as headings, links, lists etc

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Partners and Donors Page](#partners-and-donors-page)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Partners and Donors Page

![Partners and Donors](partners-donors.png)

To create/edit a partner or donor on the list

- open file `/frontend/data/partners.json`
- create/edit an item with following strucure:

  ```
    {
        "image": "/path/to/partner image",
        "name": "Name of the Partner",
        "url": "Partner website url"
    }
  ```

  **image**: can be a external url or, relative link which you'll need to store the image in the `/frontend/public` folder

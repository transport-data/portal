<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Google Analytics](#google-analytics)
  - [Events](#events)
  - [Setup](#setup)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Google Analytics

This application supports analytics with Google Analytics.

## Events

Besides the default events tracked by Google Analytics (e.g. `page_view`, `click`, etc), this application also implements two custom events:

- `dataset_view` - Trigerred whenever a dataset page is accessed. 
- `dataset_download` - Trigerred whenever a dataset's resource is downloaded.

The label for these custom events follows the `{dataset-id}|{dataset-title}|{dataset-name}` pattern, example: `7a0374f2-099c-49e7-b30b-9a49293af15f|My dataset|my-dataset`.

## Setup

In order to make Google Analytics work, first of all, set the followin enviroment variable of the frontend application:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
```

Then, on the Google Analytics dashboard, head to Admin => Data display => Key events and create the following key events:

![Key events](./key-events.png)

Next, look for Custom definition on the same LHS menu and set the following custom dimensions:

![Custom dimensions](./custom-dimensions.png)

After that, custom events will be tracked.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Page Loading Component](#page-loading-component)
    - [Key Features:](#key-features)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Page Loading Component

This component provides users with a visual indicator when the application is loading a page. It displays a loading bar at the top of the screen and a TDC logo with three animated loading dots in the bottom-right corner. The purpose is to enhance user experience by offering a clear and aesthetic way of communicating page loading status.

### Key Features:

1. **Loading Bar**: A progress bar that moves from left to right, located at the top of the page, indicating page load progress.
2. **TDC Icon with Loading Dots**: In the bottom-right corner, the TDC logo appears with three animated dots to represent ongoing activity. The dots pulse sequentially to visually suggest loading.
3. **Dynamic Loading Detection**: The component listens to page routing events (`routeChangeStart`, `routeChangeComplete`, and `routeChangeError`) and updates the loading state accordingly, using a timer to show a loader only if the loading process takes longer than a set threshold.
4. **Smooth Animations**: The entire loading component features a fade-in animation to make the transition smooth, improving the visual appeal.

[Example video](https://www.loom.com/embed/5f218014ede647c986185e482d1d1092?sid=ff05ba57-cec2-4bb1-9751-e7f76fa60f87)

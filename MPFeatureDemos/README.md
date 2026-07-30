# MPFeatureDemos

## Overview

The **MPFeatureDemos** directory contains a collection of demonstration projects showcasing various features and functionalities of Mini Programs (MP). Each demo is designed to illustrate specific capabilities, providing developers with practical examples and insights into how to implement these features in their own projects.

## Structure

The directory is organized as follows:

- **subPackages/**: In Mini Programs, the size of a single package cannot exceed 2MB. If the package exceeds this size limit, you will be unable to preview or upload the program. It is recommended that developers host local static resources on a server or utilize subPackages to optimize package size. This directory demonstrates the usage of subPackages.
- **webviewH5/**: This directory contains examples of how to embed H5 content within a web-view component. The H5 pages can be accessed **offline** or **online**. Additionally, H5 can utilize the JSSDK to call Mini Program APIs, allowing for bidirectional communication between H5 and the Mini Program.
- **loginAndProfile/**: Mini Programs can conveniently obtain user identity identifiers provided by the host app through the standardized login capabilities offered by the official framework, allowing for the rapid establishment of a user system within the Mini Program. Additionally, with user consent, it is possible to retrieve app user information such as profile pictures, nicknames, and phone numbers through Mini Program APIs or components. This directory will demonstrate how to utilize the relevant APIs and components for these functionalities.
- **customFont/**: This directory is dedicated to the implementation of custom fonts within the Mini Program. It contains the necessary font files (e.g., .ttf, .woff) and demonstrates how to properly load and apply these fonts in the application.
- **i18n/**: This directory demonstrates how to implement multilingual support in Mini Programs. The examples include how to dynamically load text content based on the user's language preferences. This directory aims to help developers understand best practices for internationalization and provides reusable code samples for implementing multilingual support in their own projects.
- **howToUseNpm/**: This directory demonstrates how to use npm in miniprogram. just run demo directly and follow the page guidance. in addition you can get a demo show how to encrypte and decrypte data whatever you want with AES-GCM
- **customTabBar/**: This directory demonstrates show how to use customTabBar in miniprogram

## Getting Started

To get started with the demos:

1. Clone or download the repository.
2. Open the desired feature demo folder directly in the MP Developer Tool to preview and run the demo locally.

## Contribution

Contributions are welcome! If you have additional features or demos to share, please feel free to submit a pull request or open an issue.
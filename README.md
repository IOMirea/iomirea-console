# iomirea-client
[![Build Status](https://travis-ci.org/y21/iomirea-console.svg?branch=master)](https://travis-ci.org/y21/iomirea-console)

This repository contains the source code for a console client that interacts with [iomirea](https://github.com/iomirea).

### Features
- View Account Information (E-Mail, Username, User ID)
- Get a list of all channels the user is in
- View messages
- Send messages

### Requirements
This has been tested on Windows (10) and Linux (Raspbian) with Node.js v10.15.3 installed.
Although it should work on old versions it is recommended to use LTS.

### Installation and Setup

1. Download the repository
```ssh
git clone https://github.com/y21/iomirea-client
```

> The following step(s) will only work if you have Node.js installed
2. Navigate into the cloned repository and install all required dependencies
```ssh
cd iomirea-client
npm install
```

3. Install typescript globally if it is not installed on your machine already
```sh
npm install typescript -g
```

4. Transpile the source code into executable JavaScript code
> If this tells you that `tsc` is not a recognized internal or external command, make sure `tsc` is set in the PATH environment variable (should not happen on Linux) <br/>
> Alternatively, run the transpile script yourself with the path to `tsc`
```ssh
npm run transpile
```

3. Create a file named `.config` if it does not exist already and add the following contents (replace `token` with your actual access token):
```sh
ACCESS_TOKEN=token
```

4. Start the application
```sh
npm run iomirea
```

# iomirea-client
This repository contains the source code for a console client that interacts with [iomirea](https://github.com/Fogapod/IOMirea-server/).

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

3. Create a file named `.config` if it does not exist already and add the following contents (replace `token` with your actual access token):
```sh
ACCESS_TOKEN=token
```

4. Start the application
```sh
npm run iomirea
```
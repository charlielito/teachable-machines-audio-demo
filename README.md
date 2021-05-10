# Using Audio to toggle a WiFi connected device with [Teachable Machines](https://teachablemachine.withgoogle.com/) by Google

An audio model for recognizing a whistle pattern was trained to toggle a [Sonoff/Ewelink socket](https://www.amazon.com/-/es/Slampher-Bombilla-inteligente-compatible-Assistant/dp/B07TRSYJGB) device connected to a room light. Basically, you whistle and the light turns on/off.

This is also a starting point for those wo want to deploy an audio model in a headless device like a RaspberryPi, since at May 2021 there is no API in python for using an audio trained model. The current options are on the browser or on Android.

## API trick/hack
To be able to use an audio model, we use node.js with puppeteer with a headless chrome to be able to run the model. Chrome runs the model and outputs the predictions as logs where are parsed inside the node.js script. After that the user can do whatever with the predictions. In this case toggling a light.

## Requirements
* Node
* Ewelink connected device and account
* Teachable machines audio trained model

## Installation

### Node installation

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install node
source ~/.bashrc
```

Install now the project:
```
npm install .
```

## Running the demo
First you need to identify the `ID` of the device you want to control. For that just get the list of all devices for you ewelink account with:

```
node get_devices.js -e <my@email.com> -p <my-password>
```
Look for the property `deviceid`.

Now you are ready to run the demo. If you want to change from model, change https://github.com/charlielito/teachable-machines-audio-demo/blob/master/index.html#L18 with the URL of your trained model.

Finally run:

```
node index.js -e <my@email.com> -p <my-password> --deviceid <my-device-id>
```

### Local or LAN mode
By default the demo calls the API through Internet, which causes a little bit of lag when triggering the state of the device. If you want to control a device that is in your LAN, you can follow this extra step that will speed up the control of the devices.

First cache the devices info locally with:
```
node save_cache.js -e <my@email.com> -p <my-password>
```

That command would generate 2 files: `arp-table.json` and `devices-cache.json`.
Finally just run everything with:

```
node index.js --lan --deviceid <my-device-id>
```


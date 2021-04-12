# smrt

**WARNING: Under development and not ready yet.**

This project aims to be an mqtt home dashboard and automation trigger (*TBD*). Its goal is to listen on a specified [MQTT](https://mqtt.org/) broker, automatically adding known devices to the [dashboard](#dashboard) and trigger [automations](#automations) based on the given script files (*TBD*).

## install

    git clone https://github.com/shagu/smrt.git
    cd smrt
    npm install mqtt
    node smrt.js

## dashboard

The dashboard is served on [localhost:8044](http://localhost:8044) and receives a viewport prepared by the `smart.js` backend. The view is sent to the dashboard via socket.io but can also be reviewed on [localhost:8044/json](http://localhost:8044/json) for debugging reasons.

![preview](preview.png)

## devices

Known devices can be added to the devices folder. Have a look at [homematic.js](devices/homematic.js) and [openwrt.js](devices/openwrt.js) to see examples. A valid device configuration must contain the MQTT topic pattern that it should trigger on, aswell as a `getData` function that returns an object containing:

- `uid`: a unique identifier of the device that shall be added to the overview
- `name`: the name of the device used on the dashboard
- `type`: the type/section it should appear on the dashboard
- `**`: add whatever further values you need, those can then be accessed by the dashboard

Here's an example for homematic temperatures:
```js
exports.vendor = {
  name: "homematic",
  entries: {
    /* actual temperatures */
    "^hm/status/(.+):[0-9]/ACTUAL_TEMPERATURE$": {
      getData: (topic, msg) => {
        var data = {
          1: {
            uid: topic.match("^hm/status/(.+):[0-9]/ACTUAL_TEMPERATURE$")[1],
            type: "temperature",
            name: topic.match("^hm/status/(.+):[0-9]/ACTUAL_TEMPERATURE$")[1],
            current: JSON.parse(msg).val.toFixed(1)
          }
        }

        return data
      },
    }
  }
}
```

## automations (TBD)

tbd
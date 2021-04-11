exports.vendor = {
  name: "openwrt",
  entries: {
    /* online devices */
    "^openwrt/device-tracker$": {
      getData: (topic, msg) => {
        var data = {}
        var msg = JSON.parse(msg)
        for (id in msg.online) {
          for (ip in msg.online[id]) {
            data[Object.keys(data).length+1] = {
              uid: ip,
              type: "device-tracker",
              name: msg.online[id][ip].name ? msg.online[id][ip].name : "*",
              mac: msg.online[id][ip].mac,
              ip: ip,
              ipv: ip.match(":") ? "ipv6" : "ipv4"
            }
          }
        }

        return data
      },
    }
  }
}
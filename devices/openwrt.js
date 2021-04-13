exports.device = {
  name: 'openwrt',
  topics: {
    /* online devices */
    '^openwrt/device-tracker$': {
      getData: (topic, msg) => {
        const data = {}
        let category = "device-tracker"

        msg = JSON.parse(msg)

        for (const id in msg.online) {
          for (const ip in msg.online[id]) {
            let mac = msg.online[id][ip].mac

            data[Object.keys(data).length + 1] = {
              /* device data */
              uid: hash(category + ip + mac),
              category: ip.match(':') ? category + '-ipv6' : category + '-ipv4',
              device: category + "-" + ip,

              /* dashboard */
              name: "$ip",
              value: "$hostname",

              /* custom data fields */
              hostname: msg.online[id][ip].name ? msg.online[id][ip].name : '*',
              mac: mac,
              ip: ip,
            }
          }
        }

        return data
      }
    }
  }
}

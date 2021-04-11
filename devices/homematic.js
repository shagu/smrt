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

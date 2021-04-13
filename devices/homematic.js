exports.device = {
  name: 'homematic',
  topics: {
    /* actual temperatures */
    '^hm/status/(.+):[0-9]/ACTUAL_TEMPERATURE$': {
      getData: (topic, msg) => {
        const name = topic.match('^hm/status/(.+):[0-9]/ACTUAL_TEMPERATURE$')[1]
        const value = JSON.parse(msg).val.toFixed(1)
        const category = 'temperature'

        const data = {
          1: {
            /* device data */
            uid: hash(category + name),
            category: category,
            device: name,

            /* dashboard */
            name: '$device',
            value: '$current°C ($target°C)',

            /* custom data fields */
            current: value
          }
        }

        return data
      }
    }
  }
}

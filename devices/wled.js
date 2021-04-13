exports.device = {
  name: 'wled',
  topics: {
    /* wled status */
    '^wled/(.+)/status$': {
      getData: (topic, msg) => {
        const name = topic.match('^wled/(.+)/status$')[1]
        const category = 'light'

        const data = {
          1: {
            /* device data */
            uid: hash(category + name),
            category: category,
            device: name,

            /* dashboard */
            name: '$device',
            value: '$state ($brightness)',

            /* custom data fields */
            state: msg === 'online' ? 'On' : 'Off'
          }
        }
        return data
      }
    },

    /* wled brightness */
    '^wled/(.+)/g$': {
      getData: (topic, msg) => {
        const name = topic.match('^wled/(.+)/g$')[1]
        const category = 'light'

        const data = {
          1: {
            /* device data */
            uid: hash(category + name),
            category: category,
            device: name,

            /* dashboard */
            name: '$device',
            value: '$state ($brightness)',

            /* custom data fields */
            brightness: msg + '%'
          }
        }
        return data
      }
    }
  }
}

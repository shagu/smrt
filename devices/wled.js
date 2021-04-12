exports.vendor = {
  name: 'wled',
  entries: {
    /* wled status */
    '^wled/(.+)/status$': {
      getData: (topic, msg) => {
        const data = {
          1: {
            uid: topic.match('^wled/(.+)/status$')[1],
            type: 'light',
            name: topic.match('^wled/(.+)/status$')[1],
            value: msg === 'online' ? 'ON' : 'OFF'
          }
        }
        return data
      }
    },

    /* wled brightness */
    '^wled/(.+)/g$': {
      getData: (topic, msg) => {
        const data = {
          1: {
            uid: topic.match('^wled/(.+)/g$')[1],
            type: 'light',
            name: topic.match('^wled/(.+)/g$')[1],
            brightness: msg + '%'
          }
        }
        return data
      }
    }
  }
}

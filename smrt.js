/* load devices */
var devices = {}
var glob = require('glob')
var path = require('path')

console.log("Loading Devices")
glob.sync('./devices/*.js' ).forEach((file) => {
  var inc = require(path.resolve(file))
  console.log(" - " + inc.vendor.name)
  devices[inc.vendor.name] = inc.vendor.entries
})

/* initialize view */
var view = {
  data: {},
  addEntry: (device, topic, msg) => {
    // read device data
    var data = device.getData(topic, msg)

    for (id in data) {
      // add or merge new data with view table
      var type = data[id].type
      var uid = data[id].uid

      view.data[type] = view.data[type] ? view.data[type] : {}
      view.data[type][uid] = view.data[type][uid] ? view.data[type][uid] : {}
      Object.assign(view.data[type][uid], data[id])
      view.data[type][uid].seen = Date.now()
    }
  }
}

/* provide JSON API of current view */
const http = require('http')
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(view.data))
}).listen(8080)

/* connect to MQTT broker */
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://mqtt.midgard')
client.on('message', (topic, msg) => {
  /* search for known device and update view */
  for (var vendor in devices) {
    for (var pattern in devices[vendor]) {
      if (topic.match(pattern)) {
        var device = devices[vendor][pattern]
        view.addEntry(device, topic, msg)
      }
    }
  }
})

client.on('connect', () => {
  client.subscribe('#')
})
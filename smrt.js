/* load all modules */
const glob = require('glob')
const path = require('path')
const mqtt = require('mqtt')

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

/* load devices */
const devices = {}
console.log('Loading Devices')
glob.sync('./devices/*.js').forEach((file) => {
  const inc = require(path.resolve(file))
  console.log(' - ' + inc.vendor.name)
  devices[inc.vendor.name] = inc.vendor.entries
})

/* initialize view */
const view = {
  data: {},
  addEntry: (device, topic, msg) => {
    // read device data
    const data = device.getData(topic, msg)

    Object.keys(data).forEach(id => {
      // add or merge new data with view table
      const type = data[id].type
      const uid = data[id].uid

      view.data[type] = view.data[type] ? view.data[type] : {}
      view.data[type][uid] = view.data[type][uid] ? view.data[type][uid] : {}
      Object.assign(view.data[type][uid], data[id])
      view.data[type][uid].seen = Date.now()
    })
  }
}

/* server dashboard, logo and json on localhost */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html')
})

app.get('/logo.png', (req, res) => {
  res.sendFile(__dirname + '/logo.png')
})

app.get('/json', (req, res) => {
  res.json(view.data)
})

server.listen(8044, () => {
  console.log('Starting Webserver')
})

/* send view to new clients */
io.on('connection', (socket) => {
  io.emit('view', view.data)
})

/* connect to MQTT broker */
const client = mqtt.connect('mqtt://mqtt.midgard')
client.on('message', (topic, msg) => {
  let update = false
  /* search for known device and update view */
  for (const vendor in devices) {
    for (const pattern in devices[vendor]) {
      if (topic.match(pattern)) {
        const device = devices[vendor][pattern]
        view.addEntry(device, topic, msg.toString())
        update = true
      }
    }
  }

  /* send view update to webfrontend */
  if (update === true) {
    io.emit('view', view.data)
  }
})

client.on('connect', () => {
  client.subscribe('#')
})

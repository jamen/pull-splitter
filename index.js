
const { drain } = require('pull-stream')
const pushable = require('pull-pushable')

module.exports = splitter

function splitter (config, onEnd) {
  var ended = false

  // Create source streams
  var channels = {}
  var rest = pushable()
  for (var name in config) {
    channels[name] = pushable()
  }

  // Sink takes data in, filters, and pushes to a source
  const sink = drain(data => {
    for (var name in config) {
      if (config[name](data)) {
        channels[name].push(data)
        return
      }
    }
    rest.push(data)
  }, end)

  
  function end (err) {
    for (var name in channels) {
      channels[name].end(err)
    }
    rest.end(err)
    onEnd(err)
  }

  // Return streams
  return [sink, channels, rest]
}


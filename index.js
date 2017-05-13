
var { pull, drain } = require('pull-stream')
var pair = require('pull-pair/duplex')
var pushable = require('pull-pushable')

module.exports = splitter

function splitter (config) {
  var channels = {}
  var reads = {}
  var waiting = {}

  // Create channel streams
  for (var channelName in config) {
    var source = pushable()
    
    var sink = function (read) {
      reads[channelName] = read
      if (waiting[channelName]) {
        waiting[channelName](read)
        delete waiting[channelName]
      }
    }

    // Create duplex
    channels[channelName] = { source, sink }
  }

  function transform (read) {
    return function next (end, cb) {
      read(end, function (end, data) {
        if (end) return endAll(end)
        
        // Run the config's filters to find the channel
        for (var channelName in config) {
          if (config[channelName](data)) {

            // Push data into source of channel
            channels[channelName].source.push(data)
           
            // Read data out
            function reader (end, result) {
              if (end) return endAll(end)
              cb(null, result)
              next(null, cb)
            }
            
            if (reads[channelName]) {
              reads[channelName](reader)
            } else {
              waiting[channelName] = reader
            }

            return
          }
        }

        // TODO: Handle rest
      })
    }
  }

  var ended
  function endAll (err, cb) {
    if (ended) return
    for (var channelName in channels) {
      channels[channelName].source.end(err)
    }
    cb(err)
    ended = true
  }

  // Return splitter stream
  return [transform, channels]
}


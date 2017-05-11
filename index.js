
const { pull, filter, drain } = require('pull-stream')
const pushable = require('pull-pushable')

module.exports = splitter

function splitter (filters, onEnd) {
  var ended = false

  // Create source streams
  var sources = {}
  for (var name in filters)
    sources[name] = pushable()
 
  // Sink takes data in, filters, and pushes to a source
  const sink = drain(data => {
    for (var name in filters) {
      if (filters[name] === true || filters[name](data)) {
        sources[name].push(data)
        break
      }
    }
  }, end)

  // End all associated streams
  function end (err) {
    if (ended) return
    for (var name in sources)
      sources[name].end(err)
    if (onEnd) onEnd(err)
    ended = true
  }

  // Create anm split stream
  var split = { sink, end }
  for (var name in sources)
    split[name] = sources[name]

  return split
}



const test = require('tape')
const { pull, values, collect } = require('pull-stream')
const splitter = require('../')

test('splits streams', t => {
  t.plan(4)

  var [sink, channels, rest] = splitter({
    high: n => n > 75,
    mid:  n => n > 25,
    low:  n => n > 0
  })

  pull(
    channels.high,
    collect((err, data) => {
      t.same(data, [99, 100], 'got high split')
    })
  )

  pull(
    channels.mid,
    collect((err, data) => {
      t.same(data, [33, 44], 'got mid split')
    })
  )

  pull(
    channels.low,
    collect((err, data) => {
      t.same(data, [9, 10], 'got low split')
    })
  )

  pull(
    rest,
    collect((err, data) => {
      t.same(data, [-10, -3], 'got rest stream')
    })
  )

  // Split the stream
  pull(
    values([ 9, 33, 10, -10, 99, 100, 44, -3 ]),
    sink
  )
})

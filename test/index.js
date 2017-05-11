
const test = require('tape')
const { pull, values, collect } = require('pull-stream')
const splitter = require('../')

test('splits streams', t => {
  t.plan(3)

  var split = splitter({
    high: n => n > 75,
    mid:  n => n > 25,
    low:  n => n > 0
  })

  pull(
    split.high,
    collect((err, data) => {
      t.same(data, [99, 100], 'got high split')
    })
  )

  pull(
    split.mid,
    collect((err, data) => {
      t.same(data, [33, 44], 'got mid split')
    })
  )

  pull(
    split.low,
    collect((err, data) => {
      t.same(data, [9, 10], 'got low split')
    })
  )

  // Split the stream
  pull(
    values([ 9, 33, 10, 99, 100, 44 ]),
    split.sink
  )
})

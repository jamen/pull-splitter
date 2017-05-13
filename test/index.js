
const test = require('tape')
const { pull, values, through, collect } = require('pull-stream')
const splitter = require('../')

test('splits streams', t => {
  t.plan(3)

  var [ transform, split ] = splitter({
    high: n => n > 75,
    mid:  n => n > 25,
    low:  n => n > 0
  })

  pull(
    split.high,
    through(data => {
      t.true(data === 99 || data === 100, 'got high split')
    }),
    split.high
  )

  pull(
    split.mid,
    through(data => {
      t.true(data === 33 || data === 44, 'got mid split')
    }),
    split.mid
  )

  pull(
    split.low,
    collect(data => {
      t.true(data === 9 || data === 10, 'got low split')
    }),
    split.low
  )

  // Split the stream
  pull(
    values([ 9, 33, 10, 99, 100, 44 ]),
    transform,
    collect(console.log)
  )
})

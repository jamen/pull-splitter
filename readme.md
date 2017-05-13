
# pull-splitter

> Split a stream into other streams using filters

```js
const { pull, drain } = require('pull-stream')
const { read, write } = require('pull-files')
const splitter = require('pull-splitter')
const { extname } = require('path')

const [split, channels, rest] = splitter({
  js: file => extname(file.path) === '.js',
  css: file => extname(file.path) === '.css',
  html: file => extname(file.path) === '.html',
  // Pass other files through
  rest: true
})

// Pull files into splitter:
pull(
  read('src/**/*'),
  split
)

// Pull results out
pull(
  channels.css,
  write('out/css')
)

pull(
  channels.js,
  write('out/js')
)

// Pull results with no match
pull(
  rest,
  write('out/assets')
)
```

The splitter returns `[split, channels, rest]`, where `split` is a sink that pushes onto one of the `channels`, or `rest` if none match

See [`pull-merge`](https://github.com/pull-stream/pull-merge) and [`pull-sorted-merge`](https://github.com/pull-stream/pull-sorted-merge) for joining the streams back together

## Install

```sh
npm install --save pull-splitter
```

```sh
yarn add pull-splitter
```

## Usage

### `splitter(config)`

Returns a sink and sources (`channels` and `rest`), based on the config provided

```js
var [split, channels, rest] = splitter({
  high: item => item > 10,
  low: item => item > 5,
  // ...
})
```

Each field in config turns into a source stream on `channels` based on the filter

```js
pull(
  channels.high,
  drain(console.log)
)

pull(
  channels.low,
  drain(console.log)
)
```

Then to stream data in, you use `split.sink`:

```js
pull(
  values([ 3, 6, 9, 12, 15 ]),
  split
)
```

Pull unmatching items through `rest`:

```
pull(rest, drain(console.log))
```

## Also see 

 - [`pull-merge`](https://github.com/pull-stream/pull-merge) to merge the streams
 - [`pull-sorted-merge`](https://github.com/pull-stream/pull-sorted-merge) to merge the streams with sorting
 - [`pull-pair`](https://github.com/pull-stream/pull-pair) for a basic way to link streams
 - [`pull-tee`](https://github.com/pull-stream/pull-tee) for a different mechanism of splitting a stream

---

Maintained by [Jamen Marz](https://git.io/jamen) (See on [Twitter](https://twitter.com/jamenmarz) and [GitHub](https://github.com/jamen) for questions & updates)


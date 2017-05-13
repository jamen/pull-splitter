
# pull-splitter

> Split a stream into other streams using filters

It's like a [`pull-pair/duplex`](https://github.com/pull-stream/pull-pair) except

```js
const { pull, drain } = require('pull-stream')
const { read, write } = require('pull-splitter')
const splitter = require('pull-splitter')
const { extname } = require('path')

const project = splitter({
  js: file => extname(file.path) === '.js',
  css: file => extname(file.path) === '.css',
  html: file => extname(file.path) === '.html',
  // Pass other files through
  rest: true
})

// Pull files into splitter:
pull(
  read('src/**/*'),
  project.sink
)

// Pull results out
pull(
  project.css,
  write('out/css')
)

// Pull results with no match
pull(
  project.rest,
  write('out/assets')
)
```

The splitter is an object with `{ sink, rest?, ...streams }`, where files go into `sink`, are filtered into `streams`, and the unmatched items stream out of `rest`.

See [`pull-merge`](https://github.com/pull-stream/pull-merge) and [`pull-sorted-merge`](https://github.com/pull-stream/pull-sorted-merge) for joining the streams back together

## Install

```sh
npm install --save pull-splitter
```

```sh
yarn add pull-splitter
```

## Usage

### `splitter(channels)`

Returns a splitter stream based on the `channels` object provided.

The `channels` is an object of filter functions, such as:

```js
var split = splitter({
  foo: item => item > 10,
  bar: item => item > 5,
  // ...
  rest: true
})
```

You can also provide a boolean for one of the properties to capturing any unmatching items.

Each channel turns into a source stream that streams out item based on the condition:

```js
pull(
  split.foo,
  drain(console.log)
)

pull(
  split.bar,
  drain(console.log)
)
```

Then to stream data in, you use `split.sink`:

```js
pull(
  values([ 3, 6, 9, 12, 15 ]),
  split.sink
)
```

## Also see 

 - [`pull-merge`](https://github.com/pull-stream/pull-merge) to merge the streams
 - [`pull-sorted-merge`](https://github.com/pull-stream/pull-sorted-merge) to merge the streams with sorting
 - [`pull-pair`](https://github.com/pull-stream/pull-pair) for a basic way to link streams
 - [`pull-tee`](https://github.com/pull-stream/pull-tee) for a different mechanism of splitting a stream

---

Maintained by [Jamen Marz](https://git.io/jamen) (See on [Twitter](https://twitter.com/jamenmarz) and [GitHub](https://github.com/jamen) for questions & updates)


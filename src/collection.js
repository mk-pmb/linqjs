const getIterator = symbolOrString('getIterator')

Collection = (function () {
  function Collection (iterableOrGenerator) {
    __assert(isIterable(iterableOrGenerator) || isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!')

    this.iterable = iterableOrGenerator
  }

  Collection.prototype = (function () {
    function next () {
      if (!this.started) {
        this.started = true
        this.iterator = this[getIterator]()
      }

      return this.iterator.next()
    }

    function reset () {
      this.started = false
    }

    return { next, reset }
  }())

  Collection.prototype[Symbol.iterator] = function * () {
    let current

    while (true) {
      current = this.next()

      if (current.done) {
        this.reset()
        break
      }

      yield current.value
    }
  }

  Collection.prototype[getIterator] = function () {
    const iter = this.iterable

    if (isGenerator(iter)) {
      return iter()
    } else {
      return function * () {
        yield* iter
      }()
    }
  }

  return Collection
}())
/**
 * ElementAt - Returns the element at the given index
 *
 * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} index
 * @return {any}
 */
function ElementAt (index) {
  __assertIndexInRange(this, index)

  const result = this.Skip(index).Take(1).ToArray()[0]
  this.reset()

  return result
}

/**
 * Take - Returns count elements of the sequence starting from the beginning as a new Collection
 *
 * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} count = 0 number of elements to be returned
 * @return {Collection}
 */
function Take (count = 0) {
  __assertNumeric(count)

  if (count <= 0) {
    return Collection.Empty
  }

  const iter = this.getIterator()
  return new Collection(function * () {
    let i = 0
    for (let val of iter) {
      yield val

      if (++i === count) {
        break
      }
    }
  })
}

/**
 * Skip - Skips count elements of the sequence and returns the remaining sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} count=0 amount of elements to skip
 * @return {Collection}
 */
function Skip (count = 0) {
  __assertNumeric(count)

  if (count <= 0) {
    return this
  }

  const result = this.SkipWhile((elem, index) => index < count)

  this.reset()

  return result
}

 /**
 * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form elem => boolean
 * @return {Collection}
  *//**
  * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true. The index of the element can be used in the logic of the predicate function.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @param  {Function} predicate The predicate of the form (elem, index) => boolean
  * @return {Collection}
  */
function TakeWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const iter = this.getIterator()

  const result = new Collection(function * () {
    let index = 0
    let endTake = false

    for (let val of iter) {
      if (!endTake && predicate(val, index++)) {
        yield val
        continue
      }

      endTake = true
    }
  })

  this.reset()

  return result
}

/**
* TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. TakeUntil behaves like calling TakeWhile with a negated predicate.
*
* @method
* @memberof Collection
* @instance
* @param  {Function} predicate The predicate of the form elem => boolean
* @return {Collection}
 *//**
 * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
 * TakeUntil behaves like calling TakeWhile with a negated predicate.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form (elem, index) => boolean
 * @return {Collection}
 */
function TakeUntil (predicate = (elem, index) => false) {
  return this.TakeWhile((elem, index) => !predicate(elem, index))
}

 /**
 * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {type} predicate The predicate of the form elem => boolean
 * @return {Collection}
  *//**
  * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence. The index of the element
  * can be used in the logic of the predicate function.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @param  {type} predicate The predicate of the form (elem, index) => boolean
  * @return {Collection}
  */
function SkipWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const iter = this.getIterator()

  return new Collection(function * () {
    let index = 0
    let endSkip = false

    for (let val of iter) {
      if (!endSkip && predicate(val, index++)) {
        continue
      }

      endSkip = true
      yield val
    }
  })
}

/**
* SkipUntil - Skips elements from the beginning of a sequence until the predicate yields true. SkipUntil behaves like calling SkipWhile with a negated predicate.
*
* @method
* @memberof Collection
* @instance
* @param  {Function} predicate The predicate of the form elem => boolean
* @return {Collection}
 *//**
 * SkipUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
 * SkipUntil behaves like calling SkipWhile with a negated predicate.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form (elem, index) => boolean
 * @return {Collection}
 */
function SkipUntil (predicate = (elem, index) => false) {
  return this.SkipWhile((elem, index) => !predicate(elem, index))
}

function resultOrDefault(collection, originalFn, predicateOrConstructor = x => true, constructor = Object) {
  //__assertArray(arr)

  let predicate

  if (isNative(predicateOrConstructor)) {
    predicate = x => true
    constructor = predicateOrConstructor
  } else {
    predicate = predicateOrConstructor
  }

  __assertFunction(predicate)
  __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!')

  const defaultVal = getDefault(constructor)

  if (isEmpty(collection)) {
    return defaultVal
  }

  return originalFn.call(collection, predicate)
}

function First (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  const result = this.SkipWhile(elem => !predicate(elem)).Take(1).ToArray()[0]
  this.reset()

  return result
}

function FirstOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, First, predicateOrConstructor, constructor)
}

function Last (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  return this.Reverse().First(predicate)
}

function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Last, predicateOrConstructor, constructor)
}

function Single (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  let index = 0
  let result

  for (let val of this.getIterator()) {
    if (predicate(val)) {
      result = val
      break
    }

    index++
  }

  if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
    throw new Error('Sequence contains more than one element')
  }

  return result
}

function SingleOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Single, predicateOrConstructor, constructor)
}

/**
 * DefaultIfEmpty - Returns a new sequence containing the provided constructors default if the sequence is empty or the sequence itself if not
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} constructor A native constructor to get the default for, e.g. Number
 * @return {Collection}
 *//**
 * DefaultIfEmpty - Returns the sequence or a new sequence containing the provided default value if it is empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param {any} value The default vlaue
 * @return {Collection}
 */
function DefaultIfEmpty (constructorOrValue) {
  if (!isEmpty(this)) {
    return this
  }

  return [getDefault(constructorOrValue)]
}

__export({ ElementAt, Take, TakeWhile, TakeUntil, Skip, SkipWhile, SkipUntil, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault, DefaultIfEmpty })

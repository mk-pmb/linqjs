'use strict';

const expect = require('chai').expect
let linqjs = require('../dist/linq')

if (process.env.IS_COVERAGE) {
    describe('Test coverage', function () {
        it('should generate instrumentation', function (done) {
              require('child_process').exec('$(npm root)/.bin/jscoverage dist coverage/dist', done);
        });

        it('should load coverage module', function () {
            linqjs = require('../coverage/dist/linq.js');
        });
    });
}

linqjs.install()

describe('linqjs', function () {
  describe('Mathematics', function () {
    const pets = [
      {
        Name: 'Barley',
        Age: 8,
      },
      {
        Name: 'Boots',
        Age: 4,
      },
      {
        Name: 'Whiskers',
        Age: 1,
      }
    ];

    describe('Min', function () {
      it('should return the minimum of the array', function () {
        expect([1,2,3,4,5].Min()).to.be.equal(1)
      })

      it('should be able to transform the values using a mapFn and then return the minimum', function () {
        expect([1,2,3,4,5].Min(x => x + 3)).to.be.equal(4)

        /*
          Spec: https://msdn.microsoft.com/de-de/library/bb534961(v=vs.110).aspx
        */
        expect(pets.Min(pet => pet.Age)).to.be.equal(1)
      })
    })

    describe('Max', function () {
      it('should return the maximum of the array', function () {
        expect([1,2,3,4,5].Max()).to.be.equal(5)
      })

      it('should be able to transform the values using a mapFn and then return the maximum', function () {
        expect([1,2,3,4,5].Max(x => x + 3)).to.be.equal(8)

        /*
          Spec: https://msdn.microsoft.com/de-de/library/bb549404(v=vs.110).aspx
        */
        expect(pets.Max(pet => pet.Age + pet.Name.length)).to.be.equal(14)
      })
    })

    describe('Average', function () {
      it('should return the average of the array values', function () {
        expect([1,2,3,4,5].Average()).to.be.equal(3)
      })
    })
  })

  describe('Contains', function () {
    /*
    Spec: https://msdn.microsoft.com/de-de/library/bb352880(v=vs.110).aspx
    */
    const fruits = [ "apple", "banana", "mango", "orange", "passionfruit", "grape" ];

    it('should return true if array contains specified element', function() {
      expect(fruits.Contains('mango')).to.be.true;
    })

    it('should return false if array does not contains specified element', function() {
      expect(fruits.Contains('tomato')).to.be.false;
    })
  })

  describe('First/Last', function () {
    describe('First', function () {
      it('should return first element of an array', function () {
        expect([1, 2, 3, 4].First()).to.be.equal(1)
      })

      it('should return first element matching a predicate', function () {
        expect([10, 20, 30, 40, 50].First(x => x > 20)).to.be.equal(30)
      })
    })

    describe('Last', function () {
      it('should return last element of an array', function () {
        expect([1,2,3,4].Last()).to.be.equal(4)
      })

      it('should return last element matching a predicate', function () {
        expect([10, 20, 30, 40, 50].Last(x => x > 20)).to.be.equal(50)
      })
    })
  })

  describe('Concat/Union', function () {
    describe('Concat', function () {
      it('should concatenate two arrays', function () {
        expect([1, 2, 3].Concat([4, 5, 6])).to.be.deep.equal([1, 2, 3, 4, 5, 6])
      })

      it('should keep duplicates', function () {
        expect([1, 2, 3].Concat([2, 3, 4])).to.be.deep.equal([1, 2, 3, 2, 3, 4])
      })
    })

    describe('Union', function () {
      it('should concatenate and remove duplicates', function () {
        expect([1, 2, 3].Union([2, 3, 4])).to.be.deep.equal([1, 2, 3, 4])
      })

      it('should accept a function to define which entries are equal', function () {
        let petsA = [
          { name: 'miez', species: 'cat' },
          { name: 'wuff', species: 'dog' }
        ];

        let petsB = [
          { name: 'leo', species: 'cat' },
          { name: 'flipper', specices: 'dolphin' }
        ];

        expect(petsA.Union(petsB, (a, b) => a.species === b.species).length).to.be.equal(3) // miez and leo are assumed equal
        expect([1,2,3,4].Union([6, 8, 9], (a, b) => a % 2 === b % 2).length).to.be.equal(2) // [1, 2]
      })
    })
  })
})

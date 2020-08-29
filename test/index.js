#!/usr/bin/env node

const fs = require('fs')
const { clipStringToBitString, bitStringToClipString } = require('../lib/clipstring')
const { bitStringToDense, denseToBitString } = require('../lib/dense')
const { denseToSparse, sparseToDense } = require('../lib/sparse')
const { cleanBitString } = require('../lib/util')

fs.rmdirSync('./test_out/', { recursive: true })
fs.mkdirSync('./test_out/')
fs.mkdirSync('./test_out/separate/')

const allPath = './test_out/all'

const entry = (comment, clipString) => {
  const filePath = './test_out/separate/' + clipString

  fs.writeFileSync(filePath, comment, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, comment, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  fs.writeFileSync(filePath, clipString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, clipString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const bitString = clipStringToBitString(clipString)
  fs.writeFileSync(filePath, bitString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, bitString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const dense = bitStringToDense(bitString)
  const denseString = JSON.stringify(dense, null, 2)
  fs.writeFileSync(filePath, denseString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, denseString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const sparse = denseToSparse(dense)
  const sparseString = JSON.stringify(sparse, null, 2)
  fs.writeFileSync(filePath, sparseString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, sparseString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const denseFromSparse = sparseToDense(sparse)
  const denseFromSparseString = JSON.stringify(denseFromSparse, null, 2)
  fs.writeFileSync(filePath, denseFromSparseString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, denseFromSparseString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const annotatedBitString = denseToBitString(denseFromSparse)
  fs.writeFileSync(filePath, annotatedBitString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, annotatedBitString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  const roundtripClipString = bitStringToClipString(cleanBitString(annotatedBitString))
  fs.writeFileSync(filePath, roundtripClipString, { flag: 'a' })
  fs.writeFileSync(filePath, '\n', { flag: 'a' })
  fs.writeFileSync(allPath, roundtripClipString, { flag: 'a' })
  fs.writeFileSync(allPath, '\n', { flag: 'a' })

  if (roundtripClipString !== clipString) {
    console.error(`Clip string ${clipString} didn't roundtrip properly`)
  }

  fs.writeFileSync(allPath, '---\n', { flag: 'a' })
}

entry('(0, 0, 1) -> (15, 0)', 'AAAG')
entry('(0, 9, 1) -> (15, 0)', 'FAAmhB')
entry('(9, 0, 1) -> (15, 0)', 'FAIDhB')
entry('(0, 0, 1) -> (0, 1)', 'AAIAN')
entry('(0, 0, 1) -> (2, 1)', 'AAICN')
entry('(0, 0, 1) -> (14, 1)', 'AAIcN')
entry('(0, 0, 1) -> (0, 250)', 'AAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN')
entry('(0, 0, 1) -> (14, 250)', 'AAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN')
entry('(0, 0, 1) -> (14, 251)', 'AAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0')
entry('(0, 0, 1) -> (14, 252)', 'AAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQD')
entry('(0, 0, 1) -> (14, 253)', 'AAIcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN')

entry('(0, 0, 2) -> (15, 0), (0, 1)', 'AAIgN')
entry('(0, 0, 2) -> (15, 0), (1, 1)', 'AAIiN')
entry('(0, 0, 2) -> (15, 0), (2, 1)', 'AAIkN')
entry('(0, 0, 2) -> (15, 0), (3, 1)', 'AAImN')

entry('(0, 0, 2) -> (15, 0), (0, 2)', 'AAIg0')
entry('(0, 0, 2) -> (15, 0), (1, 2)', 'AAIi0')
entry('(0, 0, 2) -> (15, 0), (13, 2)', 'AAI60')
entry('(0, 0, 2) -> (15, 0), (14, 2)', 'AAI80')

entry('(0, 0, 2) -> (15, 0), (0, 3)', 'AAIgQD')
entry('(0, 0, 2) -> (15, 0), (14, 3)', 'AAI8QD')

entry('(0, 0, 2) -> (15, 0), (0, 4)', 'AAIgAN')
entry('(0, 0, 2) -> (15, 0), (14, 4)', 'AAI8AN')

entry('(0, 9, 2) -> (15, 0), (0, 1)', 'FAAmDYD')
entry('(0, 9, 2) -> (15, 0), (1, 1)', 'FAAmjYD')
entry('(0, 9, 2) -> (15, 0), (2, 1)', 'FAAmDZD')
entry('(0, 9, 2) -> (15, 0), (3, 1)', 'FAAmjZD')
entry('(0, 9, 2) -> (15, 0), (4, 1)', 'FAAmDaD')
entry('(0, 9, 2) -> (15, 0), (5, 1)', 'FAAmjaD')
entry('(0, 9, 2) -> (15, 0), (6, 1)', 'FAAmDbD')
entry('(0, 9, 2) -> (15, 0), (7, 1)', 'FAAmjbD')

entry('(0, 9, 2) -> (15, 0), (14, 1)', 'FAAmDfD')

entry('(0, 0, 1) -> (15, 0); (0, 9, 1) -> (15, 0)', 'AABglD')
entry('(0, 0, 1) -> (15, 0); (0, 9, 2) -> (15, 0), (0, 1)', 'AAJA4zN')
entry('(0, 0, 1) -> (15, 0); (0, 9, 2) -> (15, 0), (1, 1)', 'AAJC4zN')

entry('Full color column', 'GAYv4hQGqsDTd52HEDSycQJ1i1cvP')

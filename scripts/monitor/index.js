#!/usr/bin/env babel-node

import { eth, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { StoreCli } from './StoreCli'
import { db } from '../../src/database'
import { loadEnv } from '../../scripts/utils'

const log = new Log('main')

loadEnv('../../src/.env')

Promise.resolve()
  .then(() => {
    log.debug('Connecting to database')
    return db.connect()
  })
  .then(() => {
    log.debug('Connecting to Ethereum node')
    return eth.connect()
  })
  .then(() => {
    log.debug('Starting CLI')

    return new StoreCli(handlers, {
      Marketplace: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled'],
      LANDRegistry: ['Update', 'Transfer']
    }).run()
  })
  .catch(error => {
    log.error(error)
    process.exit()
  })

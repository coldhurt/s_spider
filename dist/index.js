#!/usr/bin/env node
'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const spider_1 = __importDefault(require('./spider'))
const commander_1 = require('commander')
const log_1 = require('./log')
function main() {
  const program = new commander_1.Command()
  program
    .version(
      require('../package.json').version,
      '-v --version',
      'output the current version'
    )
    .requiredOption('-u --url <url>', 'Target url')
    .option('-d --depth [depth]', 'Spider depth', 1)
    // .option('-t --thread [thread_count]', 'count of thread', 1)
    .option('-c --cookie [cookies]', 'Cookies')
    .option('-o --output [output]', 'Output urls to the file')
  const args = program.parse(process.argv)
  const opts = args.opts()
  const spider = new spider_1.default(opts)
  log_1.Log.info(`Target : ${opts.url}`)
  log_1.Log.info(`Depth : ${opts.depth}`)
  try {
    spider.start()
  } catch (e) {
    log_1.Log.error('error', e.message)
  }
}
main()

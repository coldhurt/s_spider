import Spider from './spider'
import { Command } from 'commander'
import { Log } from './log'

function main() {
  const program = new Command()
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
  const spider = new Spider(opts)
  Log.info(`Target : ${opts.url}`)
  Log.info(`Depth : ${opts.depth}`)
  try {
    spider.start()
  } catch (e) {
    Log.error('error', e.message)
  }
}
main()

import colors from 'colors'

const concatArgs = (args: IArguments) => {
  return Array.prototype.join.call(args, ' ')
}

const Log = {
  info: function(...optionalParams: any[]) {
    console.log(colors.gray('[*] ' + concatArgs(arguments)))
  },
  succ: function(...optionalParams: any[]) {
    console.log(colors.green('[+] ' + concatArgs(arguments)))
  },
  warn: function(...optionalParams: any[]) {
    console.log(colors.yellow('[!] ' + concatArgs(arguments)))
  },
  error: function(...optionalParams: any[]) {
    console.log(colors.red('[x] ' + concatArgs(arguments)))
  },
  logTime: function(f: Function) {
    const start = new Date().getTime()
    f()
    const end = new Date().getTime()
    Log.info(`Total runtime ${(end - start) / 1000} s`)
  }
}

export { Log }

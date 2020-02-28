import { Url, parse } from 'url'
import puppeteer, { Browser } from 'puppeteer'
import fs from 'fs'
import { Log } from './log'

interface SpiderProps {
  [name: string]: string
}

const exclude_path = ['logout']

const exclude_ext = ['pdf', 'jpg', 'png', 'ico', 'jpeg', 'docx', 'xslx', 'pptx']

export default class Spider {
  target: string
  depth: number
  targetDir: string
  urlObj: null | Url
  needCheckUrls: string[] = []
  checkedUrls: string[] = []
  browser: null | Browser = null
  cookie: string
  output: string

  constructor(props: SpiderProps) {
    this.target = parse(props.url).href
    this.depth = parseInt(props.depth) || 1
    this.targetDir = this.getDir(this.target)
    this.urlObj = parse(this.target)
    this.needCheckUrls.push(this.target)
    this.cookie = props.cookie || ''
    this.output = props.output
  }

  async start(target = this.target) {
    const start = new Date().getTime()
    while (1) {
      const target = this.needCheckUrls.pop()
      if (target && !this.checkedUrls.includes(target)) {
        const t = parse(target)
        if (t && t.path) {
          let not_check = 0
          for (const exclude_str of exclude_path) {
            if (t.path.indexOf(exclude_str) !== -1) {
              not_check = 1
              break
            }
          }
          const ext_index = t.path.lastIndexOf('.')
          if (ext_index !== -1 && ext_index >= t.path.length - 6) {
            const ext = t.path.substr(ext_index + 1)
            if (exclude_ext.includes(ext)) {
              not_check = 2
            }
          }
          switch (not_check) {
            case 1:
              this.checkedUrls.push(target)
              Log.info(`${target} not checked this exclude path`)
              continue
              break
            case 2:
              this.checkedUrls.push(target)
              Log.info(`${target} not checked this exclude ext`)
              continue
          }
        }
        if (!target.endsWith('010/')) {
          try {
            await this.getUrls(target)
          } catch (e) {
            Log.error(`${target} ${e.message}`)
          }
          this.checkedUrls.push(target)
        }
      } else if (this.needCheckUrls.length === 0) {
        const end = new Date().getTime()
        Log.info(`Total runtime is ${(end - start) / 1000} s`)
        if (this.output) {
          fs.writeFileSync(this.output, this.checkedUrls.join('\n'))
          Log.info(
            `Save urls to ${this.output}, url count is ${this.checkedUrls.length}`
          )
        }
        process.exit()
      }
    }
  }

  filterUrl(urls: string[] = []) {
    for (let u of urls) {
      const t = parse(u)
      u = `${t.protocol}//${t.hostname}${t.path}`
      if (
        u.startsWith(this.targetDir) &&
        !this.checkedUrls.includes(u) &&
        !this.needCheckUrls.includes(u)
      ) {
        const relativePath = u.replace(this.targetDir, '')
        let depth = relativePath.split('/').length
        if (relativePath.endsWith('/')) {
          depth--
        }
        if (depth <= this.depth) {
          this.needCheckUrls.push(u)
        }
      }
    }
  }

  getDir(target = '') {
    if (target.endsWith('/')) {
      return target
    }
    return target.substr(0, target.lastIndexOf('/') + 1)
  }

  async getUrls(target = '') {
    let urls = []
    if (target) {
      if (!this.browser)
        this.browser = await puppeteer.launch({
          timeout: 10000
        })
      const page = await this.browser.newPage()
      if (this.cookie) page.setExtraHTTPHeaders({ cookie: this.cookie.trim() })
      const t = parse(target)
      const dir = this.getDir(target)
      const res = await page.goto(target)

      urls = await page.evaluate(
        ({ protocol, dir }) => {
          const urls = []
          const as = document.querySelectorAll('a[href]')
          for (const ele of as) {
            let link = ele.getAttribute('href') || ''
            if (/^https?:/.test(link)) {
              if (link.startsWith(dir)) urls.push(link)
              else continue
            }
            if (link.startsWith('.')) {
              if (link.startsWith('./')) {
                link = link.substr(1)
              } else {
                continue
              }
            }
            if (link.startsWith('//')) {
              link = protocol + link
            } else if (link.startsWith('/')) {
              link = dir + link.substr(1)
            } else {
              link = dir + link
            }
            urls.push(link)
          }
          return urls
        },
        {
          protocol: t.protocol,
          dir
        }
      )
      this.filterUrl(urls)
      if (res) {
        const resUrl = res.url()
        if (parse(resUrl).path !== t.path) {
          Log.warn(`Redirect ${target} >>> ${resUrl}`)
        } else {
          Log.succ(target, res.status())
        }
      }
    }
  }
}

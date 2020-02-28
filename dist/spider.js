"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
const exclude_path = ['logout'];
const exclude_ext = ['pdf', 'jpg', 'png', 'ico', 'jpeg', 'docx', 'xslx', 'pptx'];
class Spider {
    constructor(props) {
        this.needCheckUrls = [];
        this.checkedUrls = [];
        this.browser = null;
        this.target = props.url;
        this.depth = parseInt(props.depth) || 1;
        this.targetDir = this.getDir(this.target);
        this.urlObj = url_1.parse(this.target);
        this.needCheckUrls.push(this.target);
        this.cookie = props.cookie || '';
        this.output = props.output;
    }
    async start(target = this.target) {
        const start = new Date().getTime();
        while (1) {
            const target = this.needCheckUrls.pop();
            if (target && !this.checkedUrls.includes(target)) {
                const t = url_1.parse(target);
                if (t && t.path) {
                    let not_check = 0;
                    for (const exclude_str of exclude_path) {
                        if (t.path.indexOf(exclude_str) !== -1) {
                            not_check = 1;
                            break;
                        }
                    }
                    const ext_index = t.path.lastIndexOf('.');
                    if (ext_index !== -1 && ext_index >= t.path.length - 6) {
                        const ext = t.path.substr(ext_index + 1);
                        if (exclude_ext.includes(ext)) {
                            not_check = 2;
                        }
                    }
                    switch (not_check) {
                        case 1:
                            this.checkedUrls.push(target);
                            log_1.Log.info(`${target} not checked this exclude path`);
                            continue;
                            break;
                        case 2:
                            this.checkedUrls.push(target);
                            log_1.Log.info(`${target} not checked this exclude ext`);
                            continue;
                    }
                }
                if (!target.endsWith('010/')) {
                    try {
                        await this.getUrls(target);
                    }
                    catch (e) {
                        log_1.Log.error(`${target} ${e.message}`);
                    }
                    this.checkedUrls.push(target);
                }
            }
            else if (this.needCheckUrls.length === 0) {
                const end = new Date().getTime();
                log_1.Log.info(`Total runtime is ${(end - start) / 1000} s`);
                if (this.output) {
                    fs_1.default.writeFileSync(this.output, this.checkedUrls.join('\n'));
                    log_1.Log.info(`Save urls to ${this.output}, url count is ${this.checkedUrls.length}`);
                }
                process.exit();
            }
        }
    }
    filterUrl(urls = []) {
        for (let u of urls) {
            const t = url_1.parse(u);
            u = `${t.protocol}//${t.hostname}${t.path}`;
            if (u.startsWith(this.targetDir) &&
                !this.checkedUrls.includes(u) &&
                !this.needCheckUrls.includes(u)) {
                const relativePath = u.replace(this.targetDir, '');
                let depth = relativePath.split('/').length;
                if (relativePath.endsWith('/')) {
                    depth--;
                }
                if (depth <= this.depth) {
                    this.needCheckUrls.push(u);
                }
            }
        }
    }
    getDir(target = '') {
        if (target.endsWith('/')) {
            return target;
        }
        return target.substr(0, target.lastIndexOf('/') + 1);
    }
    async getUrls(target = '') {
        let urls = [];
        if (target) {
            if (!this.browser)
                this.browser = await puppeteer_1.default.launch({
                    timeout: 10000
                });
            const page = await this.browser.newPage();
            if (this.cookie)
                page.setExtraHTTPHeaders({ cookie: this.cookie.trim() });
            const t = url_1.parse(target);
            const dir = this.getDir(target);
            const res = await page.goto(target);
            urls = await page.evaluate(({ protocol, dir }) => {
                const urls = [];
                const as = document.querySelectorAll('a[href]');
                for (const ele of as) {
                    let link = ele.getAttribute('href') || '';
                    if (/^https?:/.test(link)) {
                        if (link.startsWith(dir))
                            urls.push(link);
                        else
                            continue;
                    }
                    if (link.startsWith('.')) {
                        if (link.startsWith('./')) {
                            link = link.substr(1);
                        }
                        else {
                            continue;
                        }
                    }
                    if (link.startsWith('//')) {
                        link = protocol + link;
                    }
                    else if (link.startsWith('/')) {
                        link = dir + link.substr(1);
                    }
                    else {
                        link = dir + link;
                    }
                    urls.push(link);
                }
                return urls;
            }, {
                protocol: t.protocol,
                dir
            });
            this.filterUrl(urls);
            if (res) {
                const resUrl = res.url();
                if (url_1.parse(resUrl).path !== t.path) {
                    log_1.Log.warn(`Redirect ${target} >>> ${resUrl}`);
                }
                else {
                    log_1.Log.succ(target, res.status());
                }
            }
        }
    }
}
exports.default = Spider;

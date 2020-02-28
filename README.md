# s_spider

A fast crawler with pyppteer, this crawler can crawl SPA(single page application)

# install

```bash
npm install -g s_spider
```

# usage

```bash
$ s_spider -h

Usage: index.ts [options]

Options:
  -v --version           output the current version
  -u --url <url>         Target url
  -d --depth [depth]     Spider depth (default: 1)
  -c --cookie [cookies]  Cookies
  -o --output [output]   Output urls to the file
  -h, --help             output usage information
```

# example

```bash
$ s_spider -u http://192.168.99.100/001/ --cookie 'security=impossible; wp-settings-time-1=1578462072; PHPSESSID=8513117ca3a0935a7b7e89265f78fe13' -d 2 -o output.txt
[*] Target : http://192.168.99.100/001/
[*] Depth : 2
[+] http://192.168.99.100/001/ 200
[*] http://192.168.99.100/001/logout.php not checked this exclude path
[+] http://192.168.99.100/001/about.php 200
[+] http://192.168.99.100/001/instructions.php?doc=PHPIDS-license 200
[+] http://192.168.99.100/001/?doc=PHPIDS-license 200
[+] http://192.168.99.100/001/?doc=copying 200
[+] http://192.168.99.100/001/?doc=changelog 200
[+] http://192.168.99.100/001/?doc=PDF 200
[+] http://192.168.99.100/001/?doc=readme 200
[*] http://192.168.99.100/001/docs/DVWA_v1.3.pdf not checked this exclude ext
[+] http://192.168.99.100/001/phpinfo.php 200
[+] http://192.168.99.100/001/security.php 200
[+] http://192.168.99.100/001/ids_log.php 200
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/script%3E 200
[*] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/logout.php not checked this exclude path
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/about.php 200
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/phpinfo.php 200
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/security.php 200
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/setup.php 200
[+] http://192.168.99.100/001/?test=%22%3E%3Cscript%3Eeval(window.name)%3C/instructions.php 200
[+] http://192.168.99.100/001/?phpids=on 200
[+] http://192.168.99.100/001/vulnerabilities/javascript/ 200
[+] http://192.168.99.100/001/vulnerabilities/csp/ 200
[+] http://192.168.99.100/001/vulnerabilities/xss_s/ 200
[+] http://192.168.99.100/001/vulnerabilities/xss_r/ 200
[+] http://192.168.99.100/001/vulnerabilities/xss_d/ 200
[+] http://192.168.99.100/001/vulnerabilities/weak_id/ 200
[+] http://192.168.99.100/001/vulnerabilities/sqli_blind/ 200
[+] http://192.168.99.100/001/vulnerabilities/sqli/ 200
[+] http://192.168.99.100/001/vulnerabilities/captcha/ 200
[+] http://192.168.99.100/001/vulnerabilities/upload/ 200
[+] http://192.168.99.100/001/vulnerabilities/csrf/ 200
[+] http://192.168.99.100/001/vulnerabilities/exec/ 200
[+] http://192.168.99.100/001/vulnerabilities/brute/ 200
[+] http://192.168.99.100/001/setup.php 200
[+] http://192.168.99.100/001/instructions.php 200
[*] Total runtime is 27.302 s
[*] Save urls to output.txt, url count is 36
```

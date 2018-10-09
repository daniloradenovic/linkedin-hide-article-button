# ![Linkedin hide article button logo](icons/icon48x48.png) LinkedIn hide article button

Adds a button for easy hiding of articles on LinkedIn's homepage. 
Saves an extra click and mouse move to hide an article you're 
not interested in from your feed.

## Supported browsers
![Firefox](https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Firefox_Logo%2C_2017.svg/64px-Firefox_Logo%2C_2017.svg.png)
![Google Chrome](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/64px-Google_Chrome_icon_%28September_2014%29.svg.png)

## Installation
### Latest release
* Firefox
  * go to homepage of the extension on [Firefox Addons](https://addons.mozilla.org/en-US/firefox/) and click **Add to Firefox**
* Chrome
  * go to homepage of the extension on 
[Chrome Web Store](https://chrome.google.com/webstore/detail/linkedin-hide-article-but/pkgjaephjiidkkbakdnpalcccbdihlnm) 
and click **Add to Chrome**

### Development
* Firefox
  * Open menu -> Add-ons (or `Ctrl` + `Shift` + `A`) -> Settings -> Install add-on from file -> Select source directory
* Chrome
  * Type `chrome://extensions/` in the address bar and hit `Enter` -> Load unpacked -> Select source directory

## Building the plugin from source

### Pre-requisites

The following dependencies with their versions are required to build the plugin.
Prior versions of these dependencies will likely work as well:
* node v8.10.0
* npm v3.5.2

To install `node` and all the `npm` modules, 
run the following in terminal (required only the first time):

#### Linux
```
apt-get install node
npm install
```
#### OS X
```
brew install node
npm install
```
To build the plugin, run:
```
gulp
```
This will create a **dist** directory which contains all the plugin content
with minified code, along with a .zip archive required for web stores.

## Contributors
* [Anja Stanojevic](https://www.linkedin.com/in/anja-stanojevic-459a5631/)
* [Tomo Radenovic](https://www.linkedin.com/in/tomo-radenovic-a59a4971/)
* [Danilo Radenovic](https://www.daniloradenovic.com)
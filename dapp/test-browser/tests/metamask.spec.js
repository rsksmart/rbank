module.exports = {
  'Simple Google search': (browser) => {
    browser
      .url('http://google.com')
      .waitForElementPresent('body', 1000)
      .assert.title('Google')
      .assert.visible('input[type=text]')
      .setValue('input[type=text]', ['metamask extension', browser.Keys.ENTER])
      .pause(1000)
      .perform(() => {
        console.log('Yeah I just print this');
      })
      /*
      .assert.containsText(
      'ol#rso li:first-child',
      'MetaMask - Google Chrome')
      */
      .end()
  },
  'Metamask connection on Google chrome': (browser) => {
    browser
      .url('localhost:8080')
      .waitForElementVisible('body', 5000)
      .setupMetamask('passphrase', 'password')
      .click('.network-indicator__down-arrow')
      /*
      .execute(() => {
        window.open('', 'MetaMask', 'width=2560, height=1440')
      })
      .switchWindow('MetaMask')
      .url('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
      .pause(50000)
      .assert.urlContains('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
      .waitForElementPresent('.first-time-flow__button')
      .click('.first-time-flow__button')
      .waitForElementPresent('.select-action__select-button:nth-of-type(1) > .first-time-flow__button')
      .click('.select-action__select-button:nth-of-type(1) > .first-time-flow__button')
      .waitForElementPresent('.page-container__footer-button:nth-of-type(2)')
      .click('.page-container__footer-button:nth-of-type(2)')
      .waitForElementPresent('.first-time-flow__textarea')
      .setValue('.first-time-flow__textarea', 'passphrase')
      .setValue('*[autocomplete="new-password"]', 'password')
      .setValue('*[autocomplete="confirm-password"]', 'password')
      .click('.first-time-flow__checkbox')
      .click('.first-time-flow__button')
      .pause(5000)
      .click('.first-time-flow__button')
      .perform(() => {
        done()
      })
      */
      .end()
  },
  /*
'Should connect to Ethereum Main Network using MetaMask': function (browser) {
  browser.waitForElementPresent('*[data-id="remixIdeSidePanel"]')
    .switchBrowserTab(2)
    .waitForElementPresent('.network-indicator__down-arrow')
    .click('.network-indicator__down-arrow')
    .useXpath().click("//span[text()='Main Ethereum Network']")
    .useCss().switchBrowserTab(0)
    .refresh()
    .waitForElementVisible('*[data-id="remixIdeIconPanel"]', 10000)
    .click('*[data-id="landingPageStartSolidity"]')
    .pause(5000)
    .clickLaunchIcon('udapp')
    .waitForElementPresent('*[data-id="settingsSelectEnvOptions"]')
    .click('*[data-id="settingsSelectEnvOptions"] option[id="injected-mode"]')
    .waitForElementPresent('*[data-id="settingsNetworkEnv"]')
    .assert.containsText('*[data-id="settingsNetworkEnv"]', 'Main (1) network')
},
'Should deploy contract on Ethereum Main Network using MetaMask': function (browser) {
  browser.waitForElementPresent('*[data-id="runTabSelectAccount"] option')
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/Greet.sol')
    .clickLaunchIcon('udapp')
    .waitForElementPresent('*[data-id="Deploy - transact (not payable)"]')
    .click('*[data-id="Deploy - transact (not payable)"]')
    .pause(2000)
    .waitForElementPresent('*[data-id="modalDialogContainer"]')
    .assert.containsText('*[data-id="modalDialogModalBody"]', 'You are creating a transaction on the main network. Click confirm if you are sure to continue.')
    .modalFooterCancelClick()
    .end()
},*/
};

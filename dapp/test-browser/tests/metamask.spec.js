require('dotenv').config();

const passphrase = process.env.account_passphrase;
const password = process.env.account_password;

module.exports = {
  'MetaMask ganache-cli connection on Google chrome': (browser) => {
    browser
      .url('localhost:8080')
      .waitForElementVisible('body', 5000)
      .setupMetamask(passphrase, password)
      .click('.network-indicator__down-arrow')
      .useXpath().click("//span[text()='Localhost 8545']")
      .pause(5000)
      .end()
  },
};

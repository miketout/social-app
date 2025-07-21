# Development Environment Setup

## Getting the Desktop Wallet

These are the two development environment branches for the desktop wallet.
- [Verus Desktop (password-manager)](https://github.com/mcstoer/Verus-Desktop/tree/password-manager)
- [Verus Login Consent Client (password-manager)](https://github.com/mcstoer/verus-login-consent-client/tree/password-manager)

Follow their respective instructions to get the Desktop Wallet running.

### Setting up Deeplinks with the Desktop Wallet

#### MacOS and Windows

Deeplinks should work out of the box when you install the Desktop Wallet on MacOS and Windows.

#### Linux

For deeplinks to work on Linux, the operating system needs to be able to associate the desktop wallet with the deeplinks. This requires either using a tool like AppImageLauncher, or manually setting up the association. See the guide in this [pull request](https://github.com/VerusCoin/Verus-Desktop/pull/259) for details.

## Project Requirements

The project requires:
- Node.js 20
  - For Windows: [https://nodejs.org/en/blog/release/v20.9.0](https://nodejs.org/en/blog/release/v20.9.0)
- yarn (install after Node.js  with `npm install --global yarn`)

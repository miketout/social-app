# Credential Demo

## Add Credentials to the Contentmultimap 

The identity's contentmultimap needs credentials, including a username and password, to be able to log in.

### 1. Generate the encryption and viewing keys.

Use `z_getencryptionaddress` with the z-address from the identity, and set `fromID` and `toID` to the identity.
```bash
./verus z_getencryptionaddress '{
    "address": "z-address",
    "fromid": "identity@",
    "toid": "identity@"
}'
```

Save the `address` (encryption address) and `extendedviewingkey` for later.

### 2. Encrypt the credentials.

Use `signdata` to encrypt the credentials. The credentials should be formatted as follows.
```bash
"vrsc::data.type.object.credential":{
  "version": 1,
  "credentialKey": "",
  "credential": "",
  "scopes": ""
}
```

For the credential, the fields need to be set as follows
* **version**: Set as 1
* **credentialKey**: Use `iN6LYCurcypx7orxkFB73mWRq6Jetf23ck` for the plain login key
* **credential**: This is the username and password in a list
* **scopes**: The i-address or name of the identity **signing** the login requests in a list

For encrypting a username and password, this would look as follows.
```bash
./verus -testnet signdata '{
  "address":"iNP8ja6aDsG3dDgQcFpGwqfLhj5kPAiQF5",
  "vdxfdata": {
    "vrsc::data.type.object.credential":{
      "version": 1,
      "credentialKey": "iHh1FFVvcNb2mcBudD11umfKJXHbBbH6Sj",
      "credential": ["username_here", "password_here"],
      "scopes": ["AppID@"]
    }
  },
  "encrypttoaddress": "address_for_encryption"
}'
```

After running `signdata`, get the data descriptor in the array under the first `datadescriptor` key. This will be added to the contentmultimap later.  

Perform encryption to get the username and password descriptor.

### 3. Updating the Identity's Contentmultimap

Now you should have the `extendedviewingkey`, and a data descriptor for the credential.

Generate the `vrsc::identity.credentials` key hashed with the `extendedviewingkey` using `getvdxfid`.
```bash
./verus getvdxfid vrsc::identity.credentials '{"vdxfkey":"extendedviewingkey"}'
```

From the resulting JSON, save the `vdxfid` value under the `vdxfid` key. Now with the `vdxfid` value and the data descriptors,
use `updateidentity` with the following format to add these to the contentmultimap.

```bash
./verus updateidentity '{     
  "name": "identity@",
  "contentmultimap": {
    "vdxfid value": [
        {
          "vrsc::data.type.object.datadescriptor": data descriptor
        }
    ]
  }
}'
```

With the data descriptors, the command should look similar to the following.
```bash
./verus updateidentity '{     
  "name": "identity@",
  "contentmultimap": {
    "iGyAsYou1KCBkspTRMtFfKusvZPmwHENE3": [
        {
          "vrsc::data.type.object.datadescriptor": {
            "version": 1,
            "flags": 5,
            "objectdata": "9617d77c118427b0d5642c51a2ffbae5c288e9d91c0b23d3bdc36d9d0ee73ef73c7191bdb8b821274975f7785b718b1b19a9cb038d2476dc96d520439bb4fbb95e3e36122a9790c9c60cedbdb9e4f49acf2c5f4307931171ad266h508e336f9ee49903fe56c96aa523ea3caa20d9bda79b074c71f51b9cfed874c7d6dba07242d29a4d5b48688e673febbbee0f9f65c11b72d35ff264",
            "epk": "bf5a310cfd6e74cc8f1c2a4659232f30ea4e31a429d5d7c27080e349e9b1ec1d"
          }
        }
    ]
  }
}'
```

## Setting up Deeplinks with the Desktop Wallet

### Windows

Deeplinks should work out of the box when you install the Desktop Wallet on Windows.

### Linux

For deeplinks to work on Linux, the operating system needs to be able to associate the desktop wallet with the deeplinks. This requires either using a tool like AppImageLauncher, or manually setting up the association. See the guide in this [pull request](https://github.com/VerusCoin/Verus-Desktop/pull/259) for details.

## Setting up VeruSky

### Setting up the Environment

The project requires:
- Node.js 20 [https://nodejs.org/en/blog/release/v20.9.0](https://nodejs.org/en/blog/release/v20.9.0)
    - When installing Node.js, keep the default options.
- yarn (install after Node.js  with `npm install --global yarn`)
- [Git for Windows](https://gitforwindows.org/)

### Getting the Code

Get the VeruSky code **directly** from the `verusky-demo` branch at [https://github.com/mcstoer/social-app/tree/verusky-demo](https://github.com/mcstoer/social-app/tree/verusky-demo).
The `verusky-demo` branch has no filenames with colons, as those cause issues on Windows.

For Git for Windows (`git`), open a terminal and run
```
git clone https://github.com/mcstoer/social-app.git --branch verusky-demo
cd social-app
```

<details>
<summary>If Git for Windows is <strong>not</strong> working</summary>

You will **need** to log into a GitHub account for this to work.
    
Download [GitHub CLI](https://cli.github.com/)

For GitHub CLI (`gh`), open a terminal and run
```
gh auth login
gh repo clone https://github.com/mcstoer/social-app.git  -- --branch verusky-demo
cd social-app
```
   
</details>


### Running the VeruSky Web App

You will need three terminals in total, one for each local server.

#### Terminal 1
In the `social-app` directory, run the main social media app
```bash
yarn
yarn web
```

#### Terminal 2
In `social-app/vskylogin` directory, run the login server
```bash
yarn
yarn dev
```

#### Terminal 3
In `social-app/vskysigningserver` directory, and do either of the following to setup the `.env` file.

<details open>
<summary>If you have the contents for an <code>.env</code> file for the signing server:</summary>

1. Create a `.env` file.
2. Copy the contents into the file.

</details>

<details>
<summary>If you do not have the contents:</summary>
    
1. Copy the `.env.example` file to `.env`.
2. Find an identity you want to use to sign the requests. This should be the same identity used for **scopes** in the credentials from above.
3. Get the i-address and associated WIF for that identity.
4. Set `IADDRESS` and `WIF` variables to the matching values for the identity.
   
</details>

After creating the `.env` file, then run the signing server.
```bash
yarn
yarn dev
```

## Login Process Demo

1. Visit [http://localhost:19006](http://localhost:19006), the web app's URL.
2. Click the "Sign in" button.
3. With the account provider as "VeruSky", click the "Next" button. You may have to wait briefly for the "Next" button to load.
4. This should automatically open the Desktop Wallet if deeplinks are properly configured.
    - If this does not open on Linux, check [Setting up Deeplinks with the Desktop Wallet](#setting-up-deeplinks-with-the-desktop-wallet)
6. Review the login prompts and select the identity containing the credentials (`VeruSky@`).
7. Click "Done" and return back to the web app. The login should then complete after a brief moment.
8. Going into "Settings" and then "Account" will show you the identity's name at the top, above the email address.

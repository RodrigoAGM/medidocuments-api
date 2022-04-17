import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Config {
  connectionFile: string
  appAdmin: string
  appAdminSecret: string
  orgMSPID: string
  caName: string
  walletUrl: string,
  walletDbName: string
}

// capture network variables from config.json
const configPath = join(process.cwd(), './fabric.config.json');
const configJSON = readFileSync(configPath, 'utf8');
const config: Config = JSON.parse(configJSON);

const { appAdmin } = config;
const { appAdminSecret } = config;
const { orgMSPID } = config;
const { caName } = config;

async function main() {
  try {
    // Create a new CA client for interacting with the CA.
    const caURL = caName;
    const ca = new FabricCAServices(caURL);

    const wallet = await Wallets.newCouchDBWallet({ url: config.walletUrl }, config.walletDbName);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.get(appAdmin);

    if (adminExists) {
      console.log(`An identity for the admin user ${appAdmin} already exists in the wallet`);
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: appAdmin,
      enrollmentSecret: appAdminSecret,
    });

    const identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMSPID,
      type: 'X.509',
    };

    await wallet.put(appAdmin, identity);
    console.log(`msg: Successfully enrolled admin user ${appAdmin} and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user ${appAdmin}: ${error}`);
    process.exit(1);
  }
}

main();

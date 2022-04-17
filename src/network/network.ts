import path from 'path';
import fs from 'fs';
import { Gateway, Wallets, X509Identity } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { Config } from './interface/config.interface';
import { NetworkData } from './interface/network.interface';
import { ContractResult, Result } from '../types/types';
import AppError from '../error/app.error';

class FabricNetworkClass {
  private static _instance: FabricNetworkClass

  private config: Config

  private conn: any

  private gateway?: Gateway

  constructor() {
    try {
      // Connect to the config file
      const configPath = path.join(process.cwd(), './fabric.config.json');
      const configJSON = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configJSON);

      // Connect to the connection file
      const connPath = path.join(process.cwd(), this.config.connectionFile);
      const connJSON = fs.readFileSync(connPath, 'utf8');
      this.conn = JSON.parse(connJSON);
    } catch (error) {
      throw new AppError({ message: 'Ocurrio un error al configurar el Fabric Network', statusCode: 500 });
    }
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  getAdminUsername() {
    return this.config.appAdmin;
  }

  async disconnect() {
    try {
      if (this.gateway) {
        this.gateway.disconnect();
      }
    } catch (error) {
      throw new AppError({ message: 'Ocurrio un error al desconectar el Fabric Network', statusCode: 500 });
    }
  }

  async connectToNetwork(username: string): Promise<NetworkData> {
    try {
      // Create a new couchdb wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        { url: this.config.walletUrl }, this.config.walletDbName
      );

      const userExists = await wallet.get(username);

      if (!userExists) {
        console.log(`An identity for the user ${username} does not exist in the wallet`);
        return Promise.reject(new AppError({
          message: `An identity for the user ${username} does not exist in the wallet.`,
          statusCode: 404,
        }));
      }

      const gateway = this.gateway ?? new Gateway();
      await gateway.connect(this.conn, {
        wallet,
        identity: username,
        discovery: this.config.gatewayDiscovery,
      });
      this.gateway = gateway;

      // Connect to our local fabric
      const network = await gateway.getNetwork('mychannel');

      // Get the contract we have installed on the peer
      const contract = network.getContract('medidocuments-contract');

      const networkData: NetworkData = {
        contract,
        network,
        gateway,
      };

      return Promise.resolve(networkData);
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      return Promise.reject(new AppError({
        message: error as string ?? 'Error interno', statusCode: 500,
      }));
    }
  }

  async checkIfUserExists(userId: string): Promise<boolean> {
    try {
      // Create a new couchdb wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        { url: this.config.walletUrl }, this.config.walletDbName
      );

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.get(userId);

      if (userExists !== undefined) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    } catch (error) {
      return Promise.reject(new AppError({
        message: 'Failed to check user.',
        statusCode: 500,
      }));
    }
  }

  async registerUser(userId: string): Promise<string> {
    try {
      // Create a new couchdb wallet for managing identities.
      const wallet = await Wallets.newCouchDBWallet(
        { url: this.config.walletUrl }, this.config.walletDbName
      );

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.get(userId);

      if (userExists !== undefined) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return Promise.reject(new AppError({
          message: 'The voter id is already registered.',
          statusCode: 400,
        }));
      }

      // Check to see if we've already enrolled the admin user.
      const adminExists = await wallet.get(this.config.appAdmin);

      if (!adminExists) {
        console.log('An identity for the admin user does not exist in the wallet yet.');
        return Promise.reject(new AppError({
          message: 'An identity for the admin user does not exist in the wallet yet.',
          statusCode: 400,
        }));
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();

      await gateway.connect(this.conn, {
        wallet,
        identity: this.config.appAdmin,
        discovery: this.config.gatewayDiscovery,
      });

      // Get the admin user from admin identity
      const adminIdentity = gateway.getIdentity();
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, this.config.appAdmin);

      // Load the CA
      const caURL = this.config.caName;
      const ca = new FabricCAServices(caURL);

      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register({
        affiliation: '',
        enrollmentID: userId,
        role: 'client',
      }, adminUser);

      // Enroll new user
      const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });

      // Create identity to add user to wallet
      const userIdentity: X509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: this.config.orgMSPID,
        type: 'X.509',
      };

      // Add identity to wallet
      await wallet.put(userId, userIdentity);

      // Disconnect gateway
      gateway.disconnect();

      return Promise.resolve('User registered.');
    } catch (error) {
      console.log(error);
      return Promise.reject(new AppError({
        message: 'Failed to register user.',
        statusCode: 500,
      }));
    }
  }

  async invoke(
    networkData: NetworkData,
    submit: boolean,
    transaction: string,
    args?: string[]
  ): Promise<Result<any>> {
    try {
      // Declare general response buffer
      let response: Buffer;

      // Check if is a evaluate or submit transaction
      if (submit) {
        if (args) {
          // Submit with args
          response = await networkData.contract.submitTransaction(transaction, ...args);
        } else {
          // Submit without args
          response = await networkData.contract.submitTransaction(transaction);
        }
      } else if (args) {
        // Evaluate with args
        response = await networkData.contract.evaluateTransaction(transaction, ...args);
      } else {
        // Evaluate without args
        response = await networkData.contract.evaluateTransaction(transaction);
      }
      // Close gateway connection
      networkData.gateway.disconnect();

      // Handle Result
      const contractResult: ContractResult = JSON.parse(response.toString());

      if (contractResult.success === false) {
        return Promise.reject(contractResult.error);
      }

      // Resolve promise
      return Promise.resolve({ success: contractResult.success, data: contractResult.data });
    } catch (error) {
      return Promise.reject(new AppError({
        message: `Failed to submit transaction: ${error}`,
        statusCode: 500,
      }));
    }
  }
}

export const FabricNetwork = FabricNetworkClass.getInstance();

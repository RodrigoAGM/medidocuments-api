export interface Config {
  connectionFile: string
  appAdmin: string
  appAdminSecret: string
  orgMSPID: string
  caName: string
  gatewayDiscovery: {
    enabled: boolean,
    asLocalhost: boolean
  }
  walletUrl: string
  walletDbName: string
}

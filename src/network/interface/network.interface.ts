import { Contract, Gateway, Network } from 'fabric-network';

export interface NetworkData {
  contract: Contract,
  network: Network,
  gateway: Gateway
}

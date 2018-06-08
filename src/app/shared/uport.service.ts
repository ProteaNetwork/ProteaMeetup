import { Injectable } from '@angular/core';
import { Connect, SimpleSigner } from 'uport-connect';

@Injectable({
  providedIn: 'root'
})
export class UportService {
  private name = 'Protea Party V1';
  private clientId = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private privateKey = 'bc10f80699eef7b564d47373eea7add5cf26de5ffdd20e38b38ed89c0b0f8030';
  private networkName = 'rinkeby';
  private address = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private publicKey = '0x047ae6e19ba6791f09481c7030d95d6e89992446b62568c9aebbc28621dd9ed045f7c74cf2ee00844a9c4cd134eb1083e4062c03d166034c496b57d0f158bc0889';

  private uport: any;

  constructor() {
    this.uport = new Connect(this.name, {
      clientId: this.clientId,
      network: this.networkName,
      signer: SimpleSigner(this.privateKey)
    });
  }

  public getWeb3() {
    return this.uport.getWeb3();
  }
}
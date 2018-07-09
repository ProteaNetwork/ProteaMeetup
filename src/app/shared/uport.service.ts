import { Injectable } from '@angular/core';
import { Connect, SimpleSigner, MNID } from 'uport-connect';
import { ICredentials } from './interface/credentials';

@Injectable({
  providedIn: 'root'
})
export class UportService {
  private name = 'Protea Party V1';
  private clientId = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private privateKey = 'bc10f80699eef7b564d47373eea7add5cf26de5ffdd20e38b38ed89c0b0f8030';
  private networkName = 'rinkeby';

  public credentials: ICredentials;

  private uport: any;

  constructor() {
    this.uport = new Connect(this.name, {
      clientId: this.clientId,
      network: this.networkName,
      signer: SimpleSigner(this.privateKey)
    });

    console.log(this.decodeMNID('2orqKnm6xmXZ1cbfDcM4b6dvYjcbebjpRT9'));
  }

  public getWeb3() {
    return this.uport.getWeb3();
  }

  public decodeMNID (_address: string) {
    const decoded = MNID.decode(_address);
    return decoded.address;
  }

  public requestCredentials(_requested: string[] = null, _verified: string[] = null): Promise<any> {
    const req = {
      requested: _requested,
      verified: _verified,
      notifications: true
    };

    return new Promise((reject, resolve) => {
      if (this.credentials) { resolve(this.credentials); }

      this.uport.requestCredentials(req).then((credentials: ICredentials) => {
        this.credentials = credentials;
        console.log(this.credentials);
        resolve(credentials);
      });
    });
  }

  public getAddress() {
    return this.decodeMNID(this.credentials.networkAddress);
  }

}

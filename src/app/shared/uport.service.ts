import { Injectable } from '@angular/core';
import { Connect, SimpleSigner, MNID } from 'uport-connect';
import { ICredentials } from './interface/credentials';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProteaUser } from './interface/user';
import { EventService } from './event.service';

import to from 'await-to-js';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class UportService {
  private web3: any;
  public network = 0;
  public ready = false;

  private name = 'Protea Party V1';
  private clientId = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private privateKey = 'bc10f80699eef7b564d47373eea7add5cf26de5ffdd20e38b38ed89c0b0f8030';
  private networkName = 'rinkeby';


  private _user: BehaviorSubject <ProteaUser> ;
  public user$: Observable <ProteaUser> = this._user.asObservable();

  private uport: any;

  constructor(private eventService: EventService) {
    this.uport = new Connect(this.name, {
      clientId: this.clientId,
      network: this.networkName,
      signer: SimpleSigner(this.privateKey)
    });
    window.addEventListener('load', (event) => {
      this.web3 = this.uport.getWeb3();
    });
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }
    const contractAbstraction = this.web3.eth.contract(artifacts.abi);
    return contractAbstraction;

  }

  public getAddress() {
    return this._user.getValue().address;
  }

  public isValidAddress(address: string): boolean {
    return this.web3.isAddress(address);
  }

  public decodeMNID(_address: string) {
    const decoded = MNID.decode(_address);
    return decoded.address;
  }

  public async login() {
    await this.requestCredentials(['name', 'avatar', 'phone']);
    this.ready = true;
  }

  private requestCredentials(_requested: string[] = null, _verified: string[] = null): Promise < any > {
    const req = {
      requested: _requested,
      verified: _verified,
      notifications: true
    };

    return new Promise((resolve, reject) => {
      this.uport.requestCredentials(req).then((credentials: ICredentials) => {
        const user = new ProteaUser(this._user.getValue());
        user.MNID = credentials.networkAddress;
        user.address = this.decodeAddress(credentials.networkAddress);
        user.name = credentials.name;
        user.phone = credentials.phone;
        this._user.next(user);
        resolve();
      });
    });
  }

  public decodeAddress(_networkAddress: string) {
    return this.decodeMNID(_networkAddress);
  }

  public async getUserEventData() {
    // User states
    const user = new ProteaUser(this._user.getValue());
    user.isAdmin = await this.eventService.isAdmin();
    user.isRegistered = await this.eventService.isRegistered();
    user.isPaid = await this.eventService.isPaid();
    user.hasAttended = await this.eventService.hasAttended();
    this._user.next(user);
  }

  public getTransactionReceiptMined(txHash: string, interval: number = null) {
    // @TODO: error handling on rejection from uport
    const transactionReceiptAsync = (resolve, reject) => {
      this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          reject(error);
        } else if (receipt == null) {
          setTimeout(
            () => transactionReceiptAsync(resolve, reject),
            interval ? interval : 500);
        } else {
          resolve(receipt);
        }
      });
    };

    if (Array.isArray(txHash)) {
      return Promise.all(txHash.map(
        oneTxHash => this.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === 'string') {
      return new Promise(transactionReceiptAsync);
    } else {
      throw new Error('Invalid Type: ' + txHash);
    }
  }

  public extractLogDataFromReceipt(_receipt: any, _topic: string) {
    // @TODO: get hash decoding funcions
    // @TODO: make general decode function
  }

}
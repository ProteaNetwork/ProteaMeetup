import { Injectable } from '@angular/core';
import { Connect, SimpleSigner, MNID } from 'uport-connect';
import { JWT } from 'uport';
import { ICredentials } from '../interface/credentials';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProteaUser } from '../interface/user';
import { LocalStorageService } from './local-storage.service';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class UportService {
  private web3: any;
  public network = 0;

  private _name = 'Protea Party V1';
  private _clientId = '2oyGuNMuW1aCoxELjbg5FgqjccZREeHwNzq';
  private _privateKey = 'bc10f80699eef7b564d47373eea7add5cf26de5ffdd20e38b38ed89c0b0f8030';
  private _networkName = 'rinkeby';

  private _userStorageKey = 'proteaCredToken';

  private _user: BehaviorSubject<ProteaUser> = new BehaviorSubject<ProteaUser>(new ProteaUser);
  public readonly user$: Observable<ProteaUser> = this._user.asObservable();


  private uport: any;

  constructor(private localStorageService: LocalStorageService) {
    this.uport = new Connect(this._name, {
      clientId: this._clientId,
      network: this._networkName,
      signer: SimpleSigner(this._privateKey)
    });
    this.uport.address = this._clientId;
    console.log(this.uport)
    const topic = this.uport.topicFactory('access_token');
    const tempa = JWT.verifyJWT(this.uport.credentials.settings,
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1MzEzMDIyNjksImV4cCI6MTUzMjU5ODI2OSwiYXVkIjoiMm95R3VOTXVXMWFDb3hFTGpiZzVGZ3FqY2NaUkVlSHdOenEiLCJ0eXBlIjoibm90aWZpY2F0aW9ucyIsInZhbHVlIjoiYXJuOmF3czpzbnM6dXMtd2VzdC0yOjExMzE5NjIxNjU1ODplbmRwb2ludC9HQ00vdVBvcnQvZDhhODdiMDYtNzAzZi0zODc5LTkyMjEtYzBmYjE5ZTQ0ZWI4IiwiaXNzIjoiMm9ycUtubTZ4bVhaMWNiZkRjTTRiNmR2WWpjYmVianBSVDkifQ.n21FR82ebs5-Zy1Qh2L0emNueEyFzMr0PFNPQmsAtDI1nEPRK5baXpfporB9GvOYvK8jt2JfbnZEFAYPCCLPMg',
    topic.url);
    console.log(tempa);
    // if (this.localStorageService.has(this._userStorageKey)) {
    //   this.parseStorageToken();
    // }
    window.addEventListener('load', (event) => {
      this.web3 = this.uport.getWeb3();
    });
  }

  /**
   * Checks localStorage for a previous login token
   */
  private parseStorageToken() {
    const token = this.localStorageService.get(this._userStorageKey);
    try {

      // Taken from uport-connect/ConnectCore.js Line:136
      const topic = this.uport.topicFactory('access_token');
      const res = this.uport.credentials.receive(token, topic.url);
      if (res && res.pushToken) {
        this.uport.pushToken = res.pushToken;
      }
      this.uport.address = res.address;
      this.uport.publicEncKey = res.publicEncKey;
      this.uport.firstReq = true;
    } catch (error) {
      throw(error);
    }
  }

  /**
   * Returns a contract object based of provided ABI
   * @param artifacts Contract ABI to be converted
   */
  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }
    const contractAbstraction = this.web3.eth.contract(artifacts.abi);
    return contractAbstraction;

  }

  /**
   * Returns current user session address
   */
  public getAddress() {
    console.log('I think its here');
    const temp = this._user.getValue().address;
    console.log('Nope');
    return this._user.getValue().address;
  }

  /**
   * Exposed checker to validate input address syntax
   * @param address string to check if valid eth address
   */
  public isValidAddress(address: string): boolean {
    return this.web3.isAddress(address);
  }

  /**
   * uPort addresses are MNID encode, this provides a network specific address
   * @param _address uPort MNID encoded address to be converted to set network address
   */
  public decodeMNID(_address: string) {
    const decoded = MNID.decode(_address);
    return decoded.address;
  }

  /**
   * Fires the uPort modal with hardcoded request parameters
   */
  public async login() {
    await this.requestCredentials(['name', 'avatar', 'phone']);
  }

  /**
   * Creates a request modal for the user to scan and submit credentials to this app
   * @param _requested Array of required fields to be requested from the user
   * @param _verified Array of attestations to be requested from the user
   */
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
        user.address = this.decodeMNID(credentials.networkAddress);
        user.name = credentials.name;
        user.phone = credentials.phone;
        this.localStorageService.set(this._userStorageKey, credentials.pushToken);
        this._user.next(user);
        resolve();
      });
    });
  }

  /**
   * This checks for when a transaction is mined and returns a reciept at the end
   * @param txHash Transaction hash to query
   * @param interval Time delay between queries
   */
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

  // @TODO: Dislike this approach, need to refactor, issue is circular dependancy to have services do this directly
  /**
   * This is used to update the user object if external related data is updated in the model
   * @param _user new user model to overwrite existing state
   */
  public updateUserObject(_user: ProteaUser) {
    this._user.next(_user);
  }
}

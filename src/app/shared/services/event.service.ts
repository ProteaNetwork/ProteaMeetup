import { Injectable } from '@angular/core';
import { ProteaParty } from '../interface/event';

import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';
import { Observable, BehaviorSubject } from 'rxjs';
import { UportService } from './uport.service';
import { ProteaUser } from '../interface/user';


declare let require: any;
const factoryAbi = require('./../../../../build/contracts/ProteaPartyFactory.json');
const eventAbi = require('./../../../../build/contracts/ProteaParty.json');

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private rinkebyFactoryAddress = '0x68f384b61566ebf74f3c79289eef9c78ad03a457';

  // @TODO: Refactor, using array for displaying event info before fetching
  // Purpose: when the registry is available, this can be used to populate the dashboard
  private _events: BehaviorSubject<ProteaParty[]>;
  public readonly events$: Observable<ProteaParty[]> = this._events.asObservable();

  private _currentEvent: BehaviorSubject<ProteaParty>;
  public readonly currentEvent$: Observable<ProteaParty> = this._currentEvent.asObservable();

  private factoryContract: TruffleContract;
  private eventContract: TruffleContract;

  constructor(private uportService: UportService) {
    this.initFactory();
  }

  private async initFactory() {
    this.uportService.user$.subscribe(async (userObject: ProteaUser) => {
      if (userObject.address !== '') {
        this.factoryContract = await this.uportService.artifactsToContract(factoryAbi);
        this.factoryContract = this.factoryContract.at(this.rinkebyFactoryAddress);
      }
    });
  }

  // Factory/Registry
  public fetchAdminEvents() {
    // @TODO: this will need to be dynamic when registry architecture is up
    return new Promise((resolve, reject) => {
      this.factoryContract.getUserEvents(this.uportService.getAddress, async (_error, _contractArray: string[]) => {
        if (!_contractArray) { reject(_error); }
        // If last requested
        resolve(_contractArray.map((_address: string) => {
          return new ProteaParty({address: _address});
        }));
      });
    });
  }

  public deployEvent(_name: string, _deposit: number, _limit: number, _coolingPeriod: number, _encryption: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.factoryContract.deployParty(_name, _deposit, _limit, _coolingPeriod, _encryption, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        // Run fetch latest
        resolve(result);
        // Transation mined
      });
    });
  }


  // Event functions
  public async fetchEvent(_address: string) {
    // @TODO: need to run a call to confirm the contract before setting
    this.eventContract = await this.uportService.artifactsToContract(eventAbi);
    this.eventContract = this.eventContract.at(_address);
    await this.fetchState();
  }

  private async fetchState() {
    const event = new ProteaParty();
    // Event state
    event.name =  await this.getEventName();
    event.deposit = await this.getDeposit();
    event.address = this.eventContract.address;
    event.limitOfParticipants = await this.getLimit();
    event.registered = await this.getRegistered();
    event.attended = await this.getAttended();
    event.ended = await this.checkEnded();
    event.coolingPeriod = await this.getCoolingPeriod();


    if (event.ended) {
      event.endAt = await this.getCoolingEndPeriod();
      event.payout = await this.getPayout();
    }

    event.cancelled = await this.checkCancelled();

    this._currentEvent.next(event);

  }

  public async fetchUserEventData(_userObject: ProteaUser) {
    // User Event states states
    const user = new ProteaUser(_userObject);
    user.isAdmin = await this.isAdmin();
    user.isRegistered = await this.isRegistered();
    user.isPaid = await this.isPaid();
    user.hasAttended = await this.hasAttended();
    return user;
  }

  // Attendee controls
  public withdraw() {
    return new Promise((resolve, reject) => {
      this.eventContract.withdraw(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  // Get view data
  public getEventName() {
    return new Promise<string>((resolve, reject) => {
      this.eventContract.name((_error, _name) => {
        if (_error) {
          reject(_error);
        }
        resolve(_name.toString());
      });
    });
  }

  public getLimit() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.limitOfParticipants((_error, _limit) => {
        if (_error) {
          reject(_error);
        }
        resolve(_limit.toNumber());
      });
    });
  }

  public getDeposit() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.deposit((_error, _deposit) => {
        if (_error) {
          reject(_error);
        }
        resolve(_deposit.toNumber());
      });
    });
  }

  public getRegistered() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.registered((_error, _registered) => {
        if (_error) {
          reject(_error);
        }
        resolve(_registered.toNumber());
      });
    });
  }

  public getAttended() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.attended((_error, _attended) => {
        if (_error) {
          reject(_error);
        }
        resolve(_attended.toNumber());
      });
    });
  }

  public getCoolingPeriod() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.coolingPeriod((_error, _cooling) => {
        if (_error) {
          reject(_error);
        }
        resolve( _cooling.toNumber());
      });
    });
  }

  public checkEnded() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.ended((_error, _status) => {
        if (_error) {
          reject(_error);
        }
        resolve(_status);
      });
    });
  }

  public checkCancelled() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.cancelled((_error, _status) => {
        if (_error) {
          reject(_error);
        }
        resolve(<boolean>_status.toString());
      });
    });
  }

  public hasAttended() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isAttended(this.uportService.getAddress, (_error, _status) => {
        if (_error) {
          reject(_error);
        }
        resolve(<boolean>_status.toString());
      });
    });
  }

  public isAdmin() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isAdmin(this.uportService.getAddress, (_error, _status) => {
        if (_error) {
          reject(_error);
        }
        resolve(<boolean>_status.toString());
      });
    });
  }

  public isPaid() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isPaid(this.uportService.getAddress, (_error, _status) => {
        if (_error) {
          reject(_error);
        }
        resolve(<boolean>_status.toString());
      });
    });
  }

  public isRegistered() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isRegistered(this.uportService.getAddress, (_error, _status) => {
        if (_error) {
          console.error('isRegistered Error', );
          reject(_error);
        }
        resolve(<boolean>_status.toString());
      });
    });
  }

  public getPayout() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.payout((_error, _payout) => {
        if (_error) {
          reject(_error);
        }
        resolve(_payout.toNumber());
      });
    });
  }

  public getTotalBalance() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.totalBalance((_error, _balance) => {
        if (_error) {
          reject(_error);
        }
        resolve(_balance.toNumber());
      });
    });
  }

  // Admin
  public manualConfirmAttend(_addresses: string[]) {
    return new Promise((resolve, reject) => {
      if (_addresses.length === 0) {
        reject('No addresses added');
      }
      this.eventContract.attend(_addresses, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  public setLimit(_newLimit: number) {
    return new Promise((resolve, reject) => {
      this.eventContract.setLimitOfParticipants(_newLimit, async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  public paybackEnd() {
    return new Promise((resolve, reject) => {
      this.eventContract.payback(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  public cancel() {
    return new Promise((resolve, reject) => {
      this.eventContract.cancel(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  public clear() {
    return new Promise((resolve, reject) => {
      this.eventContract.clear(async (_error, _txHash) => {
        let error, result;
        [error, result] = await to(this.uportService.getTransactionReceiptMined(_txHash));
        if (!result) { reject(error); }
        this.fetchState();
        resolve();
      });
    });
  }

  public async getCoolingEndPeriod() {
    // @TODO: refactor
    let endDate: number;
    const endAt = new Promise((resolve, reject) => {
      this.eventContract.endedAt((_error, _endAt) => {
        if (_error) {
          console.error('Get Payout Error', _error);
          reject(false);
        }
        endDate = _endAt.toNumber();
        resolve();
      });
    });
    await endAt;
    const coolingPeriod = new Promise((resolve, reject) => {
      this.eventContract.coolingPeriod((_error, _coolingPeriod) => {
        if (_error) {
          console.error('Get Payout Error', _coolingPeriod);
          reject(false);
        }
        endDate += _coolingPeriod.toNumber();
        resolve();
      });
    });
    await coolingPeriod;
    return endDate;
  }
}


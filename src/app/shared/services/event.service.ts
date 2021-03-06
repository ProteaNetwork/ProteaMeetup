import { Injectable } from '@angular/core';
import { ProteaMeetup } from '../interface/event';

import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
import { UportService } from './uport.service';
import { ProteaUser } from '../interface/user';


declare let require: any;
const factoryAbi = require('./../../../../build/contracts/ProteaMeetupFactory.json');
const eventAbi = require('./../../../../build/contracts/ProteaMeetup.json');


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private rinkebyFactoryAddress = '0xd7A9db53254A25Af491C10757eb1A8274969552b';

  // @TODO: Refactor, using array for displaying event info before fetching
  // Purpose: when the registry is available, this can be used to populate the dashboard
  private _events: BehaviorSubject<ProteaMeetup[]> = new BehaviorSubject<ProteaMeetup[]>([]);
  public readonly events$: Observable<ProteaMeetup[]> = this._events.asObservable();

  private _currentEvent: BehaviorSubject<ProteaMeetup> = new BehaviorSubject<ProteaMeetup>(new ProteaMeetup());
  public readonly currentEvent$: Observable<ProteaMeetup> = this._currentEvent.asObservable();

  private factoryContract: TruffleContract;
  private eventContract: TruffleContract;

  // TODO: Refactor
  public directEvent: string;

  constructor(private uportService: UportService) {
    this.initFactory();
  }

  private async initFactory() {
    this.factoryContract = await this.uportService.artifactsToContract(factoryAbi);
    this.factoryContract = this.factoryContract.at(this.rinkebyFactoryAddress);
  }

  // @TODO: Need better solution
  public async initWait() {
    if (!this.factoryContract) {
      const delay = new Promise(finish => setTimeout(finish, 100));
      await delay;
      return await this.initWait();
    }
  }

  // Factory/Registry
  public fetchAdminEvents() {
    // @TODO: this will need to be dynamic when registry architecture is up
    // ISSUE: adding duplication when logging out and logging in
    return new Promise(async (resolve, reject) => {
      this.factoryContract.getUserEvents(this.uportService.getAddress(), async (_error, _contractArray: string[]) => {
        if (!_contractArray) { reject(_error); }
        // Clone of current events
        const events = this._events.getValue();

        // Checks
        const checkNew = (_address: string)  => pipe(fetchExisting, isNew);

        const fetchExisting = (_address: string)  => events.findIndex(isFound, _address);

        function isFound(_item: ProteaMeetup) {
          return _item.address === this;
        }

        const isNew = (_index: number) => _index === -1;

        // Updating with fetched
        this._events.next(
          events.concat(_contractArray.filter(checkNew).map(
            (_address: string) => new ProteaMeetup({address: _address})))
        );

        resolve();
      });
    });
  }

  public deployEvent(_name: string, _deposit: number, _limit: number, _coolingPeriod: number, _encryption: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.factoryContract.deployMeetup(_name, _deposit, _limit, _coolingPeriod, _encryption, async (_error, _txHash) => {
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
    const event = new ProteaMeetup();

    event.name =  await this.getEventName();
    event.deposit = await this.getDeposit();
    event.totalBalance = await this.getTotalStake();
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

    this.updateEventEntry(event);
  }

  private updateEventEntry(_event: ProteaMeetup) {
    function isFound(_item: ProteaMeetup) {
      return _item.address === this;
    }
    const events = this._events.getValue();
    this._events.getValue()[events.findIndex(isFound, _event.address)] = _event;
    this._events.next(events);
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

  public getTotalStake() {
    return new Promise<number>((resolve, reject) => {
      this.eventContract.totalBalance((_error, _totalBalance) => {
        if (_error) {
          reject(_error);
        }
        resolve(_totalBalance.toNumber());
      });
    });
  }

  public checkEnded() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.ended((_error, _status: string) => {
        if (_error) {
          reject(_error);
        }
        resolve(JSON.parse(_status));
      });
    });
  }

  public checkCancelled() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.cancelled((_error, _status: string) => {
        if (_error) {
          reject(_error);
        }
        resolve(JSON.parse(_status));
      });
    });
  }

  public hasAttended() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isAttended(this.uportService.getAddress(), (_error, _status: string) => {
        if (_error) {
          reject(_error);
        }
        resolve(JSON.parse(_status));
      });
    });
  }

  public isAdmin() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isAdmin(this.uportService.getAddress(), (_error, _status: string) => {
        if (_error) {
          reject(_error);
        }
        resolve(JSON.parse(_status));
      });
    });
  }

  public isPaid() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isPaid(this.uportService.getAddress(), (_error, _status: string) => {
        if (_error) {
          reject(_error);
        }
        resolve(JSON.parse(_status));
      });
    });
  }

  public isRegistered() {
    return new Promise<boolean>((resolve, reject) => {
      this.eventContract.isRegistered(this.uportService.getAddress(), (_error, _status) => {
        if (_error) {
          console.error('isRegistered Error', );
          reject(_error);
        }
        resolve(JSON.parse(_status));
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


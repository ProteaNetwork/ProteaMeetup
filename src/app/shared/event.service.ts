import { Web3Service } from './web3.service';
import { Injectable } from '@angular/core';

import { default as TruffleContract } from 'truffle-contract';
import to from 'await-to-js';


declare let require: any;
let factoryAbi = require('./../../../build/contracts/ProteaPartyFactory.json');
let eventAbi = require('./../../../build/contracts/ProteaParty.json');

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private rinkebyFactoryAddress = '0x8B594E94BF0464f88C0d741B0feB26375E377EbE';

  // @TODO: change to state object
  public eventReady = false;
  public eventEnded: boolean;

  // Event stats
  public eventName: string;
  public eventDeposit: number;
  public eventLimit: number;
  public eventRegistered: number;
  public eventAttended: number;

  // User states
  public userAdmin: boolean;
  public userRegistered: boolean;
  public userAttended: boolean;
  public userPaid: boolean;

  private factoryContract: TruffleContract;
  private eventContract: TruffleContract;

  constructor(private web3: Web3Service) { }

  private async initFactory() {
    if (this.web3.ready) {
      this.factoryContract = await this.web3.artifactsToContract(factoryAbi);
      this.factoryContract = this.factoryContract.at(this.rinkebyFactoryAddress);
    } else {
      setTimeout(() => {
        this.initFactory();
      }, 200);
    }
  }

  public async fetchEvent(_address: string) {
    // @TODO: need to run a call to confirm the contract before setting
    this.eventContract = await this.web3.artifactsToContract(eventAbi);
    this.eventContract = this.eventContract.at(_address);
    console.log(this.eventContract);
    await this.fetchState();
    return this.eventReady;
  }

  private async fetchState() {
    let clean = true;
    // Event state
    const name = new Promise((resolve, reject) => {
      this.eventContract.name((_error, _name) => {
        if (_error) {
          console.error('ended error', _error);
          clean = false;
          reject(false);
        }
        this.eventName = _name.toString();
        resolve(_name);
      });
    });
    await name;

    const ended = new Promise((resolve, reject) => {
      this.eventContract.ended((_error, _status) => {
        if (_error) {
          console.error('ended error', _error);
          clean = false;
          reject(false);
        }
        this.eventEnded = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await ended;

    const limit = new Promise((resolve, reject) => {
      this.eventContract.limitOfParticipants((_error, _limit) => {
        if (_error) {
          console.error('limitOfParticipants error', _error);
          clean = false;
          reject(false);
        }
        this.eventLimit = _limit.toNumber();
        resolve(_limit);
      });
    });
    await limit;


    const registered = new Promise((resolve, reject) => {
      this.eventContract.registered((_error, _registered) => {
        if (_error) {
          console.error('registered error', _error);
          clean = false;
          reject(false);
        }
        this.eventRegistered = _registered.toNumber();
        resolve(_registered);
      });
    });
    await registered;

    const attended = new Promise((resolve, reject) => {
      this.eventContract.attended((_error, _attended) => {
        if (_error) {
          console.error('attended Error', _error);
          clean = false;
          reject(false);
        }
        this.eventAttended = _attended.toNumber();
        resolve(_attended);
      });
    });
    await attended;

    // User states
    const isAdmin = new Promise((resolve, reject) => {
      this.eventContract.isAdmin(this.web3.address, (_error, _status) => {
      if (_error) {
        console.error('isAdmin Error', _error);
        clean = false;
        reject(false);
      }
      this.userAdmin = <boolean>_status.toString();
      resolve(_status);
    });
    });
    await isAdmin;

    const isRegistered = new Promise((resolve, reject) => {
      this.eventContract.isRegistered(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isRegistered Error', _error);
          clean = false;
          reject(false);
        }
        this.userRegistered = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isRegistered;

    const isPaid = new Promise((resolve, reject) => {
      this.eventContract.isPaid(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isPaid Error', _error);
          clean = false;
          reject(false);
        }
        this.userPaid = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isPaid;

    const isAttended = new Promise((resolve, reject) => {
      this.eventContract.isAttended(this.web3.address, (_error, _status) => {
        if (_error) {
          console.error('isAttended Error', _error);
          clean = false;
          reject(false);
        }
        this.userAttended = <boolean>_status.toString();
        resolve(_status);
      });
    });
    await isAttended;

    this.eventReady = clean;
  }
}


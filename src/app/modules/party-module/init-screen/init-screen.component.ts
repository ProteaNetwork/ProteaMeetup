import { Web3Service } from './../../../shared/web3.service';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-init-screen',
  templateUrl: './init-screen.component.html',
  styleUrls: ['./init-screen.component.scss']
})
export class InitScreenComponent {

  @Output() selection = new EventEmitter<string>();

  constructor(private web3: Web3Service) { }

  public fetch() {
    this.selection.emit('fetch');
  }

  public create() {
    this.selection.emit('create');
  }
}

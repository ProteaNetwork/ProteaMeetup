import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-init-screen',
  templateUrl: './init-screen.component.html',
  styleUrls: ['./init-screen.component.scss']
})
export class InitScreenComponent {

  @Output() selection = new EventEmitter<string>();

  constructor() { }

  public fetch() {
    this.selection.emit('fetch');
  }

  public create() {
    this.selection.emit('create');
  }
}

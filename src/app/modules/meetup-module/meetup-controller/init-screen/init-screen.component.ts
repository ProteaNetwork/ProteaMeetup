import { EventState } from '../../enum/event-state.enum';
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
    this.selection.emit(EventState.FETCH);
  }

  public create() {
    this.selection.emit(EventState.CREATE);
  }
}

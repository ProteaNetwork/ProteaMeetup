import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() publishContract = new EventEmitter<object>();

  public eventData = {
    name: '',
    limit: 0,
    deposit: 0,
    cooldown: 0
  };

  constructor() { }

  ngOnInit() {
  }

  deployContract() {
    // @TODO need to update to unix time stamps
    if (this.eventData.deposit > 0 && this.eventData.cooldown > 0 && this.eventData.cooldown) {
      this.publishContract.emit(this.eventData);
    }
  }
}

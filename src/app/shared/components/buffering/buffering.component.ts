import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buffering',
  templateUrl: './buffering.component.html',
  styleUrls: ['./buffering.component.scss']
})
export class BufferingComponent implements OnInit {

  @Input() active: boolean;
  constructor() { }

  ngOnInit() {
  }

}

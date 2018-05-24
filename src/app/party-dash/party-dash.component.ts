import { Component } from '@angular/core';

@Component({
  selector: 'app-party-dash',
  templateUrl: './party-dash.component.html',
  styleUrls: ['./party-dash.component.scss']
})
export class PartyDashComponent {
  cards = [
    { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../shared/services/event.service';

@Component({
  selector: 'app-direct-link',
  templateUrl: './direct-link.component.html',
  styleUrls: ['./direct-link.component.scss']
})
export class DirectLinkComponent implements OnInit {

  constructor(private router: Router , private route: ActivatedRoute, private _eventService: EventService) {
    this._eventService.directEvent = this.route.snapshot.params.address;
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}

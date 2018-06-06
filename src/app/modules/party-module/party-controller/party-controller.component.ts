import { Web3Service } from './../../../shared/web3.service';
import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Type } from '@angular/compiler/src/core';

@Component({
  selector: 'app-party-controller',
  templateUrl: './party-controller.component.html',
  styleUrls: ['./party-controller.component.scss']
})
export class PartyControllerComponent implements OnInit {
  private address: string;

  private state = 'init';

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef, private web3: Web3Service) { }

  ngOnInit() {
  }


  private renderScreen(component: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}

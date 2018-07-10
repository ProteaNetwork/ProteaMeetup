import { LocalStorageService } from './services/local-storage.service';
import { TokenService } from './services/token.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { UportService } from './services/uport.service';
import { FormsModule } from '@angular/forms';
import { EventService } from './services/event.service';
import { CacheService } from './services/cache.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  providers: [ TokenService, UportService, EventService, CacheService, LocalStorageService ],
  declarations: [  ],
  exports: [ MaterialModule, FormsModule]
})
export class SharedModule { }

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
@Injectable({providedIn : 'root'})

export class UtilitiesService{

  documentClickedSubject = new Subject<EventTarget>()
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() message !: string
  @Input() title !: string
  @Output() closeClicked = new EventEmitter<void>()

  matchDataErrorSub !: Subscription

  onCloseClicked() {
    this.closeClicked.emit()
  }
}

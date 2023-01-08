import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { NextMatch } from '../next-match.model'
import { MatchDataService } from '../services/match-data.service'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { Order } from '../order.model'

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit, OnDestroy {

  constructor(private MatchDataService: MatchDataService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.matchData = this.route.snapshot.data['matches']

    this.matchDataSub = this.MatchDataService.matchDataSubject.subscribe((data) => {

      this.itemJustAdded = data.length > this.matchData.length
      this.matchData = data
    })
  }

  ngOnDestroy(): void {
    this.matchDataSub.unsubscribe()
  }

  matchDataSub !: Subscription
  matchData !: NextMatch[]
  itemJustAdded = false
  sortOrder: Order = 'desc'

  moveMatchOnList(event: CdkDragDrop<string[]>) {

    this.MatchDataService.setCustomMatchesOrder(event)
  }

  sortMatches() {

    this.MatchDataService.sortMatches(this.sortOrder)
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
  }
}

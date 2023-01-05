import { Component, OnInit, Input } from '@angular/core';
import { NextMatch } from '../next-match.model';
import { MatchDataService } from '../services/match-data.service';
import * as matchAnimations from './match-list-item.animations'

@Component({
  selector: 'app-match-list-item',
  templateUrl: './match-list-item.component.html',
  styleUrls: ['./match-list-item.component.css'],
   animations: [matchAnimations.fadeIn]
})
export class MatchListItemComponent implements OnInit {

   constructor(private MatchDataService: MatchDataService) { }

  ngOnInit(): void {

    this.followedTeamSide = this.match.awayTeam.id === this.match.followedTeamId ? 'awayTeam' : 'homeTeam'
    this.opponentTeamSide = this.followedTeamSide === 'awayTeam' ? 'homeTeam' : 'awayTeam'
    this.matchDateFormatted =  this.formatMatchDate(this.match.utcDate)

    if (this.animatedEntrance) this.matchContainerState = 'visible'
  }

  @Input() match !: NextMatch
  @Input() animatedEntrance !: boolean

  followedTeamSide !: 'awayTeam' | 'homeTeam'
  opponentTeamSide !: 'awayTeam' | 'homeTeam'
  matchContainerState !: string
  matchDateFormatted !: {date: string, time: string}

  formatMatchDate(utcDate: string){

    const [date, time] =  new Date(utcDate).toLocaleString().split(',')
    return {date, time : time.substring(0, 6)}
  }

  deleteMatch(){
    this.MatchDataService.deleteTeam(this.match.followedTeamId)
  }

}

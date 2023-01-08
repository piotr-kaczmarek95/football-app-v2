import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { teams } from '../teamsIds'
import { NgForm } from '@angular/forms'
import { MatchDataService } from '../services/match-data.service'
import { UtilitiesService } from '../services/app-utilities.service'
import { debounceTime, from, fromEvent, Subscription } from 'rxjs'
import { Order } from '../order.model'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private MatchDataService: MatchDataService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {

    this.outsideClickSub = this.utilitiesService.documentClickedSubject.subscribe((target) => {
      this.checkIfClickedOutside(target)
    })

    this.searchErrorSub = this.MatchDataService.matchDataErrorSubject.subscribe((error) => {
      this.searchErrorText = error.message
      this.showSearchErrorAlert = true
    })
  }

  ngOnDestroy(): void {

    this.outsideClickSub.unsubscribe()
    this.searchErrorSub.unsubscribe()
    this.inputKeyupSub.unsubscribe()
  }

  ngAfterViewInit(): void {

    this.inputKeyupSub = fromEvent(this.teamNameInput.nativeElement, 'keyup').pipe(debounceTime(300)).subscribe(() => {
      if (this.teamNameInput.nativeElement.value.length > 3) this.searchTeam()
    })
  }

  @ViewChild('teamNameForm') teamNameForm !: NgForm
  @ViewChild('searchResults') searchResults !: ElementRef
  @ViewChild('searchButton') searchButton !: ElementRef
  @ViewChild('teamName') teamNameInput !: ElementRef

  outsideClickSub !: Subscription
  searchErrorSub !: Subscription
  inputKeyupSub !: Subscription

  matchingTeams: { id: number, name: string }[] = [];
  showNoMatchingTeamsAlert = false
  showSearchErrorAlert = false
  searchErrorText = ''

  checkIfClickedOutside(target: EventTarget) {

    if (!this.searchButton.nativeElement.contains(target) && !this.searchResults.nativeElement.contains(target)) {

      this.clearSuggestions()
      this.outsideClickSub.unsubscribe()
    }
  }

  clearSuggestions() {

    if (this.matchingTeams.length > 0) this.matchingTeams.length = 0
    if (this.showNoMatchingTeamsAlert) this.showNoMatchingTeamsAlert = false
  }

  searchTeam() {

    const enteredTeam = this.teamNameForm.form.value.teamName.toLowerCase()
    this.matchingTeams = teams.filter(team => team.name.toLowerCase().includes(enteredTeam))

    if (this.matchingTeams.length === 0) this.showNoMatchingTeamsAlert = true

    if (this.outsideClickSub.closed) {

      this.outsideClickSub = this.utilitiesService.documentClickedSubject.subscribe((target) => {
        this.checkIfClickedOutside(target)
      })
    }
  }

  getDataForSingleTeam(teamId: number) {

    this.matchingTeams.length = 0
    const alreadyAdded = this.MatchDataService.checkIfTeamAlreadyAdded(teamId)

    if (!alreadyAdded) {

      this.MatchDataService.getDataForSingleTeam(teamId)

    } else {
      this.searchErrorText = 'Team already added'
      this.showSearchErrorAlert = true
    }
  }

  onAlertCloseClicked() {
    this.showSearchErrorAlert = false
  }
}

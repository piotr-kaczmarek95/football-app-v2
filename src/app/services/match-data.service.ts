import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Observable, Subject, of } from 'rxjs'
import { NextMatch } from '../next-match.model'
import { NextMatchFullData } from '../next-match.model'
import { map, forkJoin, tap, pipe, catchError } from 'rxjs'
import { Order } from '../order.model'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'


@Injectable({ providedIn: 'root' })

export class MatchDataService {

  constructor(private http: HttpClient) { }

  matchDataSubject = new Subject<NextMatch[]>()
  matchDataErrorSubject = new Subject<Error>()

  private getSavedMatchesData(): NextMatch[] {
    const savedMatches = localStorage.getItem('matches')
    return savedMatches ? JSON.parse(savedMatches) : []
  }

  getDataForAllTeams() {

    const savedMatches = this.getSavedMatchesData()

    if (!savedMatches.length) return []

    const savedMatchesIds = savedMatches.map(match => match.followedTeamId)
    const requests: Observable<NextMatchFullData>[] = []
    const currentDate = new Date()

    savedMatches.forEach((match: NextMatch) => {

      if (currentDate > new Date(match.utcDate)) {

        console.log(`### Team: ${match.followedTeamId}, source: api`)

        requests.push(this.http.get<NextMatchFullData>(`https://api.football-data.org/v2/teams/${match.followedTeamId}/matches`, {
          params: new HttpParams().set('status', 'SCHEDULED')
        }))

      } else {

        console.log(`### Team: ${match.followedTeamId}, source: saved data`)
        requests.push(of({ matches: [match] }))
      }
    })

    return forkJoin(requests)
      .pipe(
        map((data) => {
          return data.map((itm) => itm.matches[0])
        }),
        map((data) => {
          return data.map((match, idx) => {
            return {
              awayTeam: {
                crest: match.awayTeam.crest,
                name: match.awayTeam.name,
                id: match.awayTeam.id,
              },
              homeTeam: {
                crest: match.homeTeam.crest,
                name: match.homeTeam.name,
                id: match.homeTeam.id,
              },
              competition: {
                name: match.competition.name,
              },
              utcDate: match.utcDate,
              matchday: match.matchday,
              followedTeamId: savedMatchesIds[idx]
            }
          })
        }),
        tap((matches: NextMatch[]) => {
          localStorage.setItem('matches', JSON.stringify(matches))
        }),
        map((matches: NextMatch[]) => {
          return matches
        })
      )
  }

  getDataForSingleTeam(teamId: number) {

    return this.http
      .get<NextMatchFullData>(`https://api.football-data.org/v2/teams/${teamId}/matches`, {

        params: new HttpParams().set('status', 'SCHEDULED'),
      })
      .pipe(
        catchError((errorRes: HttpErrorResponse) => {
          console.warn(errorRes)
          let errorMessage: string

          switch (errorRes.statusText) {
            case 'Forbidden':
              errorMessage = "Data for a selected team is unavailable."
              break
            case 'Too Many Requests':
              errorMessage = "Service temporarily unavailable. Please try again later."
              break
            default:
              errorMessage = "An error occured."
          }

          throw Error(errorMessage)

        }),
        tap((data) => {

          if (data.matches.length === 0) throw Error("Data for a selected team is unavailable")
        }),
        map((data) => data.matches.sort((a, b) => {
          if (a.utcDate === b.utcDate) return 0
          return new Date(a.utcDate) > new Date(b.utcDate) ? 1 : -1
        })[0]),
        map((match) => {
          return {
            awayTeam: {
              crest: `https://crests.football-data.org/${match.awayTeam.id}.svg`,
              name: match.awayTeam.name,
              id: match.awayTeam.id,
            },
            homeTeam: {
              crest: `https://crests.football-data.org/${match.homeTeam.id}.svg`,
              name: match.homeTeam.name,
              id: match.homeTeam.id,
            },
            competition: {
              name: match.competition.name,
            },
            utcDate: match.utcDate,
            matchday: match.matchday,
            followedTeamId: teamId
          }
        })
      )
      .subscribe({
        next: (match: NextMatch) => {

          const matches = this.getSavedMatchesData()
          matches.unshift(match)

          this.matchDataSubject.next(matches)
          localStorage.setItem('matches', JSON.stringify(matches))
        },
        error: (error: Error) => {
          this.matchDataErrorSubject.next(error)
        }
      })
  }

  deleteTeam(id: number) {

    const savedMatches = this.getSavedMatchesData()

    if (!savedMatches.length) return

    const index = savedMatches.findIndex(match => match.followedTeamId === id)
    savedMatches.splice(index, 1)

    this.matchDataSubject.next(savedMatches)
    localStorage.setItem('matches', JSON.stringify(savedMatches))
  }

  sortMatches(sortOrder: Order) {

    const matches = this.getSavedMatchesData()

    if (!matches.length) return

    matches.sort((a, b) => {

      if (a.utcDate === b.utcDate) return 0

      if (sortOrder === 'asc') {
        return new Date(a.utcDate) > new Date(b.utcDate) ? 1 : -1
      } else {
        return new Date(a.utcDate) < new Date(b.utcDate) ? 1 : -1
      }
    })

    this.matchDataSubject.next(matches)
    localStorage.setItem('matches', JSON.stringify(matches))
  }

  setCustomMatchesOrder(event: CdkDragDrop<string[]>) {

    const matches = this.getSavedMatchesData()
    moveItemInArray(matches, event.previousIndex, event.currentIndex)
    this.matchDataSubject.next(matches)
    localStorage.setItem('matches', JSON.stringify(matches))
  }

  checkIfTeamAlreadyAdded(id: number) {
    return this.getSavedMatchesData().some(match => match.followedTeamId === id)
  }
}

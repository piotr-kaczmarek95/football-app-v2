import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NextMatch } from '../next-match.model';
import { MatchDataService } from './match-data.service';

@Injectable({
  providedIn: 'root',
})
export class MatchDataResolver implements Resolve<NextMatch[]> {
  constructor(private matchDataService: MatchDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): NextMatch[] | Observable<NextMatch[]> | Promise<NextMatch[]> {
    return this.matchDataService.getDataForAllTeams()
  }
}

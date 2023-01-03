import { Component } from '@angular/core'
import { UtilitiesService } from './services/app-utilities.service'
import { HostListener } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private utilitiesService: UtilitiesService) { }
  title = 'football-app';

  @HostListener('document:click', ['$event']) documentClick(event: PointerEvent) {

    if (event.target !== null) this.utilitiesService.documentClickedSubject.next(event.target)
  }
}

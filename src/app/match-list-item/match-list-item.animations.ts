import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
export const fadeIn = trigger('matchContainerState', [
  state('visible', style({
    opacity : 1
  })),
  transition('void => visible', [
    style({
      opacity: 0
    }),
    animate(500, keyframes([
      style({
        offset: 0,
        opacity: 0
      }),
      style({
        offset: 0.4,
        opacity: 0
      }),
      style({
        offset: 0.7,
        opacity: 0.5
      })
    ]))
  ]),
])

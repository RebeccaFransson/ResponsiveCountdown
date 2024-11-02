import { Component } from '@angular/core'
import { fromEvent } from 'rxjs'

@Component({
  selector: 'avatar-on-mouse-move',
  standalone: true,
  templateUrl: './avatar-on-mouse-move.component.html',
  styleUrls: ['./avatar-on-mouse-move.component.scss'],
})
export class AvatarOnMouseMoveComponent {
  ngOnInit() {
    fromEvent<MouseEvent>(window, 'mousemove').subscribe((e: MouseEvent) => {
      const image = document.getElementById('emojiImage')
      if (image) {
        const y = e.clientY
        let pxToMove = -y / 7
        if (pxToMove < -123) pxToMove = -123
        image.style.bottom = `${pxToMove - 10}px`
      }
    })
  }
}

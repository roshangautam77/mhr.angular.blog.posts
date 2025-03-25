import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * LikeDislikeComponent
 * 
 * This component provides like and dislike functionality.
 * It accepts an initial like count as input and emits events when a like or dislike action is triggered.
 */

@Component({
  selector: 'app-like-dislike',
  templateUrl: 'like-dislike.component.html',
  styleUrls: ['like-dislike.component.scss'],
})
export class LikeDislikeComponent {
  @Input() likeCount: number = 0;
  @Output() like = new EventEmitter<void>();
  @Output() dislike = new EventEmitter<void>();

  onLike() {
    this.like.emit();
  }

  onDislike() {
    this.dislike.emit();
  }
}
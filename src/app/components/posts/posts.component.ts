import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts/posts.service';
import { IPost } from '../../services/posts/interfaces/post.interface';
import { LikeDislikeComponent } from '../like-dislike/like-dislike.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  imports: [CommonModule, LikeDislikeComponent]
})
export class PostsComponent {
  public posts = signal<IPost[]>([]);
  private postsService = inject(PostsService);
  
  ngOnInit() {
    this.postsService.getPosts().subscribe(data => this.posts.set(data));
  }

  // Method to update the like count
  onLike(post: IPost) {
    this.postsService.updatePost(post.id, post.likeCount + 1).subscribe((updatedPost) => {
      this.updatePosts(updatedPost);
    });
  }

  // Method to update the dislike count
  onDislike(post: IPost): void {
    if (post.likeCount > 0) {
      this.postsService.updatePost(post.id, post.likeCount - 1).subscribe((updatedPost) => {
        this.updatePosts(updatedPost);
      });
    }
  }

  private updatePosts(updatedPost: IPost): void {
    this.posts.update((currentPosts) =>
      currentPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }
}
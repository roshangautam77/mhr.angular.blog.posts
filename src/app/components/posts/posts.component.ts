import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts/posts.service';
import { IPost } from '../../services/posts/interfaces/post.interface';
import { LikeDislikeComponent } from '../like-dislike/like-dislike.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  imports: [CommonModule, LikeDislikeComponent]
})
export class PostsComponent implements OnInit {
  posts: IPost[] = [];

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onLike(post: IPost): void {
    post.likeCount++;
  }

  onDislike(post: IPost): void {
    if (post.likeCount > 0) {
      post.likeCount--;
    }
  }
}
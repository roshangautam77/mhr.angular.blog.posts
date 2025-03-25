import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostsComponent } from './posts.component';
import { PostsService } from '../../services/posts/posts.service';
import { IPost } from '../../services/posts/interfaces/post.interface';
import { LikeDislikeComponent } from '../like-dislike/like-dislike.component';
import { CommonModule } from '@angular/common';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postsServiceMock: any;

  const mockPosts: IPost[] = [
    { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 2 },
    { id: "2", title: 'Post 2', content: 'Content 2', likeCount: 5 }
  ];

  beforeEach(async () => {
    postsServiceMock = {
      getPosts: jasmine.createSpy('getPosts').and.returnValue(of(mockPosts))
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, LikeDislikeComponent, PostsComponent],
      providers: [{ provide: PostsService, useValue: postsServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit
    expect(component.posts.length).toBe(2);
    expect(component.posts).toEqual(mockPosts);
    expect(postsServiceMock.getPosts).toHaveBeenCalled();
  });

  it('should increase like count when onLike is called', () => {
    const post = { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 2 };
    component.onLike(post);
    expect(post.likeCount).toBe(3);
  });

  it('should decrease like count when onDislike is called (if > 0)', () => {
    const post = { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 2 };
    component.onDislike(post);
    expect(post.likeCount).toBe(1);
  });

  it('should not decrease like count below 0', () => {
    const post = { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 0 };
    component.onDislike(post);
    expect(post.likeCount).toBe(0);
  });
});
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostsService } from '../../services/posts/posts.service';
import { of } from 'rxjs';
import { IPost } from '../../services/posts/interfaces/post.interface';
import { LikeDislikeComponent } from '../like-dislike/like-dislike.component';
import { CommonModule } from '@angular/common';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postsService: jasmine.SpyObj<PostsService>;

  const mockPosts: IPost[] = [
    { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 5 },
    { id: "2", title: 'Post 2', content: 'Content 2', likeCount: 3 }
  ];

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', [
      'getPosts',
      'updatePost'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, PostsComponent, LikeDislikeComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load posts on initialization', fakeAsync(() => {
      postsService.getPosts.and.returnValue(of(mockPosts));
      
      fixture.detectChanges(); // Triggers ngOnInit
      tick(); // Wait for async operations
      
      expect(postsService.getPosts).toHaveBeenCalled();
      expect(component.posts()).toEqual(mockPosts);
    }));

    it('should handle empty posts response', fakeAsync(() => {
      postsService.getPosts.and.returnValue(of([]));
      
      fixture.detectChanges();
      tick();
      
      expect(component.posts()).toEqual([]);
    }));
  });

  describe('onLike', () => {
    it('should increase like count and update posts', fakeAsync(() => {
      const testPost = mockPosts[0];
      const updatedPost = { ...testPost, likeCount: testPost.likeCount + 1 };
      
      postsService.getPosts.and.returnValue(of(mockPosts));
      postsService.updatePost.and.returnValue(of(updatedPost));
      
      fixture.detectChanges();
      tick();
      
      component.onLike(testPost);
      tick();
      
      expect(postsService.updatePost).toHaveBeenCalledWith(testPost.id, testPost.likeCount + 1);
      expect(component.posts()[0].likeCount).toBe(updatedPost.likeCount);
    }));
  });

  describe('onDislike', () => {
    it('should decrease like count when likeCount > 0', fakeAsync(() => {
      const testPost = mockPosts[0];
      const updatedPost = { ...testPost, likeCount: testPost.likeCount - 1 };
      
      postsService.getPosts.and.returnValue(of(mockPosts));
      postsService.updatePost.and.returnValue(of(updatedPost));
      
      fixture.detectChanges();
      tick();
      
      component.onDislike(testPost);
      tick();
      
      expect(postsService.updatePost).toHaveBeenCalledWith(testPost.id, testPost.likeCount - 1);
      expect(component.posts()[0].likeCount).toBe(updatedPost.likeCount);
    }));

    it('should not decrease like count when likeCount is 0', fakeAsync(() => {
      const testPost = { ...mockPosts[0], likeCount: 0 };
      component.posts.set([testPost]);
      
      component.onDislike(testPost);
      
      expect(postsService.updatePost).not.toHaveBeenCalled();
    }));
  });

  describe('updatePosts', () => {
    it('should update posts array when onLike is called', fakeAsync(() => {
      const testPost = mockPosts[0];
      const updatedPost = { ...testPost, likeCount: testPost.likeCount + 1 };
      
      postsService.updatePost.and.returnValue(of(updatedPost));
      component.posts.set(mockPosts); // Initialize signal
      
      component.onLike(testPost); // Calls private updatePosts internally
      tick();
      
      expect(component.posts()[0].likeCount).toBe(updatedPost.likeCount);
    }));
    

    it('should not modify posts array when updating non-existent post via onLike', fakeAsync(() => {
      // Arrange
      component.posts.set([...mockPosts]);
      const nonExistentPost = { id: "99", title: 'New', content: 'New', likeCount: 1 };
      
      // Mock the service to return the non-existent post (unchanged)
      postsService.updatePost.and.returnValue(of(nonExistentPost));
      
      // Act - Trigger like action
      component.onLike(nonExistentPost);
      tick();
      
      // Assert - Verify posts array remains unchanged
      expect(component.posts()).toEqual(mockPosts);
    }));
    
    
  });
});

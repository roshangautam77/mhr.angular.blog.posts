import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { IPost } from './interfaces/post.interface';

describe('PostsService', () => {
    let service: PostsService;
    let httpMock: HttpTestingController;

    const mockPosts: IPost[] = [
        { id: "1", title: 'Post 1', content: 'Content 1', likeCount: 10 },
        { id: "2", title: 'Post 2', content: 'Content 2', likeCount: 5 },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PostsService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(PostsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch posts from the API', () => {
        service.getPosts().subscribe((posts) => {
            expect(posts).toEqual(mockPosts);
            expect(posts.length).toBe(2);
        });

        const req = httpMock.expectOne('http://localhost:3000/posts');
        expect(req.request.method).toBe('GET');

        req.flush(mockPosts); // Respond with mock data
    });

    it('should handle an empty post response', () => {
        service.getPosts().subscribe((posts) => {
            expect(posts).toEqual([]);
            expect(posts.length).toBe(0);
        });

        const req = httpMock.expectOne('http://localhost:3000/posts');
        req.flush([]); // Empty response
    });

    it('should handle an error response', () => {
        service.getPosts().subscribe({
            next: () => fail('Should have failed with an error'),
            error: (error) => {
                expect(error.status).toBe(500);
            },
        });

        const req = httpMock.expectOne('http://localhost:3000/posts');
        req.flush('Error fetching posts', { status: 500, statusText: 'Server Error' });
    });
    it('should update a post and return the updated post', () => {
        const postId = '1';
        const likeCount = 10;
        const updatedPost: IPost = {
          id: postId,
          title: 'Updated Post',
          content: 'Updated content',
          likeCount: likeCount
        };
    
        // Call the service method
        service.updatePost(postId, likeCount).subscribe(response => {
          expect(response).toEqual(updatedPost); // Assert that the response matches the updatedPost
        });
    
        // Mock the HTTP request
        const req = httpMock.expectOne(`${service['BASE_URL']}/posts/${postId}`);
        expect(req.request.method).toBe('PATCH'); // Ensure the HTTP method is PATCH
        expect(req.request.body).toEqual({ likeCount }); // Assert the request body is correct
    
        // Respond with the mock data
        req.flush(updatedPost); // Mock the response with the updated post data
      });
});
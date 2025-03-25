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
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeDislikeComponent } from './like-dislike.component';
import { By } from '@angular/platform-browser';

describe('LikeDislikeComponent', () => {
  let component: LikeDislikeComponent;
  let fixture: ComponentFixture<LikeDislikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikeDislikeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeDislikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize likeCount to 0 by default', () => {
    expect(component.likeCount).toBe(0);
  });

  it('should emit like event when onLike() is called', () => {
    spyOn(component.like, 'emit');

    component.onLike();

    expect(component.like.emit).toHaveBeenCalled();
  });

  it('should emit dislike event when onDislike() is called', () => {
    spyOn(component.dislike, 'emit');

    component.onDislike();

    expect(component.dislike.emit).toHaveBeenCalled();
  });

  it('should call onLike() when the like button is clicked', () => {
    spyOn(component, 'onLike');

    const likeButton = fixture.debugElement.query(By.css('.like-btn'));
    likeButton.triggerEventHandler('click', null);
    
    expect(component.onLike).toHaveBeenCalled();
  });

  it('should call onDislike() when the dislike button is clicked', () => {
    spyOn(component, 'onDislike');

    const dislikeButton = fixture.debugElement.query(By.css('.dislike-btn'));
    dislikeButton.triggerEventHandler('click', null);
    
    expect(component.onDislike).toHaveBeenCalled();
  });
});
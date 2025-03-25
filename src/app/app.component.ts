import { Component } from '@angular/core';
import { PostsComponent } from './components/posts/posts.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [PostsComponent]
})
export class AppComponent {
  title = 'angular-take-home-test';
}

import { Component } from '@angular/core';
import { QuestionBase } from '../classes';
import { Observable } from 'rxjs';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [QuestionService]
})

export class TestComponent {
  questions$: Observable<QuestionBase[]>;

  constructor(service: QuestionService) {
    this.questions$ = service.getQuestions([], true);
  }

}

import { Component, OnInit } from '@angular/core';
import { TypeNewService } from '../../services/type-new.service';
import { Observable } from 'rxjs';
import { TemplateData, TemplateTypeNew } from '../../interfaces';
import { QuestionBase } from '../classes';
import { QuestionService } from '../services/question.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ControlService } from '../services/control.service';

@Component({
  selector: 'app-format-generator',
  templateUrl: './format-generator.component.html',
  styleUrls: ['./format-generator.component.css'],
  providers: [QuestionService, ControlService]
})
export class FormatGeneratorComponent implements OnInit {
  data: TemplateData[] = [];
  template: TemplateTypeNew[] = [];
  questions$: Observable<QuestionBase<any>[]>;
  generating_preview: boolean = false;
  constructor(private typeNewService: TypeNewService, private service: QuestionService) {
    this.questions$ = this.service.generatePreviewQuentions(this.template);
  }

  generatePreview() {
    this.questions$ = this.service.generatePreviewQuentions(this.template);
    this.generating_preview = false
  }

  ngOnInit(): void {
    this.typeNewService.getCodesTemplate().subscribe((data: any) => {
      data.forEach((d: string[]) => {
        this.data.push(
          {
            "code": d[0],
            "code_display": d[1]
          }
        );
      })

    });
  }


  drop(event: CdkDragDrop<string[]>) {
    this.generating_preview = true
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.generatePreview();
  }

}

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../../app/services/template.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TemplateModel } from '../../../app/models/templates/templateModel';
import { Base64Service } from '../../../app/services/base64-service.service';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css',
})
@Inject('TemplateService')
@Inject('Base64Service')
export class TemplateListComponent implements OnInit {
  private readonly router = inject(Router);

  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;

  templateService = new TemplateService();

  base64Service: Base64Service = new Base64Service();

  templates: TemplateModel[] = [];
  selectedIndex: number | null = null;
  showModalToRenderHTML: boolean = false;

  ngOnInit(): void {
    this.getEmailTemplates();
  }

  getEmailTemplates() {
    this.templateService.getAllTemplates().subscribe((data) => {
      this.templates = data;

    });
  }

  public async editEmailTemplate(index: number): Promise<void> {
    this.router.navigate(['/template/change', this.templates[index].id]);
  }

  previewContent(index: number): void {
    this.showModalToRenderHTML = true;
    this.selectedIndex = index;

    setTimeout(() => {
      const iframe = this.iframePreview.nativeElement as HTMLIFrameElement;
      iframe.srcdoc = this.templates[index].body;

      iframe.onload = () => {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDocument) {
          const height = iframeDocument.documentElement.scrollHeight;
          iframe.style.height = `${height}px`;
        }
      };
    }, 5);
  }

  closeModalToRenderHTML(): void {
    this.showModalToRenderHTML = false;
  }
}

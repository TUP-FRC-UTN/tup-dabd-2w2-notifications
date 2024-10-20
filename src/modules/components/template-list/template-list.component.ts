import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TemplateModelResponse } from '../../../app/models/templateModelResponse';
import { Base64Service } from '../../../app/services/base64-service.service';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css',
})
@Inject('EmailServiceService')
@Inject('Base64Service')
export class TemplateListComponent implements OnInit {
  private readonly router = inject(Router);

  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;

  emailService = new EmailServiceService();

  base64Service: Base64Service = new Base64Service();

  templates: TemplateModelResponse[] = [];
  selectedIndex: number | null = null;
  showModalToRenderHTML: boolean = false;

  ngOnInit(): void {
    this.getEmailTemplates();
  }

  getEmailTemplates() {
    this.emailService.getEmailTemplates().subscribe((data) => {
      this.templates = data;

      this.templates.forEach((x, index) => {
        this.templates[index].base64body = this.base64Service.decodeFromBase64(
          x.base64body
        );
      });
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
      iframe.srcdoc = this.templates[index].base64body;

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

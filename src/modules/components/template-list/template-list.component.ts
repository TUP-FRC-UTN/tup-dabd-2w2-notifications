import { Component, OnInit, Inject, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailServiceService } from '../../../app/services/email-service.service'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})


@Inject('EmailServiceService')
export class TemplateListComponent implements OnInit {


  private readonly router = inject(Router)

  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;

  emailService = new EmailServiceService();


  templates: any[] = [];
  selectedIndex: number | null = null;
  showModalToRenderHTML: boolean = false;


  ngOnInit(): void {

    this.getEmailTemplates();
  }


  public async getEmailTemplates(): Promise<void> {

    this.templates = await this.emailService.getEmailTemplates();

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
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
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

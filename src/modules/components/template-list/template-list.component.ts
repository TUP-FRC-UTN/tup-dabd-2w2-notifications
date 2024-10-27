import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailServiceService } from '../../../app/services/email-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TemplateModelResponse } from '../../../app/models/templateModelResponse';
import { Base64Service } from '../../../app/services/base64-service.service';
import { NgbPagination, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MainContainerComponent } from 'ngx-dabd-grupo01';
import { ToastService } from 'ngx-dabd-grupo01';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    NgbPagination,
    NgbDropdownModule,
    MainContainerComponent],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css',
})
@Inject('EmailServiceService')
@Inject('Base64Service')
export class TemplateListComponent implements OnInit {

  private router = inject(Router);
  private toastService = inject(ToastService);


  emailService = new EmailServiceService();

  base64Service: Base64Service = new Base64Service();


  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;


  templates: TemplateModelResponse[] = [{ id: '0', name: 'template 1', body: `HOLA`, active: true },{ id: '0', name: 'template 1', body: `HOLA`, active: true },{ id: '0', name: 'template 1', body: `HOLA`, active: true }];
  selectedIndex: number | null = null;
  showModalToRenderHTML: boolean = false;

  ngOnInit(): void {
    this.getEmailTemplates();
  }


  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  sizeOptions: number[] = [10, 25, 50];

  // Filtros
  searchTerm = '';
  isActivetemplateFilter: boolean | undefined = true;
  selectedtemplateType: string = '';

  // Estados de modales
  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  modalTitle = '';
  modalMessage = '';
  isDetailModalOpen = false;
  selectedTemplate: TemplateModelResponse | null = null;

  // Referencias
  @ViewChild('editForm') editForm!: NgForm;
  templateToDelete: TemplateModelResponse | null = null;
  editingtemplate: TemplateModelResponse = this.getEmptytemplate();

  //Estado de filtors
  showInput: boolean = false;

  constructor() {
    this.initializePagination();
  }

  private getEmptytemplate(): TemplateModelResponse {
    return {
      id: '',
      name: '',
      body: '',
      active: true,
    };
  }

  filterByStatus(status: 'all' | 'active' | 'inactive') {
    if (status === 'all') {
      this.isActivetemplateFilter = undefined;
    }
    else if (status === 'active') {
      this.isActivetemplateFilter = true;
    }
    else if (status === 'inactive') {
      this.isActivetemplateFilter = false;
    }
    this.getEmailTemplates();
  }
  filterByName() {
    this.templates = this.templates.filter(t => t.name === this.searchTerm)
    /*this.emailService.getEmailTemplates().subscribe(data => {
      this.templates = data.filter(template => template.name === this.searchTerm)
    })*/
   this.showInput = false
  }

  // Paginación
  initializePagination() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalItems = this.templates.length;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.getEmailTemplates();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.getEmailTemplates();
  }

  // Modal handlers
  showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openEditModal(template: TemplateModelResponse) {
    this.editingtemplate = { ...template };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingtemplate = {
      id: '',
      name: '',
      body: '',
      active: true,
    };
  }

  openDetailModal(template: TemplateModelResponse) {
    if (template) {
      this.selectedTemplate = { ...template };
      this.isDetailModalOpen = true;
    }
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedTemplate = null;
  }


  openDeleteModal(template: TemplateModelResponse) {
    this.templateToDelete = template;
    this.isDeleteModalOpen = true;
  }


  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.templateToDelete = null;
  }

  confirmDelete() {
    if (this.templateToDelete) {
      this.deleteTemplate(this.templateToDelete);
    }
  }
  showTheInput(){
    this.showInput = true
  }

  showInfo() {
    const message = `
      <strong>Sistema de gestión de templateos</strong><br>
      Aquí puedes administrar todos los templateos del sistema.<br><br>

      <strong>Iconografía:</strong><br>
      Activos: <i class="bi bi-check2-circle text-success large-icon"></i><br>
      Inactivos: <i class="bi bi-x-circle text-danger large-icon"></i>
    `;

    this.showModal('Información', message);
  }



  getEmailTemplates() {
    this.emailService.getEmailTemplates().subscribe((data) => {

      this.templates = [{ id: '0', name: 'template 1', body: `HOLA`, active: true }];

    })
  }

  deleteTemplate(deleteTemplate: TemplateModelResponse) {


  }

  public async editEmailTemplate(index: number): Promise<void> {
    this.router.navigate(['/template/change', this.templates[index].id]);
  }

  saveEmailTemplate() {
    this.router.navigate(['/templates/new']);
  }

  exportToExcel() { }

  exportToPDF() { }

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


  clearSearch() {
    this.searchTerm = '';
    // this.selectedContactType = '';
    // this.isActiveContactFilter = true;
    this.showInput = false; // Ocultar input al limpiar
    this.getEmailTemplates();
  }

  onSearchTextChange(){

    this.showInput = true;
  }

}

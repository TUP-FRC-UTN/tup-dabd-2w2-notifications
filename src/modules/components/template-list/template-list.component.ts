import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TemplateService } from '../../../app/services/template.service';
import { CommonModule } from '@angular/common';
import {Router } from '@angular/router';
import { TemplateModel } from '../../../app/models/templates/templateModel';
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
@Inject('TemplateService')
@Inject('Base64Service')
export class TemplateListComponent implements OnInit {

  private router = inject(Router);
  private toastService = inject(ToastService);


  templateService = new TemplateService();

  base64Service: Base64Service = new Base64Service();



  @ViewChild('iframePreview', { static: false }) iframePreview!: ElementRef;


  templates: TemplateModel[] = [];

  mocktemplates : TemplateModel[] = [
    { id: 1, name: 'Multas', body: `HOLA`, active: true },
    { id: 2, name: 'Deudas', body: `HOLA`, active: true },
    { id: 3, name: 'Catastro 1', body: `HOLA`, active: true }
  ];
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
  selectedTemplate: TemplateModel | null = null;

  // Referencias
  @ViewChild('editForm') editForm!: NgForm;
  templateToDelete: TemplateModel | null = null;
  editingtemplate: TemplateModel = this.getEmptytemplate();

  //Estado de filtors
  showInput: boolean = false;

  constructor() {
    this.initializePagination();
  }

  private getEmptytemplate(): TemplateModel {
    return {
      id: 0,
      name: '',
      body: '',
      active: true,
    };
  }

  filterByStatus(status: 'all' | 'active' | 'inactive') {
    if (status === 'all') {
      this.isActivetemplateFilter = undefined;
      this.templates = this.mocktemplates
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

  openEditModal(template: TemplateModel) {
    this.editingtemplate = { ...template };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingtemplate = {
      id: 0,
      name: '',
      body: '',
      active: true,
    };
  }

  openDetailModal(template: TemplateModel) {
    if (template) {
      this.selectedTemplate = { ...template };
      this.isDetailModalOpen = true;
    }
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedTemplate = null;
  }


  openDeleteModal(template: TemplateModel) {
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
    this.templates = this.mocktemplates
    this.templateService.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = [...this.templates, ...data]; //mezclo los mocks con lo de la api
      },
      error: () => {
        this.showModal('Error', 'Error al cargar las plantillas');
      }
    })
  }

  deleteTemplate(deleteTemplate: TemplateModel) {
    const index = this.templates.findIndex(template => template.id === deleteTemplate.id);

    if (index !== -1) { // Si se encuentra el índice
        this.templates[index].active = false
        this.templates.splice(index, 1); // Elimina el objeto en la posición 'index'
        this.showModal('Éxito', 'Template eliminado correctamente');
    } else {
        this.showModal('Error', 'Template no encontrado');
    }
}

/*

    updateTemplate(template: TemplatePatchModel) {
      this.emailService.editEmailTemplate(template).subscribe({
        next: (response) => {
          const index = this.templates.findIndex(t => t.id === template.id);
          if (index !== -1) {
            this.contacts[index] = { ...contact };
          }
          this.closeEditModal();
          this.toastService.sendSuccess('Éxito El contacto ha sido actualizado correctamente')

        },
        error: (error: HttpErrorResponse) => {
          this.toastService.sendError('Error Ha ocurrido un error al intentar actualizar el contacto intente nuevamente...')
          this.closeEditModal();
          console.error('Error al editar el contacto:', error);
        },
      });

  } */

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



  saveEditedTemplate() {
    if (this.editingtemplate) {
      // Lógica para guardar los cambios del template
      const index = this.templates.findIndex(t => t.id === this.editingtemplate.id);
      if (index !== -1) {
        this.templates[index] = { ...this.editingtemplate };
        this.showModal('Éxito', 'Template editado correctamente');
      }
      this.closeEditModal();

    }
  }







}

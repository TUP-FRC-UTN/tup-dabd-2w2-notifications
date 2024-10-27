import { CommonModule, Location } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';
import { SubscriptionService } from '../../../app/services/subscription.service';
import { Subscription, SubscriptionMod } from '../../../app/models/subscription';
import { Observable } from 'rxjs';
import { ToastService } from 'ngx-dabd-grupo01';


@Component({
  selector: 'app-contact-modify-subs-email',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modify-subs-email.component.html',
  styleUrl: './contact-modify-subs-email.component.css'
})
@Inject('ContactService')
@Inject('SubscriptionService')
export class ContactModifySubsEmailComponent implements OnInit {

  location: Location = inject(Location)

  serviceContact: ContactService = new ContactService()
  serviceSubs: SubscriptionService = new SubscriptionService()
  toastService : ToastService = inject(ToastService)

  modification: FormGroup = new FormGroup({
    contactId: new FormControl('', Validators.required),
    subscriptionId: new FormControl('', Validators.required),
    subscriptionValue: new FormControl(false)
  })

  allContacts: Contact[] = []
  selectedContact: Contact = {
    id: 0,
    subscriptions: [],
    contactValue: '',
    contactType: '',
    active: true,
    showSubscriptions: false
  }
  allSubsFromSelectedContact: Subscription[] = []
  selected: Boolean = false

  ngOnInit(): void {
    this.serviceContact.getAllContacts().subscribe((data) => {
      this.allContacts = data.filter(c => c.contactType === "EMAIL");
    })
  }

  //Al array de nombres lo manda como array de objetos Subscription que coincidan con ese name
  setSubscriptions(): Observable<Subscription[]> {
    return new Observable((observer) => {
      this.serviceSubs.getAllSubscriptions().subscribe((data) => {
        const subscriptionsMap = new Set(data.map(sub => sub.name));
        const aux = this.selectedContact?.subscriptions
          .filter(sub1 => subscriptionsMap.has(sub1))
          .map(sub1 => data.find(sub2 => sub2.name === sub1 && sub2.isUnsubscribable))
          .filter((sub): sub is Subscription => sub !== undefined);

        observer.next(aux);
        observer.complete();
      });
    });
  }
  loadSubscriptions() {
    this.setSubscriptions().subscribe((subscriptions) => {
      this.allSubsFromSelectedContact = subscriptions;
    });
  }
  set() {
    const contactId = this.modification.get('contactId')?.value;

    this.allContacts.forEach(c => {
      if (c.id == contactId) {
        this.selectedContact = c
      }
    })
  }


  submit() {
    const modification: SubscriptionMod = {
      contactId: this.modification.get('contactId')?.value,
      subscriptionId: this.modification.get('subscriptionId')?.value,
      subscriptionValue: this.modification.get('subscriptionValue')?.value
    }
    this.serviceContact.modifacateSubscription(modification).subscribe({
      next: (response) => {
        this.toastService.sendSuccess("Suscripción anulada con éxito")
        this.clean()
      },
      error: (error) => {
        this.toastService.sendError("Hubo un error al anular la suscripción")
      }
    })
  }

  setContact() {
    this.selected = true
    this.set()
    this.loadSubscriptions()
  }
  clean() {
    this.modification.reset({
      contactId: '',
      subscriptionId: '',
      subscriptionValue: false
    });
    window.location.reload()
  }
}

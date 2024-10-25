import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../app/services/contact.service';
import { Contact } from '../../../app/models/contact';
import { SubscriptionService } from '../../../app/services/subscription.service';
import { Subscription } from '../../../app/models/subscription';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-modify-subs-email',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modify-subs-email.component.html',
  styleUrl: './contact-modify-subs-email.component.css'
})
@Inject('ContactService')
@Inject('SubscriptionService')
export class ContactModifySubsEmailComponent implements OnInit{
  
  serviceContact : ContactService = new ContactService()
  serviceSubs : SubscriptionService = new SubscriptionService()

  modification : FormGroup = new FormGroup({
    contactId : new FormControl('', Validators.required),
    subscriptionId : new FormControl('', Validators.required),
    subscriptionValue : new FormControl(false)
  })

  allContacts : Contact[] = []
  selectedContact : Contact = {
    id: 0,
    subscriptions: [],
    contactValue: '',
    contactType: ''
  }
  allSubsFromSelectedContact : Subscription[] = []
  selected : Boolean = false

  ngOnInit(): void {
    this.serviceContact.getAllContacts().subscribe((data) => {
      this.allContacts = data.filter(c => c.contactType === "EMAIL");
    })
    //this.set()
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
    console.log(this.selectedContact);
  }
  

  submit() {

  }

  setContact() {
    this.selected = true
    this.set()
    this.loadSubscriptions()
  }
}

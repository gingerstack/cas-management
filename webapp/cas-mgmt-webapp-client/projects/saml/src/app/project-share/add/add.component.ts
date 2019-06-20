import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {SamlService} from '../../core/saml.service';
import {debounceTime, distinctUntilChanged, finalize, switchMap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {SpinnerService} from 'mgmt-lib';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  private lookupEntity = new Subject<string>();

  foundEntities: string[];

  constructor(public dialogRef: MatDialogRef<AddComponent>,
              public service: SamlService,
              public spinner: SpinnerService) { }

  ngOnInit() {
    this.lookupEntity.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query && query !== '' && query.length >= 3) {
          this.spinner.start('Searching');
          return this.service.lookupEntity(query)
            .pipe(finalize(() => this.spinner.stop()));
        } else {
          return new Observable((observer) => observer.next([]));
        }
      })
    ).subscribe((resp: string[])  => this.foundEntities = resp);
  }

  upload(evt: Event) {
    const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = (function(fe: AddComponent) {
      return function (e: Event) {
        fe.service.upload(<string> reader.result).subscribe(service => {
          fe.service.uploaded = service;
          fe.dialogRef.close('upload');
        });
      };
    })(this);
    reader.readAsText(input.files[0]);
  }

  doLookupEntity(val: string) {
    this.lookupEntity.next(val);
  }

  getEntity(id: string) {
    this.service.addEntity(id).subscribe(service => {
      this.service.uploaded = service;
      this.dialogRef.close('upload');
    });
  }
}
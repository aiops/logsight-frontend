import { Component, OnInit } from '@angular/core';
import { IntegrationService } from './integration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'integration',
  styleUrls: ['./integration.page.scss'],
  templateUrl: './integration.page.html',
})
export class IntegrationPage implements OnInit {
  key = localStorage.getItem('key');

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(private integrationService: IntegrationService) {
  }

  ngOnInit(): void {

  }

  createApplication() {

  }

}

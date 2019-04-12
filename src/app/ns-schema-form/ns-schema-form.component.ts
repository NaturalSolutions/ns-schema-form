import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, ControlContainer, AbstractControl } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';

import { IValidationError, NsSchemaService } from './ns-schema.service';
import { parse } from 'url';

@Component({
  selector: 'ns-schema-form',
  templateUrl: './ns-schema-form.component.html',
  styleUrls: ['./ns-schema-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class NsSchemaFormComponent implements OnInit {

  @Input('schema') schema: any;
  @Input('model') model: any;
  @Input('validation') validation: any;

  @ViewChild('formEl') formEl: NgForm;

  formState: any = {};
  form: any;

  constructor(
    private schemasSrv: NsSchemaService
  ) { }

  ngOnInit() {
    this.initForm();
    //console.log(this.form);

    //console.log(this.getFormItem('lang'))
  }

  initForm(): void {
    this.form = _.cloneDeep(this.schema);

    let parse: any = (items) => {
      _.forEach(items, item => {
        if (item.component == 'subforms') {
          item.subforms = [];
          let data: any[] = _.get(this.model, item.name);
          for (let i = 0; i < data.length; i++) {
            let subform: any = _.cloneDeep(item.subformsOf);
            subform.items = subform.items.map(subformItem => {
              return Object.assign(subformItem, {
                name: item.name + '.' + i + '.' + subformItem.name
              });
            });
            item.subforms.push(subform);
          }
        }
        for (let propName in item) {
          if (_.isObjectLike(item[propName])) {
            parse(item[propName]);
          }
        }
      });
    }

    parse(this.form.items);
  }

  onSubmit(): void {
    this.validate()
  }

  getFormItem(name): any {
    let parse: any = (items) => {
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.name == name) {
          return item;
        }
        for (let propName in item) {
          if (_.isObjectLike(item[propName])) {
            let result = parse(item[propName])
            if (result) {
              return result;
            }
          }
        }
      }
    }

    return parse(this.form.items);
  }

  validate(): void {
    //let dataToSend: any = BSON.EJSON.serialize(this.dataModel);
    let dataToSend: any = _.cloneDeep(this.model);
    let errors: IValidationError[] = this.schemasSrv.validate(this.validation, dataToSend);
    this.setErrors(errors);
    console.log(errors);
    console.log(this.formState);
  }

  setErrors(errors: IValidationError[]): void {
    for (const controlName in this.formEl.controls) {
      this.formState[controlName] = {
        errors: [],
        classNames: {
          'ion-touched': true,
          'ion-untouched': false,
          'ion-pristine': false
        }
      };
    }

    errors.forEach(error => {
      if (this.formState[error.property]) {
        this.formState[error.property].errors.push(error);
      }
    });

    for (const controlName in this.formEl.controls) {
      const control: AbstractControl = this.formEl.controls[controlName];
      control.updateValueAndValidity({ emitEvent: true });
      if (!this.formState[controlName].errors.length)
        continue;

      let errors: any = {};
      this.formState[controlName].errors.forEach(error => {
        errors[error.keyword] = error;
      });

      control.setErrors(errors, { emitEvent: true });
      control.markAsTouched({ onlySelf: false });
      control.markAsDirty({ onlySelf: false });
      Object.assign(this.formState[controlName].classNames, {
        'ion-valid': control.valid,
        'ion-invalid': control.invalid
      });
    }
  }
}

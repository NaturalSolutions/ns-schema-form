import { Component, OnInit, Input } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';
import { IValidationError } from '../ns-schema.service';

@Component({
  selector: 'ns-schema-form-items',
  templateUrl: './ns-schema-form-items.component.html',
  styleUrls: ['./ns-schema-form-items.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class NsSchemaFormItemsComponent implements OnInit {

  @Input('form') form: any;
  @Input('model') model: any;
  @Input('items') items: any;
  @Input('formState') formState: any;

  constructor() { }

  ngOnInit() {
    console.log(this.items);
  }

  getItemValue(item: any): any {
    let val: any = _.get(this.model, item.name);
    if (item.component == 'date') {
      return moment(val).format('YYYY-MM-DD')
    }
    return _.get(this.model, item.name);
  }

  setItemValue(item: any, value: any): void {
    if (item.component == 'date') {
      value = new Date(value);
    }
    _.set(this.model, item.name, value);
    console.log(this.model)
  }

  /* getItemErrors(item: any):IValidationError[] {
    let itemState:any = _.get(this.formState, item.name);
    let itemErrors: IValidationError[] =  _.get(itemState, 'errors');
    if (itemErrors && itemErrors.length)
      return itemErrors;
    for (const key in itemState) {

      if (_.get(itemState[key], 'errors', []).length)
        return true;
    }
    return false;
  } */
}

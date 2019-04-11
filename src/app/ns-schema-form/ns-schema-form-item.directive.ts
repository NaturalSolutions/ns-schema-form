import { Directive, Input, OnInit, HostBinding } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Directive({
  selector: '[nsSchemaFormItem]'
})
export class NsSchemaFormItemDirective implements OnInit {

  @Input('nsSchemaFormItem') item: any;
  @Input('schema') schema: any;
  @Input('model') model: any;

  /* @HostBinding('class')
  get elementClass(): string {
      return this.item.classNames.join(' ');
  } */

  constructor() { }

  ngOnInit() { }

}

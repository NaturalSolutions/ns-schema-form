import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NsSchemaFormComponent } from './ns-schema-form.component';
import { NsSchemaFormItemDirective } from './ns-schema-form-item.directive';
import { NsSchemaFormItemsComponent } from './ns-schema-form-items/ns-schema-form-items.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [NsSchemaFormComponent, NsSchemaFormItemDirective, NsSchemaFormItemsComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [NsSchemaFormComponent]
})
export class NsSchemaFormModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import { environment } from "../../environments/environment";

import * as Ajv from 'ajv';
import * as ajvErrors from 'ajv-errors';

import { I18NEXT_SERVICE, ITranslationService, I18NextService } from 'angular-i18next';

import * as _ from 'lodash';

export interface IValidationError {
  keyword: string,
  keywordValue?: any,
  message?: string,
  property?: string
}

@Injectable({
  providedIn: 'root'
})
export class NsSchemaService {

  constructor(
    private http: HttpClient,
    private i18NextSrv: I18NextService
  ) { }

  buildSchemaFromDefinition(schema: any, definition: string): any {
    schema = _.cloneDeep(schema);
    if (!definition)
      return schema;

    let schemaDefinition: any = schema.definitions[definition] || {};
    schemaDefinition.definitions = _.get(schema, 'definitions', {});
    delete schemaDefinition.definitions[definition];

    return schemaDefinition
  }

  validate(schema: any, data: any): IValidationError[] {
    let ajv = new Ajv({
      allErrors: true,
      $data: true,
      jsonPointers: true
    });
    ajvErrors(ajv);
    ajv.validate(schema, data);

    if (!ajv.errors)
      return [];
    
    console.log(ajv.errors);

    let getError = (ajvError): IValidationError => {
      let error: IValidationError = {
        keyword: ajvError.keyword
      };
      if (ajvError.keyword != 'if')
        error.property = ajvError.dataPath.replace('/', '').replace(/\//g, '.');
      if (ajvError.keyword == 'required') {
        if (error.property)
          error.property += '.';
        error.property += ajvError.params['missingProperty'];
        Object.assign(error, {
          message: this.i18NextSrv.t('validationErrors.required')
        });
      } else {
        if (ajvError.keyword == 'format')
          error.message = this.i18NextSrv.t('validationErrors.' + ajvError.params.format);
        else if (ajvError.keyword == 'minLength') {
          Object.assign(error, {
            keywordValue: ajvError.params.limit,
            message: this.i18NextSrv.t('validationErrors.minLength', { count: ajvError.params.limit })
          });
        } else if (ajvError.keyword == 'type') {
          Object.assign(error, {
            keywordValue: ajvError.params.type,
            message: this.i18NextSrv.t('validationErrors.' + ajvError.params.type)
          });
        } else if (ajvError.keyword == 'const') {
          Object.assign(error, {
            keywordValue: ajvError.params.allowedValue,
            message: this.i18NextSrv.t('validationErrors.const', { value: ajvError.params.allowedValue })
          });
        } else if (ajvError.keyword == 'errorMessage') {
          let errorMessage: string = ajvError.message;
          let splitIndex: number = errorMessage.indexOf(',');
          if (splitIndex < 0)
            errorMessage = this.i18NextSrv.t('validationErrors.' + errorMessage);
          else {
            let errorParams: string = errorMessage.substring(splitIndex + 1);
            try {
              errorMessage = this.i18NextSrv.t('validationErrors.' + errorMessage.substring(0, splitIndex), JSON.parse(errorParams));
            } catch (error) {
              errorMessage = this.i18NextSrv.t('validationErrors.' + errorMessage);
            }
          }
          let originError = getError(ajvError.params.errors[0])
          Object.assign(error, originError, {
            message: errorMessage
          });
        } else {
          console.log(ajvError);
        }
        if (!error.message && ajvError.message)
          error.message = ajvError.message;
      }

      return error;
    }

    return ajv.errors.map<IValidationError>(ajvError => {
      return getError(ajvError)
    });

  };

  /* get(name): Promise<any> {
    return this.http.get(environment.apiBaseUrl + '/api/schemas/' + name).toPromise();
  } */
}
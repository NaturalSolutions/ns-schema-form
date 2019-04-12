import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  schema: any = {
    items: [{
      name: 'firstname',
      title: 'First name',
      component: 'text'
    }, {
      name: 'comment',
      title: 'Comment',
      component: 'textarea'
    }, {
      name: 'birthdate',
      title: 'Birth date',
      component: 'date'
    }, {
      name: 'location.coordinates.1',
      title: 'Latitude',
      component: 'number',
      step: 1
    }, {
      name: 'location.coordinates.0',
      title: 'Longitude',
      component: 'number'
    }, {
      component: 'subforms',
      title: 'Translations',
      name: 'translations',
      subformsOf: {
        items: [{
          title: 'Lang',
          name: 'lang',
          component: 'text'
        }, {
          title: 'Title',
          name: 'title',
          component: 'text'
        }]
      }
    }]
  }
  model: any = {
    firstname: 'Vincent',
    comment: "Lorem ipsum dolor",
    birthdate: new Date('1995-12-17T03:24:00'),
    location: {
      type: 'Point',
      coordinates: [5.3627764, 43.2916532]
    },
    translations: [{
      lang: 'fr',
      title: 'bonjour'
    }, {
      lang: 'en',
      title: 'hello'
    }]
  }
  validation: any = {
    "type": "object",
    "properties": {
      "firstname": {
        "type": "string",
        "minLength": 2
      },
      "location": {
        "type": "object",
        "properties": {
          "coordinates": {
            "type": "array",
            "items": {
              "type": "number",
              "minimum": 6
            }
          }
        }
      },
      "translations": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lang": {
              "type": "string",
              "minLength": 2,
              "maxLength": 2
            }
          }
        }
      },
    }
  }
}

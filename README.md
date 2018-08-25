# SiD3Components

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Upgrade Font Awesome
npm config delete "@fortawesome:registry"
npm config delete "//npm.fontawesome.com/:_authToken

yarn add @fortawesome/fontawesome-svg-core   
yarn add @fortawesome/free-solid-svg-icons   
yarn add @fortawesome/angular-fontawesome

Modify index.html link to FA css
Modify angular.json styles and script

## VSCode
QT Paste JSON as Code - used for generating TypeScript interface from JSON schema

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

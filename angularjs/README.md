# drowzApp

This project is generated with [yo angular generator](https://github.com/config/generator-angular)

## Install Front-End

1. Check if Node.js installed (print in console)
```bash
node -v
```
if node isn't installed, download installer here: [Node.js](https://nodejs.org/).

2. Check if Gulp.js installed (print in console)
```bash
gulp -v
```
if gulp isn't installed, print in console:
```bash
npm i gulp -g
```

3. Run commands for gulp:
```bash
gulp
```
> Starts development server

```bash
gulp serve
```
> Starts development server

```bash
gulp build
```
> Makes build

```bash
gulp serve:dist
```
> Makes build and starts server on it

```bash
gulp nuget
```
> Makes build and creates nuget package


## Convention for naming files and folders:

 - use '-' for folder names, for example 'folder-name'
 - use '-' for file names
 - mark file type in file name with '.', for example 'file-name.component.js'

## Project structure

```
   app  
   |-- assets
   |-- parent-component-1 
       |-- assets      
       |-- components
           |-- child-component-1
               |-- modals
               |-- child-component-1.component.js / child-component-1.controller.js
               |-- child-component-1.service.js
               |-- child-component-1.scss
               |-- child-component-1.html               
           |-- child-component-2
                ...                       
       |-- modals
           |-- modal-component-1
               |-- modal-component-1.component.js / modal-component-1.controller.js
               |-- modal-component-1.scss
               |-- modal-component-1.html
           |-- modal-component-2
                ...    
       |-- directives
           |-- shared-directive-1.directive.js 
       |-- services 
           |-- shared-service-1.service.js 
       |-- parent-component-1.module.js
       |-- parent-component-1.route.js
       |-- shared-folder
   |-- parent-component-2
        ...  
   |-- shared-folder
       |-- components
       |-- directives
       |-- filters
       |-- services  
       |-- decorators
       |-- actions
       |-- reducers
       |-- store 
       |-- shared.module.js
   |-- index.html
   |-- config.js
   |-- config.route.js
   |-- index.module.js
```            
   

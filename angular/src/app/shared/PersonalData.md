Description
-------------------
Accordion component for 'Personal Data'

![Screenshot-1](../examples/personal-data.jpg)

Example
-------------------
```html
<mat-accordion class="niko-accordion">
   <mat-expansion-panel>
       <mat-expansion-panel-header>
           <mat-panel-title class="accordion-header">
               <mat-icon svgIcon="chevron" class="accordion-chevron"></mat-icon>
               Personal data:
               <div class="accordion-line"></div>
           </mat-panel-title>
       </mat-expansion-panel-header>
       <p>
           <mat-form-field>
               <input matInput placeholder="First name">
           </mat-form-field>
           <mat-form-field>
               <input matInput placeholder="Age">
           </mat-form-field>
       </p>
       <p>
           <mat-form-field>
               <input matInput placeholder="First name">
           </mat-form-field>
           <mat-form-field>
               <input matInput placeholder="Age">
           </mat-form-field>
       </p>
   </mat-expansion-panel>
</mat-accordion>
```

import { Directive, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RemoteData } from 'src/app/core/data/remote-data';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ComColDataService } from 'src/app/core/data/comcol-data.service';
import { Operation } from 'fast-json-patch';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { Community } from 'src/app/core/shared/community.model';
import { Collection } from 'src/app/core/shared/collection.model';

export interface FieldDefinition {
  name: string;
  label: string;
  isTextArea: boolean;
}

@Directive()
export abstract class ComColI18nMetadataComponent<T extends Community | Collection> implements OnInit, OnDestroy {
  /**
   * The DSpaceObject (Community or Collection) being edited
   */
  dso: T;

  /**
   * RemoteData observable for the DSO
   */
  dsoRD$: Observable<RemoteData<T>>;

  /**
   * Array of translatable fields
   */
  fields: FieldDefinition[] = [];

  /**
   * Cloned copy of the active metadata values for editing, indexed by field name
   */
  currentMetadata: { [fieldName: string]: MetadataValue[] } = {};

  /**
   * Form state for adding new translations, indexed by field name
   */
  newTranslationForm: { [fieldName: string]: { value: string; language: string } } = {};

  /**
   * Track subscriptions to unsubscribe onDestroy
   */
  protected subs: Subscription[] = [];

  constructor(
    protected dsoService: ComColDataService<T>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(map((data) => data.dso));
    this.subs.push(
      this.dsoRD$.subscribe((rd: RemoteData<T>) => {
        if (rd.hasSucceeded) {
          this.dso = rd.payload;
          this.initializeFields();
        }
      })
    );
  }

  /**
   * Initialize fields and their in-memory copies from DSO
   */
  initializeFields(): void {
    this.fields = [
      { name: 'dc.title', label: 'Name', isTextArea: false },
      { name: 'dc.description', label: 'Introductory text (HTML)', isTextArea: true },
      { name: 'dc.description.abstract', label: 'Short Description', isTextArea: true },
      { name: 'dc.rights', label: 'Copyright text (HTML)', isTextArea: true },
      { name: 'dc.description.tableofcontents', label: 'News (HTML)', isTextArea: true },
    ];

    if (this.dso.type.value === 'collection') {
      this.fields.push({ name: 'dc.rights.license', label: 'License', isTextArea: true });
    }

    this.fields.forEach((field) => {
      // Get all existing metadata values for this field
      const values = this.dso.allMetadata(field.name);
      // Deep clone them to avoid mutating the original DSO metadata map
      this.currentMetadata[field.name] = values.map((val) => Object.assign({}, val));
      // Initialize the "add translation" form state
      this.newTranslationForm[field.name] = { value: '', language: '' };
    });
  }

  /**
   * Add a new translation row in-memory
   */
  addTranslation(fieldName: string): void {
    const form = this.newTranslationForm[fieldName];
    if (!form.value || !form.value.trim() || !form.language || !form.language.trim()) {
      this.notificationsService.warning(
        this.translate.instant('comcol.i18n-metadata.validation.title'),
        this.translate.instant('comcol.i18n-metadata.validation.message')
      );
      return;
    }

    const newValue: MetadataValue = {
      value: form.value.trim(),
      language: form.language.trim().toLowerCase(),
    } as any;

    this.currentMetadata[fieldName].push(newValue);
    // Reset form
    form.value = '';
    form.language = '';
  }

  /**
   * Remove a translation row in-memory
   */
  removeTranslation(fieldName: string, index: number): void {
    this.currentMetadata[fieldName].splice(index, 1);
  }

  /**
   * Compare in-memory state with original DSO state and submit patches
   */
  onSubmit(): void {
    // Automatically add any pending input from the "Add Translation" forms
    this.fields.forEach((field) => {
      const form = this.newTranslationForm[field.name];
      if (form && form.value && form.value.trim() && form.language && form.language.trim()) {
        this.addTranslation(field.name);
      }
    });

    const operations: Operation[] = [];

    this.fields.forEach((field) => {
      const original = this.dso.allMetadata(field.name);
      const current = this.currentMetadata[field.name];

      // 1. Generate replace and add operations
      current.forEach((currVal, index) => {
        const origVal = original[index];

        if (origVal) {
          // Normalize languages and values for strict comparison
          const origLang = origVal.language || '';
          const currLang = currVal.language || '';
          const origText = origVal.value || '';
          const currText = currVal.value || '';

          // If value or language changed, generate replace operation
          if (origText !== currText || origLang !== currLang) {
            operations.push({
              op: 'replace',
              path: `/metadata/${field.name}/${index}`,
              value: {
                value: currVal.value,
                language: currVal.language ? currVal.language.toLowerCase() : null,
                authority: currVal.authority || null,
                confidence: currVal.confidence || -1
              },
            });
          }
        } else {
          // If value is new, append it
          operations.push({
            op: 'add',
            path: `/metadata/${field.name}/-`,
            value: {
              value: currVal.value,
              language: currVal.language ? currVal.language.toLowerCase() : null,
              authority: currVal.authority || null,
              confidence: currVal.confidence || -1
            },
          });
        }
      });

      // 2. Generate remove operations for deleted elements
      // Remove operations must be processed from highest index to lowest
      // to prevent shifts during list processing.
      if (original.length > current.length) {
        for (let i = original.length - 1; i >= current.length; i--) {
          operations.push({
            op: 'remove',
            path: `/metadata/${field.name}/${i}`,
          });
        }
      }
    });

    if (operations.length === 0) {
      this.notificationsService.info(
        this.translate.instant('comcol.i18n-metadata.no-changes.title'),
        this.translate.instant('comcol.i18n-metadata.no-changes.message')
      );
      return;
    }

    // Call REST PATCH endpoint
    this.dsoService.patch(this.dso, operations as any)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((response: RemoteData<T>) => {
        if (response.hasSucceeded) {
          this.notificationsService.success(
            this.translate.instant('comcol.i18n-metadata.save.success.title'),
            this.translate.instant('comcol.i18n-metadata.save.success.message')
          );
          // Update the local DSO and re-initialize fields with saved data
          this.dso = response.payload;
          this.initializeFields();
        } else {
          this.notificationsService.error(
            this.translate.instant('comcol.i18n-metadata.save.error.title'),
            response.errorMessage || this.translate.instant('comcol.i18n-metadata.save.error.message')
          );
        }
      });
  }

  /**
   * Reset in-memory changes back to original
   */
  onDiscard(): void {
    this.initializeFields();
    this.notificationsService.info(
      this.translate.instant('comcol.i18n-metadata.discarded.title'),
      this.translate.instant('comcol.i18n-metadata.discarded.message')
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

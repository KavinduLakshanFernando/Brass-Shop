'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import initialSiteData from '@/data/site-data.json';

export const PREVIEW_DATA_MESSAGE = 'MARKETPLACE_PREVIEW_SITE_DATA';
export const PREVIEW_READY_MESSAGE = 'MARKETPLACE_PREVIEW_READY';
export const PREVIEW_FOCUS_MESSAGE = 'MARKETPLACE_PREVIEW_FOCUS_PAGE';
const PREVIEW_FIELD_ATTRIBUTE = 'data-preview-field-path';

type GenericRecord = Record<string, unknown>;

export type SiteData = {
  project?: {
    id?: string | null;
  } | null;
  merchant?: GenericRecord | null;
  template?: {
    structure?: {
      pages?: string[] | null;
      theme?: GenericRecord | null;
    } | null;
  } | null;
  requirements?: { requiredPages?: string[] | null } | null;
  content?: GenericRecord | null;
  [key: string]: unknown;
};

const SiteDataContext = createContext<SiteData>(initialSiteData as SiteData);

function isRecord(value: unknown): value is GenericRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeSiteData(current: unknown, incoming: unknown): unknown {
  if (Array.isArray(incoming)) return structuredClone(incoming);
  if (!isRecord(incoming)) return incoming;

  const base = isRecord(current) ? current : {};
  return Object.fromEntries(
    new Set([...Object.keys(base), ...Object.keys(incoming)])
      .values()
      .map((key) => [
        key,
        key in incoming
          ? mergeSiteData(base[key], incoming[key])
          : structuredClone(base[key]),
      ]),
  );
}

function allowedParentOrigin() {
  try {
    return document.referrer ? new URL(document.referrer).origin : null;
  } catch {
    return null;
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(
    initialSiteData as SiteData,
  );

  useEffect(() => {
    const parentOrigin = allowedParentOrigin();
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (parentOrigin && event.origin !== parentOrigin) return;
      if (!isRecord(event.data)) return;

      if (event.data.type === PREVIEW_DATA_MESSAGE && isRecord(event.data.siteData)) {
        setSiteData((current) =>
          mergeSiteData(current, event.data.siteData) as SiteData,
        );
      }

      if (event.data.type === PREVIEW_FOCUS_MESSAGE) {
        const fieldPath =
          typeof event.data.fieldPath === 'string' ? event.data.fieldPath : '';
        if (!fieldPath) return;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('marketplace:focus-field', { detail: { fieldPath } })
          );
        }
        requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(
            `[${PREVIEW_FIELD_ATTRIBUTE}="${CSS.escape(fieldPath)}"]`,
          );
          target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    };

    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: PREVIEW_READY_MESSAGE }, parentOrigin ?? '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const value = useMemo(() => siteData, [siteData]);
  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}

export function contentObject(value: unknown): GenericRecord {
  return isRecord(value) ? value : {};
}

export function contentText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export function contentList(value: unknown) {
  return Array.isArray(value) ? value : [];
}

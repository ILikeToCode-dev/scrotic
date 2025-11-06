// Provides a library of SVG icons used throughout the application.
import React from 'react';

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export const ModelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.5a.75.75 0 0 1 .75.75v3.518a.75.75 0 0 1-1.5 0V3.25a.75.75 0 0 1 .75-.75zM18.471 4.029a.75.75 0 0 1 1.06 1.06l-2.488 2.488a.75.75 0 0 1-1.06-1.06l2.488-2.488zM5.529 4.029a.75.75 0 0 1 1.06-1.06l2.488 2.488a.75.75 0 1 1-1.06 1.06L5.53 4.029zM20.75 11.25a.75.75 0 0 1 0 1.5h-3.518a.75.75 0 0 1 0-1.5H20.75zM6.768 11.25a.75.75 0 0 1 0 1.5H3.25a.75.75 0 0 1 0-1.5h3.518zM18.471 16.971a.75.75 0 1 1-1.06 1.06l-2.488-2.488a.75.75 0 0 1 1.06-1.06l2.488 2.488zM7.05 15.45a.75.75 0 0 1 1.06 1.06L5.622 18.998a.75.75 0 1 1-1.06-1.06L7.05 15.45zM12 17.5a.75.75 0 0 1 .75.75v3.518a.75.75 0 0 1-1.5 0V18.25a.75.75 0 0 1 .75-.75z"/>
        <path fillRule="evenodd" d="M10.892 8.018a.75.75 0 0 1 1.06 0l2.472 2.471a.75.75 0 1 1-1.06 1.06L10.892 9.078a.75.75 0 0 1 0-1.06z"/>
        <path fillRule="evenodd" d="M8.018 10.892a.75.75 0 0 1 1.06 0l2.472 2.471a.75.75 0 1 1-1.06 1.06L8.018 11.952a.75.75 0 0 1 0-1.06z"/>
    </svg>
);

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

export const PaperclipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 18.374 12.74l-8.47 8.47a.75.75 0 0 1-1.06-1.06l8.47-8.47a2.625 2.625 0 1 0-3.712-3.712L6.34 18.375a6 6 0 1 0 8.486-8.486L18.375 12.74Z" />
    </svg>
);

export const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.82a2.25 2.25 0 0 1-1.061.632L5.01 21.75l.632-4.512a2.25 2.25 0 0 1 .632-1.061L16.862 4.487Z" />
    </svg>
);

export const EraserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
  </svg>
);


export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.548 0A48.094 48.094 0 0 1 6.625 5.4a48.097 48.097 0 0 1-3.478-.397m15.823 0-3.434-3.434a1.125 1.125 0 0 0-1.591 0L10.5 5.4m-4.715 0 3.434-3.434a1.125 1.125 0 0 1 1.591 0L13.5 5.4" />
    </svg>
);

export const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776v.11a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21.75 9.886v-.11M3.75 9.776a2.25 2.25 0 0 1-2.25-2.25V7.5c0-1.242 1.008-2.25 2.25-2.25h3.75a2.25 2.25 0 0 1 1.591.659l.622.621a2.25 2.25 0 0 0 1.591.659h3.75a2.25 2.25 0 0 1 2.25 2.25v1.616M21.75 12.116v6.134A2.25 2.25 0 0 1 19.5 20.5H4.5a2.25 2.25 0 0 1-2.25-2.25v-6.134" />
    </svg>
);

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.82a2.25 2.25 0 0 1-1.061.632L5.01 21.75l.632-4.512a2.25 2.25 0 0 1 .632-1.061L16.862 4.487Z" />
    </svg>
);

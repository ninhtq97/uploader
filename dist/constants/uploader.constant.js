"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOADER_HEADERS = exports.MIME_TYPE = exports.UPLOADER_OPTIONS = void 0;
exports.UPLOADER_OPTIONS = 'UPLOADER_OPTIONS';
exports.MIME_TYPE = {
    IMG: ['image/jpeg', 'image/png', 'image/avif', 'image/gif', 'image/webp'],
    DOCS: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    EXCEL: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
    ],
};
exports.UPLOADER_HEADERS = {
    ACCEPT_MIME: 'x-accept-mime',
};

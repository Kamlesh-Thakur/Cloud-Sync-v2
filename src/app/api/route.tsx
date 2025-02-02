import { BlobServiceClient } from '@azure/storage-blob';

type FileRowObject = {
  name: string;
  createdOn: Date;
  size: string;
  type: string;
};

import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('Azure Storage connection string is missing.');
    }

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const formatFileSize = (size) => {
      if (!size) return 'N/A';
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let i = 0;
      while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
      }
      return `${size.toFixed(2)} ${units[i]}`;
    };

    const getFileType = (fileName) => {
      if (fileName) {
        // Fallback to extension if contentType is not helpful
        const ext = fileName.split('.').pop().toUpperCase();
        switch (ext) {
          case 'PNG':
          case 'JPG':
          case 'JPEG':
          case 'GIF':
            return 'IMAGE';
          case 'MP4':
          case 'MOV':
          case 'AVI':
            return 'VIDEO';
          case 'MP3':
          case 'WAV':
          case 'AAC':
            return 'AUDIO';
          case 'PDF':
            return 'PDF';
          case 'DOC':
          case 'DOCX':
            return 'DOCUMENT';
          case 'XLS':
          case 'XLSX':
            return 'SPREADSHEET';
          case 'TXT':
            return 'TEXT';
          case 'ZIP':
          case 'RAR':
            return 'ARCHIVE';
          case 'CSV':
            return 'CSV';
          default:
            return ext || 'FILE'; // Return extension or 'FILE' if no extension
        }
      } else {
        return 'UNKNOWN';
      }
    };

    const blobs: FileRowObject[] = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      const { name, properties } = blob;
      blobs.push({
        name,
        createdOn: properties.createdOn,
        size: formatFileSize(properties.contentLength),
        type: getFileType(name),
      });
    }

    return NextResponse.json({ files: blobs });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files.' });
  }
}

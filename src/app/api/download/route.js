import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // req only, no res
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return new NextResponse('Missing file parameter', { status: 400 });
    }

    const blobClient = containerClient.getBlobClient(fileName);
    const downloadResponse = await blobClient.download(); // Use download() method
    const headers = new Headers();
    headers.set(
      'Content-Type',
      downloadResponse.contentType || 'application/octet-stream',
    );
    headers.set('Content-Length', downloadResponse.contentLength);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    if (downloadResponse.readableStreamBody) {
      return new NextResponse(downloadResponse.readableStreamBody, {
        // Use downloadResponse.body
        status: 200,
        headers: headers,
      });
    } else {
      return new NextResponse('No readable stream available', { status: 500 });
    }
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Error downloading file', { status: 500 });
  }
}

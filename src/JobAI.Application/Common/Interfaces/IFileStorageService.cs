using Microsoft.AspNetCore.Http;

namespace JobAI.Application.Common.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string containerName);
    Task<string> UploadFileAsync(byte[] fileData, string fileName, string contentType, string containerName);
    Task DeleteFileAsync(string filePath, string containerName);
    Task<byte[]> DownloadFileAsync(string filePath, string containerName);
    string GetFileUrl(string filePath, string containerName);
}


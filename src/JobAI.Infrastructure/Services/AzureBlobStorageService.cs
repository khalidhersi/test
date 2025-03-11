using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using JobAI.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace JobAI.Infrastructure.Services;

public class AzureBlobStorageService : IFileStorageService
{
    private readonly string _connectionString;
    private readonly ILogger<AzureBlobStorageService> _logger;

    public AzureBlobStorageService(IConfiguration configuration, ILogger<AzureBlobStorageService> logger)
    {
        _connectionString = configuration["AzureStorage:ConnectionString"] ?? throw new ArgumentNullException("Azure Storage connection string is not configured");
        _logger = logger;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string containerName)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null", nameof(file));
        }

        using var stream = file.OpenReadStream();
        return await UploadStreamAsync(stream, file.FileName, file.ContentType, containerName);
    }

    public async Task<string> UploadFileAsync(byte[] fileData, string fileName, string contentType, string containerName)
    {
        if (fileData == null || fileData.Length == 0)
        {
            throw new ArgumentException("File data is empty or null", nameof(fileData));
        }

        using var stream = new MemoryStream(fileData);
        return await UploadStreamAsync(stream, fileName, contentType, containerName);
    }

    private async Task<string> UploadStreamAsync(Stream stream, string fileName, string contentType, string containerName)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var blobClient = containerClient.GetBlobClient(uniqueFileName);

            var blobHttpHeader = new BlobHttpHeaders
            {
                ContentType = contentType
            };

            await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = blobHttpHeader });

            return uniqueFileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file to Azure Blob Storage");
            throw;
        }
    }

    public async Task DeleteFileAsync(string filePath, string containerName)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(filePath);

            await blobClient.DeleteIfExistsAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file from Azure Blob Storage");
            throw;
        }
    }

    public async Task<byte[]> DownloadFileAsync(string filePath, string containerName)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(filePath);

            var response = await blobClient.DownloadAsync();
            
            using var memoryStream = new MemoryStream();
            await response.Value.Content.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file from Azure Blob Storage");
            throw;
        }
    }

    public string GetFileUrl(string filePath, string containerName)
    {
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(filePath);

        return blobClient.Uri.ToString();
    }
}


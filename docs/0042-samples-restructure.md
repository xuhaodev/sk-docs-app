# Samples Restructure

## Context and Problem Statement

- The current way samples are structured is not informative and is difficult to find.
- The numbering in Kernel Syntax Examples has lost its meaning.
- The naming of projects doesn't convey clear information about what they actually are.
- The suffix `Examples` on folders and solutions is not necessary, since everything in `samples` is already an `example`.

### Currently Identified Sample Types

| Type | Description |
| --- | --- |
| `GettingStarted` | Single step-by-step tutorial for getting started |
| `Concepts` | Concept-specific code snippets organized by feature |
| `LearnResources` | Code snippets related to online documentation sources such as Microsoft Learn, DevBlogs, etc. |
| `Tutorials` | More in-depth step-by-step tutorials |
| `Demos` | Demo applications that leverage one or more features |

## Current Folder Strategy for Existing Folders

| Folder Name | Recommended Action |
| --- | --- |
| HuggingFaceImageText Example | Move to `Demo` subfolder and rename to `HuggingFaceImageToText` |

## KernelSyntaxExamples Decomposition Options

### KernelSyntaxExamples Decomposition Option 2 - Concepts Flat Version by Component

```
├── AIServices.TextToImage.OpenAI
├── AIServices.TextToImage.AzureOpenAI
├── AIServices.ImageToText.HuggingFace
├── AIServices.TextToAudio.OpenAI
├── AIServices.AudioToText.OpenAI
├── AIServices.Custom.DIY
├── AIServices.Custom.OpenAI.OpenAIFile
├── MemoryServices.Search.SemanticMemory
├── MemoryServices.Search.TextMemory
├── MemoryServices.Search.AzureAISearch
├── MemoryServices.TextEmbeddings.OpenAI
├── MemoryServices.TextEmbeddings.HuggingFace
├── Telemetry
├── Logging
├── DependencyInjection
├── HttpClient.Resiliency
├── HttpClient.Usage
├── Planners.Handlerbars
├── Authentication.AzureAD
├── FunctionCalling.AutoFunctionCalling
```
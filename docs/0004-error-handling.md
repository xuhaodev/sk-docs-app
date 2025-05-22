# Error Handling Improvements

## Disclaimer

This ADR describes issues and solutions for improving SK error handling. It does not address aspects of logging, resilience, or observability.

## Context and Problem Statement

Currently, there are several aspects of error handling in SK that could be enhanced to simplify SK code and SK client code while ensuring consistency and maintainability:

- **Exception propagation**. SK has some public methods, such as Kernel.RunAsync and SKFunction.InvokeAsync, that handle exceptions in a non-standard way. Instead of raising exceptions, they catch exceptions and store them in the SKContext. This is different from the standard error handling approach in .NET, which expects methods to execute successfully when fulfilling a contract or to raise an exception when violating a contract. As a result, when using the .NET version of the SK SDK, it is difficult to determine whether method execution was successful or failed without analyzing specific properties of the SKContext instance. This can lead to frustration for developers using the .NET SK SDK.

- **Improper use of exceptions**. Some SK components use custom SK exceptions instead of standard .NET exceptions to indicate invalid parameters, configuration issues, etc. This deviates from the standard approach to error handling in .NET and can frustrate SK client code developers.

- **Exception hierarchy**. Half of the custom SK exceptions derive from SKException, while the other half derive directly from Exception. This inconsistency in the exception hierarchy does not form a cohesive exception model.

- **Unnecessary and verbose exceptions**. Some SK components (such as Kernel or Planner) have exceptions at their level, namely PlanningException or KernelException, which are not really necessary and could easily be replaced by SKException and some of its derivatives. SK clients might become dependent on them, making it difficult to remove them later if SK needs to stop using them. Additionally, each SK memory connector in SK has an exception type - PineconeMemoryException, QdrantMemoryException - that doesn't add any additional information and only differs in name while having the same member signatures. This makes it impossible for SK client code to handle them in a unified way. SK client code needs to include a catch block for each component implementation instead of a single catch block. Furthermore, SK client code needs to be updated whenever a new component implementation is added or removed.

- **Missing original exception details**. Some SK exceptions do not preserve the original failure or exception details and do not expose them through their properties. This omission prevents SK client code from understanding and properly handling the issue.

## Decision Drivers

- Exceptions should propagate to SK client code rather than being stored in SKContext. This adjustment will align SK error handling with the .NET approach.
- The SK exception hierarchy should be designed with the "less is more" principle in mind. It's easier to add new exceptions later, but removing them might be difficult.
- .NET standard exception types should be preferred over SK custom exception types because they are easily recognizable, don't require any maintenance, can cover common error scenarios, and provide meaningful and standardized error messages.
- When passing exceptions to callers, exceptions should not be wrapped in SK exceptions unless it helps build actionable logic for SK or SK client code.

## Considered Options

- Simplify the existing SK exception hierarchy by removing all custom exception types except for the SKException exception type and any other actionable types. Use the SKException type instead of the removed types unless more details need to be conveyed, in which case create a specific derived exception.
- Modify SK code to throw .NET standard exceptions, such as ArgumentOutOfRangeException or ArgumentNullException, when class parameter values are not provided or are invalid, instead of throwing custom SK exceptions. Analyze SK exception usage to identify and fix other potential areas where standard .NET exceptions can be used.
- Remove code that wraps unhandled exceptions into AIException or any other SK exception that is solely used for wrapping purposes. In most cases, this code doesn't provide useful information for acting on it, other than a generic and uninformative "Something went wrong" message.
- Identify and address all cases where the original exception is not preserved as the inner exception of a rethrown SK exception.
- Create a new exception HttpOperationException with a StatusCode property and implement the necessary logic to map exceptions from HttpStatusCode, HttpRequestException, or Azure.RequestFailedException. Update existing SK code that interacts with the HTTP stack to throw HttpOperationException when an HTTP request fails and assign the original exception as its inner exception.
- Modify all SK components that currently store exceptions in SK context to rethrow them instead.
- Simplify SK critical exception handling functionality by modifying the IsCriticalException extension method to exclude handling of StackOverflowException and OutOfMemoryException exceptions. This is because the former exception will not be raised and thus call code will not execute, and the latter exception doesn't necessarily prevent recovery code from executing.
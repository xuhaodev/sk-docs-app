# Breaking Changes Guidance

## Context and Problem Statement

We must avoid breaking changes in .Net due to the well-known [diamond dependency problem](https://learn.microsoft.com/en-us/dotnet/standard/library-guidance/dependencies#diamond-dependencies), where breaking changes between different versions of the same package can cause runtime errors and exceptions.

## Decision Drivers

Breaking changes are only allowed in the following cases:

- Updates to experimental features, i.e., where we've learned something new and need to modify the design of an experimental feature.
- When one of our dependencies introduces an unavoidable breaking change.

All breaking changes must be clearly documented, absolutely in the release notes, and potentially via migration guides and blog posts.

- Include a detailed description of breaking changes in PR descriptions so that they can be included in the release notes.
- Update the Learn site migration guide documentation, and publish that document to align with the release that includes the breaking changes.

When introducing public types, careful thought and review should be done to ensure the API is correct, follows all guidance, and honors .NET Design Guidelines.

For example, a public type should:
- Not expose fields
- Expose properties
- Have virtual methods as needed
- Be inheritable OR sealed
- Follow .NET naming conventions
- Be async if needed
- Use standard .NET abstractions if possible
- Avoid using SK abstractions unless required
- Have adequate test coverage
- Have code coverage as required for methods and properties
- Annotated with the expected lifetime (experimental or stable)

## Decision Outcome

Selected option: We must avoid breaking changes in .Net due to the well-known diamond dependency problem.
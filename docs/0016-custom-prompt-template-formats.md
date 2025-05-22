# Custom Prompt Template Formats

## Context and Problem Statement

By default, the `Kernel` uses the `BasicPromptTemplateEngine` which supports the Semantic Kernel specific template format.

### Current Design

#### Code Patterns

1. Our semantic function extension methods inherit our `IPromptTemplate` (i.e., `PromptTemplate`) implementation which stores the template string and renders it using the `IPromptTemplateEngine` each time. Note that the implementations of `IPromptTemplate` are currently stateful, as they also store parameters.

2. The `IPromptTemplateEngine` is used to render a template given the template string and parameters. The default implementation `BasicPromptTemplateEngine` supports the Semantic Kernel specific template format.

#### Performance

| Action | Mean (µs) | Error (µs) |
| --- | --- | --- |
| Extract blocks | 60070 | 8 |
| Compile template | 66277 | 6 |
| Render variables | 4173 | 0 |

**By separating extract blocks/compile from render variables, performance can be optimized by only compiling the template once.**

#### Implementing a Custom Prompt Template Engine

An alternative approach to the default `BasicPromptTemplateEngine` is to implement a custom prompt template engine. In that case, the developer would have to implement the interface `IPromptTemplateEngine`.

#### Handlebars Considerations

Handlebars doesn't support dynamic binding of helpers. Consider the following code snippet:

```csharp
HandlebarsHelper link_to = (writer, context, parameters) =>
{
    writer.WriteSafeString($"<a href='{context["url"]}'>{context["text"]}</a>");
};

string source = @"Click here: {{link_to}}";

var data = new
{
    url = "https://github.com/rexm/handlebars.net",
    text = "Handlebars.Net"
};

// Act
var handlebars = HandlebarsDotNet.Handlebars.Create();
handlebars.RegisterHelper("link_to", link_to);
var template = handlebars1.Compile(source);
// handlebars.RegisterHelper("link_to", link_to); This also works
var result = template1(data);
```

## Decision Outcome

Chosen option: "Obsolete `IPromptTemplateEngine` and replace with `IPromptTemplateFactory`", because
it meets the requirements and provides good flexibility for the future.
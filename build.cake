//////////////////////////////////////////////////////////////////////
// TOOLS
//////////////////////////////////////////////////////////////////////
#tool "nuget:?package=GitVersion.CommandLine&version=4.0.0"
#tool "nuget:?package=OctopusTools&version=6.12.0"
#addin "Cake.Npm&version=0.17.0"

//////////////////////////////////////////////////////////////////////
// ARGUMENTS / ENV VARS
//////////////////////////////////////////////////////////////////////
var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

var releasesToKeep = int.Parse(EnvironmentVariable("BUILD_KEEP_RELEASE") ?? "5");

var octopusUrl = EnvironmentVariable("BUILD_OCTOPUS_URL") ?? "https://octopus.drowz.net";
var octopusKey = EnvironmentVariable("BUILD_OCTOPUS_API_KEY") ?? "";
var octopusSpace = EnvironmentVariable("BUILD_OCTOPUS_SPACE") ?? "NikoHealth";
var octopusProjName = EnvironmentVariable("BUILD_OCTOPUS_PROJECT") ?? "DME";
var deployEnv = (EnvironmentVariable("BUILD_DEPLOY_ENV") ?? "DME-DEV").ToLower();

///////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////////////////////////////////////
var serviceName = "UI";

var artifactsDir = "./artifacts/";
var publishDir = "dist/";

var pkg = $"NikoHealth.{serviceName}";

GitVersion gitVersionInfo;
string nugetVersion;

///////////////////////////////////////////////////////////////////////////////
// SETUP / TEARDOWN
///////////////////////////////////////////////////////////////////////////////
Setup(context =>
{
    gitVersionInfo = GitVersion(new GitVersionSettings {
        OutputType = GitVersionOutput.Json
    });

    nugetVersion = gitVersionInfo.SemVer;

    Information("Building Tasks v{0}", nugetVersion);
    Information("Informational Version {0}", gitVersionInfo.InformationalVersion);
});

Teardown(context =>
{
    Information("Finished running tasks.");
});


//////////////////////////////////////////////////////////////////////
//  TASKS
//////////////////////////////////////////////////////////////////////
Task("Clean")
    .Does(() =>
{
  CleanDirectory(artifactsDir);
  CleanDirectory(publishDir);
});

Task("Restore")
  .IsDependentOn("Clean")
  .Does(() =>
{
  NpmInstall(new NpmInstallSettings {
    WorkingDirectory = "./angular/",
    LogLevel = NpmLogLevel.Warn
  });

  NpmInstall(new NpmInstallSettings {
    WorkingDirectory = "./angularjs/",
    LogLevel = NpmLogLevel.Warn
  });
});

Task("Build")
  .IsDependentOn("Restore")
  .IsDependentOn("Clean")
  .Does(() =>
{
  NpmRunScript(new NpmRunScriptSettings {
    ScriptName = "build:prod",
    WorkingDirectory = "./angular/",
    LogLevel = NpmLogLevel.Warn
  });

  var settings = new NpmRunScriptSettings {
    ScriptName = "build",
    WorkingDirectory = "./angularjs/",
    LogLevel = NpmLogLevel.Warn
  };
  settings.WithArguments($"--nupkg-version={nugetVersion}").WithArguments($"--nupkg-out-path={artifactsDir}").WithArguments($"--output-path={publishDir}");

  NpmRunScript(settings);
});

Task("Pack")
    .IsDependentOn("Build")
    .Does(() =>
{
  OctoPack(pkg, new OctopusPackSettings {
    BasePath = $"angularjs/{publishDir}",
    OutFolder = artifactsDir,
    Format = OctopusPackFormat.Zip,
    Version = nugetVersion,
    Overwrite = true
  });

  OctoPack($"{pkg}.V5", new OctopusPackSettings {
    BasePath = $"angular/{publishDir}",
    OutFolder = artifactsDir,
    Format = OctopusPackFormat.Zip,
    Version = nugetVersion,
    Overwrite = true
  });
});

Task("Publish")
  .IsDependentOn("Pack")
  .Does(() =>
{
  OctoPush(octopusUrl, octopusKey, GetFiles(artifactsDir + "*.zip"),
    new OctopusPushSettings {
      ReplaceExisting = true,
      Space = octopusSpace
    });
});

Task("Deploy")
  .Does(() =>
{
  var branch = gitVersionInfo.BranchName;
  string tenant = "", environment = "", channel = "";

  if(string.Compare(branch, "develop", true) == 0)
  {
    tenant = "Continuous Integration";
    environment = "Development";
    channel = "CI";
  }
  else if(branch.StartsWith("release/"))
  {
    tenant = string.Format("QA-{0}", gitVersionInfo.Minor % releasesToKeep);
    environment = "Development";
    channel = "Release";
  }
  else if(branch.StartsWith("hotfix/"))
  {
    tenant = string.Format("QA-{0}", gitVersionInfo.Minor % releasesToKeep);
    environment = "Development";
    channel = "Release";
  }

  OctoCreateRelease(serviceName, new CreateReleaseSettings {
    Server = octopusUrl,
    ApiKey = octopusKey,
    Space = octopusSpace,
    Channel = channel,
    IgnoreExisting = true,
    ReleaseNumber = nugetVersion,
    DefaultPackageVersion = nugetVersion,
    DeployTo = environment,
    Tenant = new string[] {tenant},
    ShowProgress = true,
    ForcePackageDownload = true,
    WaitForDeployment = true,
    DeploymentTimeout = TimeSpan.FromMinutes(10),
    CancelOnTimeout = true,
    Force = true
  });
});

Task("Default")
  .IsDependentOn("Pack");


//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////
RunTarget(target);

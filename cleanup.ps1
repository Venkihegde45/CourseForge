$filesToRemove = @(
    "d:\Major Project\CourseForge\src\components\dashboard\CommandCenter.jsx",
    "d:\Major Project\CourseForge\src\components\dashboard\HeroBriefing.js",
    "d:\Major Project\CourseForge\src\components\dashboard\StatusGrid.jsx",
    "d:\Major Project\CourseForge\src\components\dashboard\MasterworksGrid.jsx",
    "d:\Major Project\CourseForge\src\components\dashboard\MemoryFeed.jsx",
    "d:\Major Project\CourseForge\src\components\dashboard\QuickActions.jsx",
    "d:\Major Project\CourseForge\src\components\dashboard\HomeInitialization.jsx",
    "d:\Major Project\CourseForge\src\components\layout\MarketingHome.jsx"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Removed: $file"
    } else {
        Write-Host "Not found: $file"
    }
}

Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ARYA K A\.gemini\antigravity\scratch\ponjikkara-sadhya\assets\sadhya_real.jpg"
$outDir = "C:\Users\ARYA K A\.gemini\antigravity\scratch\ponjikkara-sadhya\assets\dishes"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Dish {
    param(
        [string]$name,
        [int]$x,
        [int]$y,
        [int]$w,
        [int]$h,
        [bool]$makeOval = $true
    )

    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    if ($makeOval) {
        $finalBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($finalBmp)
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.Clear([System.Drawing.Color]::Transparent)

        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(2, 2, ($w - 4), ($h - 4))
        $g.SetClip($path)
        $g.DrawImage($cropped, 0, 0, $w, $h)
        $path.Dispose()
        $g.Dispose()
        $cropped.Dispose()
        $finalPath = Join-Path $outDir "$name.png"
        $finalBmp.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $finalBmp.Dispose()
    } else {
        $finalPath = Join-Path $outDir "$name.png"
        $cropped.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $cropped.Dispose()
    }
    Write-Output "Cropped $name ($w x $h)"
}

# 1. Real Rice Mound
Crop-Dish "real_rice" 375 265 375 240 $true

# 2. Real Pappadam
Crop-Dish "real_pappadam" 235 185 200 170 $true

# 3. Banana (Pazham)
Crop-Dish "real_banana" 180 255 160 190 $false

# 4. Upperi (Banana Chips)
Crop-Dish "real_upperi" 105 275 95 95 $true

# 5. Sharkara Varatti
Crop-Dish "real_sharkara" 160 355 85 75 $true

# 6. Inji Puli
Crop-Dish "real_injipuli" 230 135 85 70 $true

# 7. Mango Pickle
Crop-Dish "real_mangopickle" 155 180 105 85 $true

# 8. Thoran
Crop-Dish "real_thoran" 325 125 155 110 $true

# 9. Olan
Crop-Dish "real_olan" 485 130 125 105 $true

# 10. Avial
Crop-Dish "real_avial" 595 95 145 150 $true

# 11. Erissery / Theeyal
Crop-Dish "real_erissery" 725 105 105 115 $true

# 12. Kalan
Crop-Dish "real_kalan" 815 70 115 95 $true

# 13. Khichadi
Crop-Dish "real_khichadi" 790 185 140 145 $true

# 14. Parippu
Crop-Dish "real_parippu" 755 370 95 95 $true

# 15. Sambar on rice
Crop-Dish "real_sambar" 610 290 145 155 $true

# 16. Payasam Uruli
Crop-Dish "real_payasam" 0 430 240 135 $false

# Clean Leaf Texture snippet
$leafRect = New-Object System.Drawing.Rectangle(100, 30, 850, 520)
$leafCrop = $src.Clone($leafRect, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$leafCrop.Save((Join-Path $outDir "real_leaf_texture.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$leafCrop.Dispose()

$src.Dispose()
Write-Output "All dishes cropped successfully!"

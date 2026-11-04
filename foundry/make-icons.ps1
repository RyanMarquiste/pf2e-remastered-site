# Builds the square, black-background Foundry icons from the site's transparent art. The mutagens and Insulating Paste go in
# foundry/corpsecaps-cauldron/images, and the Alchemist vials and coatings in foundry/marquiste-additions/images.
# Usage: powershell -ExecutionPolicy Bypass -File foundry/make-icons.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$cauldron = "mind-doubling-mutagen", "ichthys-mutagen", "insulating-paste"
$names = "mind-doubling-mutagen", "ichthys-mutagen", "insulating-paste", "volatile-vial", "bomber-field-vial", "chirurgeon-field-vial", "mutagenist-field-vial", "toxicologist-field-vial", "toxic-coating", "advanced-toxic-coating"
$size = 512
$fit = 460
foreach ($name in $names) {
  $src = [System.Drawing.Image]::FromFile((Join-Path $root "src\images\$name.png"))
  $scale = [Math]::Min($fit / $src.Width, $fit / $src.Height)
  $w = [int][Math]::Round($src.Width * $scale)
  $h = [int][Math]::Round($src.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Black)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($src, [int](($size - $w) / 2), [int](($size - $h) / 2), $w, $h)
  $g.Dispose()
  $module = if ($cauldron -contains $name) { "corpsecaps-cauldron" } else { "marquiste-additions" }
  $bmp.Save((Join-Path $root "foundry\$module\images\$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose(); $src.Dispose()
  "$name -> ${size}x$size"
}

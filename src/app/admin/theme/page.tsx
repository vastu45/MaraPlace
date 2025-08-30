"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Theme, themes } from "@/lib/theme";
import AdminLayout from "@/components/AdminLayout";

export default function ThemePage() {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();
  const [customTheme, setCustomTheme] = useState<Theme>(currentTheme);
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorType: string, shade: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: {
          ...prev.colors[colorType as keyof typeof prev.colors],
          [shade]: value
        }
      }
    }));
  };

  const handleTypographyChange = (type: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [type]: value
      }
    }));
  };

  const handleFontWeightChange = (weight: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontWeight: {
          ...prev.typography.fontWeight,
          [weight]: value
        }
      }
    }));
  };

  const saveCustomTheme = () => {
    // Save the custom theme
    const themeKey = `custom_${Date.now()}`;
    themes[themeKey] = customTheme;
    setTheme(themeKey);
  };

  const resetToDefault = () => {
    setCustomTheme(currentTheme);
  };

  const ColorPicker = ({ colorType, shade, value }: { colorType: string; shade: string; value: string }) => (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => handleColorChange(colorType, shade, e.target.value)}
        className="w-16 h-10 p-1"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => handleColorChange(colorType, shade, e.target.value)}
        className="w-24"
        placeholder="#000000"
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme Customization</h1>
          <p className="text-gray-600">Customize the look and feel of your MaraPlace application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Theme Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Theme Controls</CardTitle>
                <CardDescription>Select and manage themes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme-select">Current Theme</Label>
                  <Select value={themeName} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {themes[theme].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="preview-mode"
                    checked={previewMode}
                    onCheckedChange={setPreviewMode}
                  />
                  <Label htmlFor="preview-mode">Preview Mode</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveCustomTheme} className="flex-1">
                    Save Theme
                  </Button>
                  <Button onClick={resetToDefault} variant="outline">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your theme looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: customTheme.colors.primary[500], color: 'white' }}>
                    Primary Color
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: customTheme.colors.secondary[500], color: 'white' }}>
                    Secondary Color
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: customTheme.colors.accent[500], color: 'white' }}>
                    Accent Color
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: customTheme.colors.neutral[50] }}>
                    Neutral Background
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Customization */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Palette</CardTitle>
                    <CardDescription>Customize your color scheme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Primary Colors */}
                      <div>
                        <h3 className="font-semibold mb-3">Primary Colors</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.colors.primary).map(([shade, value]) => (
                            <div key={shade} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{shade}</Label>
                              <ColorPicker colorType="primary" shade={shade} value={value} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Secondary Colors */}
                      <div>
                        <h3 className="font-semibold mb-3">Secondary Colors</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.colors.secondary).map(([shade, value]) => (
                            <div key={shade} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{shade}</Label>
                              <ColorPicker colorType="secondary" shade={shade} value={value} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accent Colors */}
                      <div>
                        <h3 className="font-semibold mb-3">Accent Colors</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.colors.accent).map(([shade, value]) => (
                            <div key={shade} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{shade}</Label>
                              <ColorPicker colorType="accent" shade={shade} value={value} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Neutral Colors */}
                      <div>
                        <h3 className="font-semibold mb-3">Neutral Colors</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.colors.neutral).map(([shade, value]) => (
                            <div key={shade} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{shade}</Label>
                              <ColorPicker colorType="neutral" shade={shade} value={value} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Semantic Colors */}
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Semantic Colors</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm">Success</Label>
                          <ColorPicker colorType="success" shade="" value={customTheme.colors.success} />
                        </div>
                        <div>
                          <Label className="text-sm">Warning</Label>
                          <ColorPicker colorType="warning" shade="" value={customTheme.colors.warning} />
                        </div>
                        <div>
                          <Label className="text-sm">Error</Label>
                          <ColorPicker colorType="error" shade="" value={customTheme.colors.error} />
                        </div>
                        <div>
                          <Label className="text-sm">Info</Label>
                          <ColorPicker colorType="info" shade="" value={customTheme.colors.info} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                    <CardDescription>Customize fonts and text styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Font Families */}
                      <div>
                        <h3 className="font-semibold mb-3">Font Families</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">Sans Serif</Label>
                            <Input
                              value={customTheme.typography.fontFamily.sans}
                              onChange={(e) => handleTypographyChange("fontFamily", e.target.value)}
                              placeholder="Inter, sans-serif"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Serif</Label>
                            <Input
                              value={customTheme.typography.fontFamily.serif}
                              onChange={(e) => handleTypographyChange("fontFamily", e.target.value)}
                              placeholder="Georgia, serif"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Monospace</Label>
                            <Input
                              value={customTheme.typography.fontFamily.mono}
                              onChange={(e) => handleTypographyChange("fontFamily", e.target.value)}
                              placeholder="Consolas, monospace"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Font Sizes */}
                      <div>
                        <h3 className="font-semibold mb-3">Font Sizes</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.typography.fontSize).map(([size, value]) => (
                            <div key={size} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{size}</Label>
                              <Input
                                value={value}
                                onChange={(e) => handleTypographyChange("fontSize", e.target.value)}
                                className="w-24"
                                placeholder="1rem"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Font Weights */}
                      <div>
                        <h3 className="font-semibold mb-3">Font Weights</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.typography.fontWeight).map(([weight, value]) => (
                            <div key={weight} className="flex items-center justify-between">
                              <Label className="text-sm w-20">{weight}</Label>
                              <Input
                                value={value}
                                onChange={(e) => handleFontWeightChange(weight, e.target.value)}
                                className="w-20"
                                placeholder="400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Line Heights */}
                      <div>
                        <h3 className="font-semibold mb-3">Line Heights</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.typography.lineHeight).map(([height, value]) => (
                            <div key={height} className="flex items-center justify-between">
                              <Label className="text-sm w-20">{height}</Label>
                              <Input
                                value={value}
                                onChange={(e) => handleTypographyChange("lineHeight", e.target.value)}
                                className="w-20"
                                placeholder="1.5"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spacing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spacing & Layout</CardTitle>
                    <CardDescription>Customize spacing, borders, and shadows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Spacing */}
                      <div>
                        <h3 className="font-semibold mb-3">Spacing Scale</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.spacing).map(([space, value]) => (
                            <div key={space} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{space}</Label>
                              <Input
                                value={value}
                                onChange={(e) => {
                                  setCustomTheme(prev => ({
                                    ...prev,
                                    spacing: {
                                      ...prev.spacing,
                                      [space]: e.target.value
                                    }
                                  }));
                                }}
                                className="w-24"
                                placeholder="1rem"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div>
                        <h3 className="font-semibold mb-3">Border Radius</h3>
                        <div className="space-y-2">
                          {Object.entries(customTheme.borderRadius).map(([radius, value]) => (
                            <div key={radius} className="flex items-center justify-between">
                              <Label className="text-sm w-16">{radius}</Label>
                              <Input
                                value={value}
                                onChange={(e) => {
                                  setCustomTheme(prev => ({
                                    ...prev,
                                    borderRadius: {
                                      ...prev.borderRadius,
                                      [radius]: e.target.value
                                    }
                                  }));
                                }}
                                className="w-24"
                                placeholder="0.375rem"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="components" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Component Styling</CardTitle>
                    <CardDescription>Preview and customize component styles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Button Preview */}
                      <div>
                        <h3 className="font-semibold mb-3">Buttons</h3>
                        <div className="flex gap-4 flex-wrap">
                          <Button style={{ backgroundColor: customTheme.colors.primary[600] }}>
                            Primary Button
                          </Button>
                          <Button variant="outline" style={{ borderColor: customTheme.colors.secondary[500], color: customTheme.colors.secondary[600] }}>
                            Secondary Button
                          </Button>
                          <Button style={{ backgroundColor: customTheme.colors.accent[600] }}>
                            Accent Button
                          </Button>
                        </div>
                      </div>

                      {/* Card Preview */}
                      <div>
                        <h3 className="font-semibold mb-3">Cards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card style={{ borderColor: customTheme.colors.neutral[200] }}>
                            <CardHeader>
                              <CardTitle style={{ color: customTheme.colors.primary[800] }}>Sample Card</CardTitle>
                              <CardDescription>This is a sample card with custom styling</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p style={{ color: customTheme.colors.neutral[600] }}>
                                This card demonstrates how your theme colors will look in practice.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Text Preview */}
                      <div>
                        <h3 className="font-semibold mb-3">Typography Preview</h3>
                        <div className="space-y-2">
                          <h1 style={{ 
                            fontSize: customTheme.typography.fontSize['4xl'],
                            fontWeight: customTheme.typography.fontWeight.bold,
                            color: customTheme.colors.primary[800],
                            fontFamily: customTheme.typography.fontFamily.sans
                          }}>
                            Heading 1
                          </h1>
                          <h2 style={{ 
                            fontSize: customTheme.typography.fontSize['2xl'],
                            fontWeight: customTheme.typography.fontWeight.semibold,
                            color: customTheme.colors.secondary[700],
                            fontFamily: customTheme.typography.fontFamily.sans
                          }}>
                            Heading 2
                          </h2>
                          <p style={{ 
                            fontSize: customTheme.typography.fontSize.base,
                            fontWeight: customTheme.typography.fontWeight.normal,
                            color: customTheme.colors.neutral[600],
                            fontFamily: customTheme.typography.fontFamily.sans,
                            lineHeight: customTheme.typography.lineHeight.normal
                          }}>
                            This is a sample paragraph that demonstrates how your typography settings will look in practice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
} 
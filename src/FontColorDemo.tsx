// import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FontColorDemo = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Font Color Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--primary-text-color, #1f2937)' }}>
            Primary Text Color
          </h3>
          <p style={{ color: 'var(--secondary-text-color, #6b7280)' }}>
            This is how secondary text will appear with the selected color scheme.
          </p>
          <p style={{ color: 'var(--accent-text-color, #3b82f6)' }}>
            This is how accent text will appear with the selected color scheme.
          </p>
        </div>
        
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--background-color, #ffffff)' }}
        >
          <p className="text-sm" style={{ color: 'var(--primary-text-color, #1f2937)' }}>
            This is a preview of how content will look with the selected background and text colors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 
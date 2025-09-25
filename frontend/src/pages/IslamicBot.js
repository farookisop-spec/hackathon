import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bot } from 'lucide-react';

const IslamicBot = () => {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Islamic AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                AI Assistant Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Islamic knowledge AI assistant powered by OpenRouter will be available here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IslamicBot;
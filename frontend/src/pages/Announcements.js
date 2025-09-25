import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Megaphone } from 'lucide-react';

const Announcements = () => {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                Community Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                Announcements Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Important community announcements and updates will be displayed here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Announcements;